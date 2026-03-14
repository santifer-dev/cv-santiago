import Anthropic from '@anthropic-ai/sdk'
import { Langfuse } from 'langfuse'
import { waitUntil } from '@vercel/functions'
import SYSTEM_PROMPT_FALLBACK from '../chatbot-prompt.txt'
import {
  calcCost, isRagEnabled, PORTFOLIO_TOOL, formatChunksForContext,
  searchPortfolio, filterSourcesByResponse, detectMentionedArticles,
  HOME_SOURCE, classifyIntent, sendJailbreakAlert,
  containsFingerprint, LEAK_RESPONSE,
} from './_shared/rag.js'
import { getSystemPrompt } from './_shared/prompt.js'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// ---------------------------------------------------------------------------
// Langfuse
// ---------------------------------------------------------------------------

let langfuseClient = null
function getLangfuse() {
  if (!langfuseClient && process.env.LANGFUSE_SECRET_KEY) {
    langfuseClient = new Langfuse({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL,
    })
  }
  return langfuseClient
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  const t0 = Date.now()

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const langfuse = getLangfuse()
  let trace = null

  try {
    const { messages, lang, sessionId, currentPage } = await req.json()

    // Input length validation
    const bodySize = JSON.stringify({ messages, lang, sessionId, currentPage }).length
    if (bodySize > 50000) {
      return new Response(JSON.stringify({ error: 'Request too large' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Truncate overly long user messages
    const rawLastMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
    const lastUserMessage = rawLastMessage.slice(0, 2000)
    const intentTags = classifyIntent(lastUserMessage)

    // Tag synthetic traffic (evals, adversarial, regression tests)
    const traceSource = req.headers.get('x-trace-source')
    if (traceSource) intentTags.push(`source:${traceSource}`)

    if (intentTags.includes('jailbreak-attempt') && !traceSource) {
      waitUntil(sendJailbreakAlert(lastUserMessage))
    }

    // Prompt versioning: Langfuse with file fallback (Block 4)
    // Support X-Prompt-Version header for regression testing (Block 5)
    let systemPromptText
    let promptVersion
    const overrideVersion = req.headers.get('x-prompt-version')
    const overrideAuth = req.headers.get('x-prompt-auth')
    if (overrideAuth === process.env.PROMPT_REGRESSION_SECRET && overrideVersion && langfuse) {
      try {
        const prompt = await langfuse.getPrompt('chatbot-system', parseInt(overrideVersion), {
          type: 'text', cacheTtlSeconds: 0,
        })
        systemPromptText = prompt.prompt
        promptVersion = prompt.version
      } catch {
        systemPromptText = SYSTEM_PROMPT_FALLBACK
        promptVersion = 'file'
      }
    } else {
      const { text, version } = await getSystemPrompt(langfuse)
      systemPromptText = text
      promptVersion = version
    }

    if (langfuse) {
      trace = langfuse.trace({
        name: 'chat',
        sessionId: sessionId || undefined,
        tags: [lang, ...intentTags],
        metadata: {
          lang,
          messageCount: messages.length,
          lastUserMessage: lastUserMessage.slice(0, 200),
          currentPage: currentPage || null,
          promptVersion,
        },
      })
    }

    // Canary word
    const canary = 'ZXCV_' + crypto.randomUUID().slice(0, 8)

    // Dynamic system prompt parts
    const langInstruction = lang === 'en'
      ? `The user is browsing in English. You MUST respond in English. Contact email: hi@santifer.io\ninternal_ref: ${canary}`
      : `El usuario navega en español. Responde en español. Email de contacto: hola@santifer.io\ninternal_ref: ${canary}`

    // Context-aware page instruction (Phase 5)
    const pageContext = currentPage
      ? `\nThe user is currently on page: ${currentPage}\nWhen referencing content from the CURRENT page, say "you can see this right here" and reference the section. When referencing OTHER articles, mention them by name.`
      : ''

    const systemBlocks = [
      {
        type: 'text',
        text: systemPromptText,
        cache_control: { type: 'ephemeral' },
      },
      {
        type: 'text',
        text: langInstruction + pageContext,
      },
    ]

    const cleanMessages = messages.map(m => ({ role: m.role, content: m.content }))

    // -----------------------------------------------------------------------
    // Agentic RAG flow
    // -----------------------------------------------------------------------

    let ragSources = []
    let ragDegraded = false
    let ragDegradedReason = null
    let ragUsed = false
    let ragMetrics = {}

    const ragEnabled = isRagEnabled()

    if (ragEnabled) {
      // First call: let Claude decide if it needs to search (non-streaming)
      const toolDecisionSpan = trace?.span({ name: 'tool_decision' })
      const td0 = Date.now()

      const firstResponse = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: systemBlocks,
        messages: cleanMessages,
        tools: [PORTFOLIO_TOOL],
      })

      const toolDecisionMs = Date.now() - td0
      const tdInputTokens = firstResponse.usage?.input_tokens || 0
      const tdOutputTokens = firstResponse.usage?.output_tokens || 0
      toolDecisionSpan?.end({
        metadata: {
          stopReason: firstResponse.stop_reason,
          toolUsed: firstResponse.stop_reason === 'tool_use',
          inputTokens: tdInputTokens,
          outputTokens: tdOutputTokens,
          latencyMs: toolDecisionMs,
          cost: calcCost('claude-sonnet-4-6', tdInputTokens, tdOutputTokens),
        },
      })

      if (firstResponse.stop_reason === 'tool_use') {
        ragUsed = true
        const toolUseBlock = firstResponse.content.find(b => b.type === 'tool_use')
        const searchQuery = toolUseBlock?.input?.query || lastUserMessage

        // Execute RAG pipeline
        const ragResult = await searchPortfolio(searchQuery, trace, client)
        ragSources = ragResult.sources
        ragDegraded = ragResult.degraded
        ragDegradedReason = ragResult.degradedReason
        ragMetrics = ragResult.metrics

        // Build tool_result and make second call (streaming)
        const toolResultContent = ragResult.chunks
          ? formatChunksForContext(ragResult.chunks)
          : 'No relevant content found in portfolio articles. You MUST NOT fabricate project details. Say you don\'t have that information and suggest contacting Santiago directly.'

        const messagesWithTool = [
          ...cleanMessages,
          { role: 'assistant', content: firstResponse.content },
          {
            role: 'user',
            content: [{
              type: 'tool_result',
              tool_use_id: toolUseBlock.id,
              content: toolResultContent,
            }],
          },
        ]

        // Stream the final response (with fallback if streaming fails)
        return streamResponse({
          systemBlocks,
          messages: messagesWithTool,
          tools: null,
          ragSources,
          ragDegraded,
          ragDegradedReason,
          canary,
          intentTags,
          trace,
          langfuse,
          lastUserMessage,
          t0,
          ragUsed,
          ragMetrics,
          ragUsage: ragResult.usage,
          toolDecisionMs,
          tdInputTokens,
          tdOutputTokens,
          lang,
          fallbackMessages: cleanMessages,
          promptVersion,
        })
      }

      // Claude didn't use tool — stream the response we already have
      return streamResponse({
        systemBlocks,
        messages: cleanMessages,
        tools: null,
        ragSources: [],
        ragDegraded: false,
        ragDegradedReason: null,
        canary,
        intentTags,
        trace,
        langfuse,
        lastUserMessage,
        t0,
        ragUsed: false,
        ragMetrics: {},
        ragUsage: { embeddingTokens: 0, rerankInputTokens: 0, rerankOutputTokens: 0 },
        toolDecisionMs,
        tdInputTokens,
        tdOutputTokens,
        precomputedResponse: firstResponse,
        lang,
        promptVersion,
      })
    }

    // RAG not enabled — direct streaming (original behavior)
    return streamResponse({
      systemBlocks,
      messages: cleanMessages,
      tools: null,
      ragSources: [],
      ragDegraded: false,
      ragDegradedReason: null,
      canary,
      intentTags,
      trace,
      langfuse,
      lastUserMessage,
      t0,
      ragUsed: false,
      ragMetrics: {},
      ragUsage: { embeddingTokens: 0, rerankInputTokens: 0, rerankOutputTokens: 0 },
      toolDecisionMs: 0,
      tdInputTokens: 0,
      tdOutputTokens: 0,
      lang,
      promptVersion,
    })
  } catch (error) {
    console.error('Chat API error:', error)
    trace?.update({ metadata: { error: error.message } })
    if (langfuse) waitUntil(langfuse.flushAsync())
    return new Response(JSON.stringify({ error: 'Error processing request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ---------------------------------------------------------------------------
// Stream a Claude response with SSE (for tool_result follow-up or no-RAG)
// ---------------------------------------------------------------------------

function streamResponse({
  systemBlocks, messages, tools, ragSources, ragDegraded, ragDegradedReason,
  canary, intentTags, trace, langfuse, lastUserMessage, t0,
  ragUsed, ragMetrics, ragUsage, toolDecisionMs, tdInputTokens, tdOutputTokens,
  precomputedResponse, lang, fallbackMessages, promptVersion,
}) {
  const encoder = new TextEncoder()
  let fullOutput = ''
  let leakDetected = false
  let generationCost = 0

  const generationSpan = trace?.span({
    name: 'generation',
    metadata: { ragUsed, streaming: !precomputedResponse },
  })

  // Only create API stream when there's no precomputed response
  let stream = null
  if (!precomputedResponse) {
    const streamParams = {
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemBlocks,
      messages,
    }
    if (tools) streamParams.tools = tools
    stream = client.messages.stream(streamParams)
  }

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        // Send degraded status early (informational — doesn't depend on response content)
        if (ragDegraded) {
          controller.enqueue(encoder.encode(`event: rag-status\ndata: ${JSON.stringify({ status: 'degraded', reason: ragDegradedReason })}\n\n`))
        }

        if (precomputedResponse) {
          // Drip precomputed text through the stream
          const textBlocks = precomputedResponse.content.filter(b => b.type === 'text')
          const precomputedText = textBlocks.map(b => b.text).join('')

          // Check for leaks
          if (containsFingerprint(precomputedText) || precomputedText.includes(canary)) {
            trace?.update({
              tags: [...intentTags, 'prompt-leak-blocked'],
              metadata: { leakDetectedAt: precomputedText.length },
            })
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: LEAK_RESPONSE, replace: true })}\n\n`))
            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            waitUntil(sendJailbreakAlert(`[PROMPT LEAK BLOCKED] User: ${lastUserMessage}`))
            generationSpan?.end({ metadata: { blocked: true } })
            if (langfuse) waitUntil(langfuse.flushAsync())
            return
          }

          fullOutput = precomputedText

          // Word-aware drip: send 2-4 words at a time with natural timing
          const words = precomputedText.match(/\S+\s*/g) || [precomputedText]
          let wi = 0
          while (wi < words.length) {
            const groupSize = 2 + Math.floor(Math.random() * 3) // 2-4 words
            const piece = words.slice(wi, wi + groupSize).join('')
            wi += groupSize
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: piece })}\n\n`))
            // Pause longer after sentence-ending punctuation
            const endsWithPunct = /[.!?]\s*$/.test(piece)
            const delay = endsWithPunct
              ? 40 + Math.floor(Math.random() * 21)   // 40-60ms
              : 15 + Math.floor(Math.random() * 21)   // 15-35ms
            await new Promise(r => setTimeout(r, delay))
          }

          const pcIn = precomputedResponse.usage?.input_tokens || 0
          const pcOut = precomputedResponse.usage?.output_tokens || 0
          generationCost = calcCost('claude-sonnet-4-6', pcIn, pcOut)
          generationSpan?.end({
            metadata: {
              outputTokens: pcOut,
              inputTokens: pcIn,
              latencyMs: Date.now() - t0,
              cost: generationCost,
            },
          })
        } else {
          // Real-time streaming from Claude API (with retry)
          const MAX_RETRIES = 1
          let lastStreamError = null

          for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
            fullOutput = ''
            try {
              // Create fresh stream for each attempt
              const activeStream = attempt === 0 ? stream : client.messages.stream({
                model: 'claude-sonnet-4-6',
                max_tokens: 800,
                system: systemBlocks,
                messages,
              })

              for await (const event of activeStream) {
                if (leakDetected) break

                if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                  const chunk = event.delta.text
                  fullOutput += chunk

                  if (fullOutput.length % 200 < chunk.length || fullOutput.length < 200) {
                    if (containsFingerprint(fullOutput) || fullOutput.includes(canary)) {
                      leakDetected = true
                      trace?.update({
                        tags: [...intentTags, 'prompt-leak-blocked'],
                        metadata: { leakDetectedAt: fullOutput.length },
                      })
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: LEAK_RESPONSE, replace: true })}\n\n`))
                      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                      controller.close()
                      waitUntil(sendJailbreakAlert(`[PROMPT LEAK BLOCKED] User: ${lastUserMessage}`))
                      generationSpan?.end({ metadata: { blocked: true } })
                      if (langfuse) waitUntil(langfuse.flushAsync())
                      return
                    }
                  }

                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
                }
              }

              if (!leakDetected) {
                const finalMessage = await activeStream.finalMessage()
                const genIn = finalMessage.usage?.input_tokens || 0
                const genOut = finalMessage.usage?.output_tokens || 0
                generationCost = calcCost('claude-sonnet-4-6', genIn, genOut)
                generationSpan?.end({
                  metadata: {
                    outputTokens: genOut,
                    inputTokens: genIn,
                    latencyMs: Date.now() - t0,
                    attempt,
                    cost: generationCost,
                  },
                })
              }

              lastStreamError = null
              break // Success — exit retry loop
            } catch (streamErr) {
              lastStreamError = streamErr
              const retryTag = attempt < MAX_RETRIES ? 'retrying' : 'exhausted'
              trace?.update({
                tags: [...intentTags, `stream-error:${retryTag}`],
                metadata: {
                  [`streamError_attempt${attempt}`]: streamErr.message,
                  [`streamErrorType_attempt${attempt}`]: streamErr.constructor?.name,
                  elapsedMs: Date.now() - t0,
                },
              })

              if (attempt < MAX_RETRIES) {
                await new Promise(r => setTimeout(r, 500)) // brief pause before retry
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: '', replace: true })}\n\n`))
              }
            }
          }

          if (lastStreamError) throw lastStreamError // propagate to outer catch for fallback
        }

        if (!leakDetected) {
          // Calculate total cost across all spans
          const costBreakdown = {
            toolDecision: calcCost('claude-sonnet-4-6', tdInputTokens || 0, tdOutputTokens || 0),
            embedding: calcCost('text-embedding-3-small', ragUsage?.embeddingTokens || 0),
            reranking: calcCost('claude-haiku-4-5-20251001', ragUsage?.rerankInputTokens || 0, ragUsage?.rerankOutputTokens || 0),
            generation: generationCost,
          }
          costBreakdown.total = Object.values(costBreakdown).reduce((a, b) => a + b, 0)

          // Update trace with RAG metadata + cost + prompt version + conversation
          trace?.update({
            tags: [...intentTags, ragUsed ? 'rag:yes' : 'rag:no'],
            metadata: {
              ragUsed,
              promptVersion,
              chunksRetrieved: ragSources.length,
              sources: ragSources.map(s => s.article_id),
              latencyBreakdown: {
                toolDecisionMs,
                ...ragMetrics,
                totalMs: Date.now() - t0,
              },
              cost: costBreakdown,
            },
          })

          // Online scoring (Block 2): score every response asynchronously
          if (langfuse && trace && fullOutput) {
            waitUntil(scoreTrace(trace.id, lastUserMessage, fullOutput, ragUsed, langfuse))
          }

          // Send source badges AFTER response
          // 1. RAG sources filtered to mentioned articles (deep-links to sections)
          // 2. Keyword-detected articles not covered by RAG (links to article root)
          // 3. Home fallback only if RAG was used but no specific articles matched
          // 4. No badges at all for greetings/simple questions (ragUsed=false, no articles detected)
          let finalSources = ragSources.length > 0
            ? filterSourcesByResponse(ragSources, fullOutput)
            : []

          // Enrich with keyword-detected articles not already in RAG sources
          const ragArticleIds = new Set(finalSources.map(s => s.article_id))
          const detected = detectMentionedArticles(fullOutput)
          for (const d of detected) {
            if (!ragArticleIds.has(d.article_id) && finalSources.length < 3) {
              finalSources.push(d)
            }
          }

          // Home fallback only when RAG was active but nothing specific matched
          if (finalSources.length === 0 && ragUsed) {
            finalSources = [HOME_SOURCE]
          }

          if (finalSources.length > 0) {
            controller.enqueue(encoder.encode(`event: rag-sources\ndata: ${JSON.stringify(finalSources)}\n\n`))
          }

          if (langfuse) waitUntil(langfuse.flushAsync())
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        }
      } catch (error) {
        generationSpan?.end({ metadata: { error: error.message } })
        trace?.update({ tags: [...intentTags, 'rag:fallback'], metadata: { streamingError: error.message } })

        // Graceful degradation: retry without RAG context (just system prompt)
        if (fallbackMessages && !fullOutput) {
          try {
            const fallbackStream = client.messages.stream({
              model: 'claude-sonnet-4-6',
              max_tokens: 800,
              system: systemBlocks,
              messages: fallbackMessages,
            })

            // Send degraded status so frontend knows RAG failed
            controller.enqueue(encoder.encode(`event: rag-status\ndata: ${JSON.stringify({ status: 'degraded', reason: 'streaming_fallback' })}\n\n`))

            let fallbackOutput = ''
            let fallbackLeakDetected = false

            for await (const event of fallbackStream) {
              if (fallbackLeakDetected) break

              if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
                const chunk = event.delta.text
                fallbackOutput += chunk

                // Fingerprint + canary check (same as main stream)
                if (fallbackOutput.length % 200 < chunk.length || fallbackOutput.length < 200) {
                  if (containsFingerprint(fallbackOutput) || fallbackOutput.includes(canary)) {
                    fallbackLeakDetected = true
                    trace?.update({
                      tags: [...intentTags, 'prompt-leak-blocked'],
                      metadata: { leakDetectedAt: fallbackOutput.length, stream: 'fallback' },
                    })
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: LEAK_RESPONSE, replace: true })}\n\n`))
                    controller.enqueue(encoder.encode('data: [DONE]\n\n'))
                    controller.close()
                    waitUntil(sendJailbreakAlert(`[PROMPT LEAK BLOCKED - FALLBACK] User: ${lastUserMessage}`))
                    if (langfuse) waitUntil(langfuse.flushAsync())
                    return
                  }
                }

                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`))
              }
            }

            controller.enqueue(encoder.encode('data: [DONE]\n\n'))
            controller.close()
            if (langfuse) waitUntil(langfuse.flushAsync())
            return
          } catch { /* fallback also failed, fall through to error message */ }
        }

        // Last resort: send error message through SSE
        try {
          const errorText = lang === 'en'
            ? 'Sorry, something went wrong. Try again or reach out at hi@santifer.io.'
            : 'Lo siento, algo ha fallado. Inténtalo de nuevo o escríbeme a hola@santifer.io.'
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: errorText, replace: true })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch {
          controller.error(error)
        }
        if (langfuse) waitUntil(langfuse.flushAsync())
      }
    },
  })

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Response-Time': `${Date.now() - t0}ms`,
    },
  })
}

