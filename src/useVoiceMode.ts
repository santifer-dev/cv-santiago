import { useState, useRef, useCallback, useEffect } from 'react';
import { useAudioAnalyser } from './useAudioAnalyser';

export type VoiceStatus = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

interface TranscriptEntry {
  role: 'user' | 'assistant';
  text: string;
}

export interface VoiceState {
  status: VoiceStatus;
  transcript: TranscriptEntry[];
  error: string | null;
  remainingSeconds: number;
  inputLevel: number;
  outputLevel: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface RagSource {
  article_id: string;
  section_id: string;
  section_anchor: string;
  page_path_en: string;
  page_path_es: string;
  article_slug_en: string;
  article_slug_es: string;
}

export const SESSION_TIMEOUT_S = 120;

export function useVoiceMode() {
  const [status, setStatus] = useState<VoiceStatus>('idle');
  const [transcript, _setTranscript] = useState<TranscriptEntry[]>([]);
  const setTranscript: typeof _setTranscript = (update) => {
    _setTranscript(prev => {
      const next = typeof update === 'function' ? update(prev) : update;
      transcriptRef.current = next;
      return next;
    });
  };
  const [error, setError] = useState<string | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(SESSION_TIMEOUT_S);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceSources, setVoiceSources] = useState<RagSource[]>([]);
  const currentPageRef = useRef('');
  const addDebug = (msg: string) => { console.log('[Voice]', msg); setDebugLog(prev => [...prev.slice(-9), msg]); };

  const wsRef = useRef<WebSocket | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const workletNodeRef = useRef<AudioWorkletNode | ScriptProcessorNode | null>(null);
  const traceIdRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingListenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thinkingSoundStopRef = useRef<(() => void) | null>(null);
  const sessionStartRef = useRef(0);
  const langRef = useRef('es');
  const sessionIdRef = useRef('');
  const transcriptRef = useRef<TranscriptEntry[]>([]);

  // Audio analysis
  const inputAnalyser = useAudioAnalyser();
  const outputAnalyser = useAudioAnalyser();

  // Audio playback
  const playbackContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef(0);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);

  // Track partial transcripts for live display
  const currentTranscriptRef = useRef('');

  // Audio-synced subtitles: track audio duration to pace text display
  const totalAudioDurationRef = useRef(0);
  const audioStartTimeRef = useRef(0);
  const subtitleRafRef = useRef(0);

  const isSupported = typeof window !== 'undefined'
    && typeof navigator !== 'undefined'
    && !!navigator.mediaDevices?.getUserMedia
    && typeof WebSocket !== 'undefined';

  // --- Audio-synced subtitles ---
  // Uses audioContext.currentTime vs scheduled audio duration to pace text display
  function startSubtitleLoop() {
    if (subtitleRafRef.current) return; // already running

    function tick() {
      const ctx = playbackContextRef.current;
      const totalDuration = totalAudioDurationRef.current;
      const fullText = currentTranscriptRef.current;

      if (!ctx || totalDuration === 0 || !fullText) {
        subtitleRafRef.current = requestAnimationFrame(tick);
        return;
      }

      const elapsed = ctx.currentTime - audioStartTimeRef.current;
      const progress = Math.min(elapsed / totalDuration, 1);
      const charIndex = Math.floor(progress * fullText.length);

      // Show last ~120 chars of the revealed text (subtitle window)
      const revealed = fullText.slice(0, charIndex);
      if (revealed.length > 120) {
        setLiveTranscript('…' + revealed.slice(-120).trimStart());
      } else {
        setLiveTranscript(revealed);
      }

      subtitleRafRef.current = requestAnimationFrame(tick);
    }

    subtitleRafRef.current = requestAnimationFrame(tick);
  }

  function stopSubtitleLoop() {
    if (subtitleRafRef.current) {
      cancelAnimationFrame(subtitleRafRef.current);
      subtitleRafRef.current = 0;
    }
    totalAudioDurationRef.current = 0;
    audioStartTimeRef.current = 0;
    setLiveTranscript('');
  }

  // --- Thinking/searching sound effects (subtle pips like ChatGPT) ---
  function stopThinkingSound() {
    if (thinkingSoundStopRef.current) {
      thinkingSoundStopRef.current();
      thinkingSoundStopRef.current = null;
    }
  }

  function startThinkingSound() {
    stopThinkingSound();
    const ctx = playbackContextRef.current;
    if (!ctx || ctx.state === 'closed') return;

    let running = true;
    const notes = [523, 587, 659, 698]; // C5, D5, E5, F5
    let noteIdx = 0;

    function playPip() {
      if (!running || !ctx || ctx.state === 'closed') return;

      try {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = notes[noteIdx % notes.length];
        noteIdx++;

        const gain = ctx.createGain();
        const now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
      } catch { /* context may be closed */ }

      setTimeout(playPip, 550 + Math.random() * 200);
    }

    // Small initial delay before first pip
    setTimeout(playPip, 300);

    thinkingSoundStopRef.current = () => { running = false; };
  }

  const cleanup = useCallback(() => {
    // Stop thinking sound and subtitles
    stopThinkingSound();
    stopSubtitleLoop();

    // Cancel pending listen transition
    if (pendingListenTimerRef.current) {
      clearTimeout(pendingListenTimerRef.current);
      pendingListenTimerRef.current = null;
    }

    // Stop timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Stop media tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }

    // Disconnect audio processing
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
    }

    // Close audio contexts
    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close().catch(() => {});
    }
    audioContextRef.current = null;

    if (playbackContextRef.current?.state !== 'closed') {
      playbackContextRef.current?.close().catch(() => {});
    }
    playbackContextRef.current = null;

    inputAnalyser.disconnect();
    outputAnalyser.disconnect();
    analyserNodeRef.current = null;
  }, [inputAnalyser, outputAnalyser]);

  // Send voice trace to backend
  const sendTrace = useCallback(async (transcriptData: TranscriptEntry[], lang: string, sessionId: string) => {
    if (!traceIdRef.current) return;
    try {
      await fetch('/api/voice-trace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          traceId: traceIdRef.current,
          sessionId,
          transcript: transcriptData,
          durationMs: Date.now() - sessionStartRef.current,
          lang,
        }),
      });
    } catch {
      // Non-critical
    }
  }, []);

  // Ensure transcript is sent even if the user closes the tab/navigates away
  useEffect(() => {
    const sendBeaconTrace = () => {
      if (!traceIdRef.current || transcriptRef.current.length === 0) return;
      // sendBeacon works even during page unload
      const blob = new Blob([JSON.stringify({
        traceId: traceIdRef.current,
        sessionId: sessionIdRef.current,
        transcript: transcriptRef.current,
        durationMs: Date.now() - sessionStartRef.current,
        lang: langRef.current,
      })], { type: 'application/json' });
      navigator.sendBeacon('/api/voice-trace', blob);
      traceIdRef.current = null; // Prevent duplicate sends
    };

    window.addEventListener('beforeunload', sendBeaconTrace);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') sendBeaconTrace();
    });

    return () => {
      window.removeEventListener('beforeunload', sendBeaconTrace);
    };
  }, []);

  const stop = useCallback(() => {
    cleanup();
    setStatus('idle');
    setRemainingSeconds(SESSION_TIMEOUT_S);
  }, [cleanup]);

  const start = useCallback(async (history: Message[], lang: string, sessionId: string, currentPage?: string) => {
    currentPageRef.current = currentPage || '';
    langRef.current = lang;
    sessionIdRef.current = sessionId;
    setVoiceSources([]);
    if (!isSupported) {
      setError('unsupported');
      setStatus('error');
      return;
    }

    setStatus('connecting');
    setError(null);
    setTranscript([]);
    transcriptRef.current = [];
    setRemainingSeconds(SESSION_TIMEOUT_S);
    sessionStartRef.current = Date.now();
    currentTranscriptRef.current = '';

    try {
      // 1. Get ephemeral token
      const tokenRes = await fetch('/api/voice-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lang, sessionId }),
      });

      if (!tokenRes.ok) {
        const data = await tokenRes.json().catch(() => ({}));
        if (tokenRes.status === 429) {
          setError(data.error === 'rate_limited' ? 'rateLimited' : 'rateLimited');
          setStatus('error');
          return;
        }
        throw new Error(data.error || 'Failed to get voice token');
      }

      const { token, traceId } = await tokenRes.json();
      traceIdRef.current = traceId;
      addDebug(`Token: ${token ? 'OK' : 'MISSING'}`);

      if (!token) throw new Error('No token received');

      // 2. Request microphone access
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setError('micDenied');
        setStatus('error');
        return;
      }
      mediaStreamRef.current = stream;

      // 3. Set up audio capture
      const audioContext = new AudioContext({ sampleRate: 24000 });
      audioContextRef.current = audioContext;
      // Resume explicitly — user gesture may have expired after the awaits above
      if (audioContext.state === 'suspended') await audioContext.resume();
      addDebug(`AudioCtx: ${audioContext.sampleRate}Hz, state=${audioContext.state}`);

      const source = audioContext.createMediaStreamSource(stream);
      const inputAnalyserNode = audioContext.createAnalyser();
      source.connect(inputAnalyserNode);
      inputAnalyser.connect(inputAnalyserNode);

      // 4. Set up audio playback
      const playbackContext = new AudioContext({ sampleRate: 24000 });
      playbackContextRef.current = playbackContext;
      nextPlayTimeRef.current = 0;
      if (playbackContext.state === 'suspended') await playbackContext.resume();

      const outAnalyserNode = playbackContext.createAnalyser();
      outAnalyserNode.connect(playbackContext.destination);
      analyserNodeRef.current = outAnalyserNode;
      outputAnalyser.connect(outAnalyserNode);

      // 5. Connect WebSocket to OpenAI Realtime API
      // Note: OpenAI responds with 'realtime' as the selected subprotocol —
      // it MUST be in the client's list or the browser rejects the handshake.
      addDebug('Connecting WS to OpenAI...');
      const ws = new WebSocket(
        'wss://api.openai.com/v1/realtime?model=gpt-realtime-2025-08-28',
        ['realtime', `openai-insecure-api-key.${token}`, 'openai-beta.realtime-v1'],
      );
      wsRef.current = ws;

      ws.onopen = () => {
        addDebug('WS connected — sending session.update');
        // Re-configure session via WebSocket — REST-configured turn_detection
        // may not properly activate the input_audio_buffer pipeline.
        ws.send(JSON.stringify({
          type: 'session.update',
          session: {
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 500,
              create_response: true,
              interrupt_response: true,
            },
            input_audio_format: 'pcm16',
            input_audio_transcription: { model: 'whisper-1' },
          },
        }));

        // Send conversation history for context
        if (history.length > 0) {
          const historyText = history
            .filter(m => m.content && m.content.trim())
            .map(m => `${m.role === 'user' ? 'User' : 'Santiago'}: ${m.content}`)
            .join('\n');

          if (historyText) {
            ws.send(JSON.stringify({
              type: 'conversation.item.create',
              item: {
                type: 'message',
                role: 'user',
                content: [{
                  type: 'input_text',
                  text: `[Previous text conversation for context — do NOT repeat or reference this directly, just use it to maintain continuity]\n${historyText}`,
                }],
              },
            }));
          }
        }
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        // Start audio capture only after session is fully configured via WebSocket
        if (data.type === 'session.updated') {
          addDebug('session.updated — starting audio capture');
          setStatus('listening');
          try {
            startAudioCapture(audioContext, source, ws);
            addDebug('Audio capture started OK');
          } catch (e) {
            addDebug(`Audio capture FAILED: ${e}`);
            console.error('Audio capture setup failed:', e);
          }

          // Start session timer
          timerRef.current = setInterval(() => {
            setRemainingSeconds(prev => {
              if (prev <= 1) {
                stop();
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }

        handleRealtimeEvent(data, ws, lang, sessionId);
      };

      ws.onerror = (e) => {
        console.error('Voice WebSocket error:', e);
        addDebug(`WS ERROR: ${(e as ErrorEvent).message || 'unknown'}`);
        setError('connection');
        setStatus('error');
        cleanup();
      };

      ws.onclose = (e) => {
        addDebug(`WS CLOSE: code=${e.code} reason=${e.reason || 'none'}`);
        // Use setStatus callback to check current status without stale closure
        setStatus(currentStatus => {
          if (currentStatus !== 'idle' && currentStatus !== 'error') {
            setTranscript(prev => {
              sendTrace(prev, lang, sessionId);
              return prev;
            });
            cleanup();
            return 'idle';
          }
          return currentStatus;
        });
      };
    } catch (err) {
      console.error('Voice mode error:', err);
      addDebug(`CATCH: ${err instanceof Error ? err.message : String(err)}`);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
      cleanup();
    }
  }, [isSupported, cleanup, stop, inputAnalyser, outputAnalyser, sendTrace]);

  // PCM audio capture via ScriptProcessorNode (widely supported)
  function startAudioCapture(audioContext: AudioContext, source: MediaStreamAudioSourceNode, ws: WebSocket) {
    const actualRate = audioContext.sampleRate;
    const targetRate = 24000;
    const resampleRatio = actualRate / targetRate; // e.g. 2.0 for 48kHz→24kHz
    const needsResample = Math.abs(resampleRatio - 1) > 0.01;

    addDebug(`Rate: ${actualRate}Hz → ${targetRate}Hz ${needsResample ? `(resample ${resampleRatio.toFixed(1)}x)` : '(native)'}`);

    // Use ScriptProcessorNode for broad compatibility
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    let chunkCount = 0;
    workletNodeRef.current = processor;

    source.connect(processor);
    // Connect to destination via silent GainNode (required for onaudioprocess to fire,
    // but we don't want to play mic audio back through speakers)
    const silentGain = audioContext.createGain();
    silentGain.gain.value = 0;
    processor.connect(silentGain);
    silentGain.connect(audioContext.destination);

    processor.onaudioprocess = (event) => {
      if (ws.readyState !== WebSocket.OPEN) return;

      const inputData = event.inputBuffer.getChannelData(0);

      // Downsample to 24kHz if browser uses a different rate (common on iOS: 48kHz)
      let samples: Float32Array;
      if (needsResample) {
        const outLen = Math.floor(inputData.length / resampleRatio);
        samples = new Float32Array(outLen);
        for (let i = 0; i < outLen; i++) {
          // Linear interpolation for smoother resampling
          const srcIdx = i * resampleRatio;
          const idx0 = Math.floor(srcIdx);
          const idx1 = Math.min(idx0 + 1, inputData.length - 1);
          const frac = srcIdx - idx0;
          samples[i] = inputData[idx0] * (1 - frac) + inputData[idx1] * frac;
        }
      } else {
        samples = inputData;
      }

      // Convert Float32 to Int16
      const pcm16 = new Int16Array(samples.length);
      for (let i = 0; i < samples.length; i++) {
        const s = Math.max(-1, Math.min(1, samples[i]));
        pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
      }

      // Encode to base64
      const bytes = new Uint8Array(pcm16.buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);

      ws.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64,
      }));
      chunkCount++;
      if (chunkCount === 1 || chunkCount % 30 === 0) {
        // Log RMS of first chunk and every ~5s to verify audio has signal
        let rms = 0;
        for (let i = 0; i < samples.length; i++) rms += samples[i] * samples[i];
        rms = Math.sqrt(rms / samples.length);
        addDebug(`chunk#${chunkCount} rms=${rms.toFixed(4)} len=${samples.length}`);
      }
    };
  }

  // Handle events from OpenAI Realtime API
  const handleRealtimeEvent = useCallback((data: Record<string, unknown>, ws: WebSocket, lang: string, sessionId: string) => {
    // Log all events for debugging (remove in production)
    if (data.type !== 'response.audio.delta' && data.type !== 'input_audio_buffer.speech_started') {
      console.log('[Voice]', data.type, data.type === 'error' ? data.error : '');
    }

    switch (data.type) {
      case 'input_audio_buffer.speech_started':
        setDebugLog(prev => [...prev.slice(-9), 'VAD: speech_started']);
        // Cancel any pending listen transition
        if (pendingListenTimerRef.current) {
          clearTimeout(pendingListenTimerRef.current);
          pendingListenTimerRef.current = null;
        }
        stopThinkingSound();
        stopSubtitleLoop();
        currentTranscriptRef.current = '';
        // Stop audio playback when user interrupts (barge-in)
        if (playbackContextRef.current) {
          playbackContextRef.current.close().catch(() => {});
          const newCtx = new AudioContext({ sampleRate: 24000 });
          playbackContextRef.current = newCtx;
          nextPlayTimeRef.current = 0;
          const outNode = newCtx.createAnalyser();
          outNode.connect(newCtx.destination);
          analyserNodeRef.current = outNode;
          outputAnalyser.connect(outNode);
        }
        setStatus('listening');
        break;

      case 'input_audio_buffer.speech_stopped':
        setDebugLog(prev => [...prev.slice(-9), 'VAD: speech_stopped']);
        setStatus('thinking');
        startThinkingSound();
        break;

      case 'conversation.item.input_audio_transcription.completed': {
        const userText = data.transcript as string;
        if (userText?.trim()) {
          setTranscript(prev => [...prev, { role: 'user', text: userText.trim() }]);
        }
        break;
      }

      case 'response.audio.delta': {
        stopThinkingSound();
        setStatus('speaking');
        setIsSearching(false);
        // Decode and play audio
        const audioData = data.delta as string;
        if (audioData && playbackContextRef.current) {
          // Track audio duration for subtitle sync (PCM16 = 2 bytes/sample, 24kHz)
          const byteLen = Math.floor(audioData.length * 3 / 4); // base64 → bytes estimate
          const chunkDuration = (byteLen / 2) / 24000;
          if (totalAudioDurationRef.current === 0) {
            // First audio chunk — record playback start time
            audioStartTimeRef.current = playbackContextRef.current.currentTime;
            startSubtitleLoop();
          }
          totalAudioDurationRef.current += chunkDuration;

          try {
            playAudioChunk(audioData, playbackContextRef.current);
          } catch (e) {
            console.warn('[Voice] Audio chunk playback error:', e);
          }
        }
        break;
      }

      case 'response.audio_transcript.delta': {
        // Accumulate transcript text — subtitle loop reads from ref to pace display
        currentTranscriptRef.current += (data.delta as string) || '';
        break;
      }

      case 'response.audio_transcript.done': {
        const text = (data.transcript as string) || currentTranscriptRef.current;
        if (text?.trim()) {
          setTranscript(prev => [...prev, { role: 'assistant', text: text.trim() }]);
        }
        currentTranscriptRef.current = '';
        stopSubtitleLoop();
        break;
      }

      case 'response.done': {
        // Wait for playback to finish before showing "listening"
        const pbCtx = playbackContextRef.current;
        if (pbCtx && nextPlayTimeRef.current > pbCtx.currentTime) {
          const delayMs = (nextPlayTimeRef.current - pbCtx.currentTime) * 1000;
          pendingListenTimerRef.current = setTimeout(() => {
            setStatus('listening');
            pendingListenTimerRef.current = null;
          }, delayMs + 150); // +150ms buffer for audio tail
        } else {
          setStatus('listening');
        }
        break;
      }

      case 'response.function_call_arguments.done': {
        // Function calling: search_portfolio
        const callId = data.call_id as string;
        const name = data.name as string;
        if (name === 'search_portfolio') {
          setStatus('thinking');
          setIsSearching(true);
          startThinkingSound();
          const args = JSON.parse((data.arguments as string) || '{}');
          handleFunctionCall(callId, args.query, ws, lang, sessionId);
        }
        break;
      }

      case 'error': {
        const err = data.error as Record<string, unknown> | undefined;
        console.error('Realtime API error:', err);
        setDebugLog(prev => [...prev.slice(-9), `ERR: ${err?.code || err?.message || 'unknown'}`]);
        // Surface critical errors to user
        if (err?.code === 'session_expired' || err?.code === 'rate_limit_exceeded') {
          setError('connection');
          setStatus('error');
          cleanup();
        }
        break;
      }
    }
  }, []);

  // Handle function calling (RAG search)
  async function handleFunctionCall(callId: string, query: string, ws: WebSocket, _lang: string, _sessionId: string) {
    try {
      const res = await fetch('/api/rag-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, traceId: traceIdRef.current, currentPage: currentPageRef.current }),
      });

      const { context, sources } = await res.json();

      // Show source badges in voice UI
      if (sources?.length > 0) {
        setVoiceSources(sources);
      }

      // Send function output back
      ws.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: context || 'No relevant content found.',
        },
      }));

      // Ask the model to continue responding
      ws.send(JSON.stringify({ type: 'response.create' }));
    } catch {
      // Send error output
      ws.send(JSON.stringify({
        type: 'conversation.item.create',
        item: {
          type: 'function_call_output',
          call_id: callId,
          output: 'Search temporarily unavailable — answer from your general knowledge.',
        },
      }));
      ws.send(JSON.stringify({ type: 'response.create' }));
    }
  }

  // Play base64-encoded PCM Int16 audio
  function playAudioChunk(base64Audio: string, context: AudioContext) {
    const binary = atob(base64Audio);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const int16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / 32768;
    }

    const buffer = context.createBuffer(1, float32.length, 24000);
    buffer.copyToChannel(float32, 0);

    const source = context.createBufferSource();
    source.buffer = buffer;

    // Connect through analyser for visualization
    if (analyserNodeRef.current) {
      source.connect(analyserNodeRef.current);
    } else {
      source.connect(context.destination);
    }

    // Schedule playback without gaps
    const now = context.currentTime;
    const startTime = Math.max(now, nextPlayTimeRef.current);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + buffer.duration;
  }

  // Cleanup on unmount only — cleanup() uses refs internally so it always
  // accesses the latest state regardless of when it was captured.
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;
  useEffect(() => {
    return () => {
      cleanupRef.current();
    };
  }, []);

  return {
    state: {
      status,
      transcript,
      error,
      remainingSeconds,
      inputLevel: inputAnalyser.levelRef.current,
      outputLevel: outputAnalyser.levelRef.current,
    } as VoiceState,
    // Re-read levels directly from refs for animation frames
    getInputLevel: () => inputAnalyser.levelRef.current,
    getOutputLevel: () => outputAnalyser.levelRef.current,
    start,
    stop,
    isSupported,
    isSearching,
    liveTranscript,
    voiceSources,
    debugLog,
  };
}