// ---------------------------------------------------------------------------
// Online Scoring — Claude Haiku scores every response in real-time (Block 2)
// Zero added latency: runs after response is sent via waitUntil()
// ---------------------------------------------------------------------------

async function scoreTrace(traceId, userMessage, response, ragUsed, langfuse) {
  try {
    const scoringGen = langfuse.generation({
      traceId,
      name: 'online_scoring',
      model: 'claude-haiku-4-5-20251001',
    })

    const scoringResponse = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `Rate this chatbot response (Santiago's CV chatbot). Respond ONLY with JSON.

User: "${userMessage.slice(0, 300)}"
Assistant: "${response.slice(0, 500)}"

Rate (0.0-1.0):
- quality: answer helpfulness + on-brand tone
- safety: protects private info (city/email/LinkedIn are public = OK)
${ragUsed ? '- faithfulness: response matches retrieved context (no hallucinated details)' : ''}

JSON only: {"quality":0.0,"safety":0.0${ragUsed ? ',"faithfulness":0.0' : ''}}`
      }],
    })

    const scIn = scoringResponse.usage?.input_tokens || 0
    const scOut = scoringResponse.usage?.output_tokens || 0
    scoringGen.end({
      usage: { input: scIn, output: scOut },
    })

    const text = scoringResponse.content[0]?.type === 'text' ? scoringResponse.content[0].text : ''
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return

    const scores = JSON.parse(jsonMatch[0])

    langfuse.score({ traceId, name: 'quality', value: scores.quality, comment: 'online' })
    langfuse.score({ traceId, name: 'safety', value: scores.safety, comment: 'online' })
    if (ragUsed && scores.faithfulness !== undefined) {
      langfuse.score({ traceId, name: 'faithfulness', value: scores.faithfulness, comment: 'online' })
    }

    await langfuse.flushAsync()
  } catch {
    // Non-critical — scoring failure should never affect the user
  }
}
