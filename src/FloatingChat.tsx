import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Send,
  Loader2,
  Briefcase,
  Rocket,
  HelpCircle,
  Mail,
  ChevronDown,
  FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { translations } from './i18n';
import { getSectionLabels, getPageTitles } from './articles/registry';

interface RagSource {
  article_id: string;
  section_id: string;
  section_anchor: string;
  page_path_en: string;
  page_path_es: string;
  article_slug_en: string;
  article_slug_es: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  ragSources?: RagSource[];
  ragDegraded?: boolean;
}

interface FloatingChatProps {
  lang: 'es' | 'en';
}

const PromptIcon = ({ icon }: { icon: string }) => {
  const icons = {
    briefcase: Briefcase,
    rocket: Rocket,
    help: HelpCircle,
    mail: Mail,
  };
  const Icon = icons[icon as keyof typeof icons] || HelpCircle;
  return <Icon className="w-3.5 h-3.5" aria-hidden="true" />;
};

// Hook para detectar móvil
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}

/** Convert bare URLs in text to markdown links so ReactMarkdown renders them */
function linkifyUrls(text: string): string {
  // First: fix malformed markdown links — [text](url without closing )
  let fixed = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\)\s*)?/g,
    (_match, label, url) => {
      const cleanUrl = url.replace(/[.,;:!?]+$/, '');
      return `[${label}](${cleanUrl})`;
    },
  );

  // Then: linkify bare URLs not already inside markdown link syntax
  fixed = fixed.replace(
    /(https?:\/\/[^\s)]+|(?:[\w-]+\.)+(?:io|com|org|net|dev|app|co)(?:\/[^\s)]*)?)/g,
    (match, _url, offset) => {
      // Skip if inside a markdown link: check for [...]( before or [ before
      const before = fixed.slice(Math.max(0, offset - 200), offset);
      if (/\]\($/.test(before)) return match;
      if (/\[[^\]]*$/.test(before)) return match;
      return `[${match}](${match.startsWith('http') ? match : `https://${match}`})`;
    },
  );

  return fixed;
}

const STORAGE_KEY = 'santi-chat';

function loadSession(fallbackGreeting: string): { messages: Message[]; sessionId: string; showPrompts: boolean } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      if (Array.isArray(data.messages) && data.messages.length > 0 && typeof data.sessionId === 'string') {
        const hasUserMessages = data.messages.some((m: Message) => m.role === 'user');
        return { messages: data.messages, sessionId: data.sessionId, showPrompts: !hasUserMessages };
      }
    }
  } catch { /* ignore corrupt storage */ }
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return { messages: [{ role: 'assistant', content: fallbackGreeting }], sessionId, showPrompts: true };
}

function saveSession(messages: Message[], sessionId: string) {
  try {
    // Don't persist empty assistant messages (loading placeholders)
    const clean = messages.filter((m) => m.content !== '');
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: clean, sessionId }));
  } catch { /* storage full or unavailable */ }
}

export default function FloatingChat({ lang }: FloatingChatProps) {
  const t = translations[lang].chat;
  const [isOpen, setIsOpen] = useState(false);

  const [session] = useState(() => loadSession(t.greeting));
  const [messages, setMessages] = useState<Message[]>(session.messages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [showPrompts, setShowPrompts] = useState(session.showPrompts);
  const [sessionId] = useState(session.sessionId);
    const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Word-by-word streaming refs
  const fullTextRef = useRef('');        // full accumulated text from SSE
  const drainPosRef = useRef(0);         // how far we've rendered into fullTextRef
  const isStreamingRef = useRef(false);
  const drainTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingRagSourcesRef = useRef<RagSource[]>([]);
  const pendingRagDegradedRef = useRef(false);

  const isMobile = useIsMobile();

  // Emit chatToggle event for ambient music ducking
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('chatToggle', { detail: { open: isOpen } }));
  }, [isOpen]);

  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  // Cleanup drain timer on unmount
  useEffect(() => {
    return () => {
      if (drainTimerRef.current) clearInterval(drainTimerRef.current);
    };
  }, []);

  // Scroll automático: instantáneo durante streaming, suave después
  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: isLoading || isStreaming ? 'instant' : 'smooth',
      block: 'end'
    });
  }, [messages, isLoading, isStreaming, isOpen]);

  // Focus en input al abrir
  useEffect(() => {
    if (isOpen && !isMobile) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMobile]);

  // Escuchar evento global para abrir chat desde otros componentes
  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  // Bloquear scroll del body cuando el chat está abierto en móvil
  useEffect(() => {
    if (isMobile && isOpen) {
      const scrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;

      // Prevenir cualquier scroll del body
      const preventScroll = (e: TouchEvent) => {
        if (!(e.target as HTMLElement).closest('.custom-scrollbar')) {
          e.preventDefault();
        }
      };
      document.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        document.removeEventListener('touchmove', preventScroll);
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.width = '';
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobile, isOpen]);

  // Persist messages to sessionStorage
  useEffect(() => {
    if (!isLoading) {
      saveSession(messages, sessionId);
    }
  }, [messages, isLoading, sessionId]);

  // Update greeting when lang changes — only if no conversation has started
  useEffect(() => {
    const hasUserMessages = messages.some((m) => m.role === 'user');
    if (!hasUserMessages) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      setShowPrompts(true);
    }
  }, [lang]);

  const navigate = useNavigate();
  const location = useLocation();

  /** Drain fullTextRef word-by-word into the UI via drainPosRef cursor */
  const startDrain = () => {
    if (drainTimerRef.current) return; // already draining
    drainTimerRef.current = setInterval(() => {
      const full = fullTextRef.current;
      const pos = drainPosRef.current;

      if (pos < full.length) {
        // Find next word boundary (end of next whitespace-delimited token)
        const remaining = full.slice(pos);
        const match = remaining.match(/^\s*\S+\s*/);
        const advance = match ? match[0].length : remaining.length;
        drainPosRef.current = pos + advance;

        const currentText = full.slice(0, drainPosRef.current);
        const sources = pendingRagSourcesRef.current;
        const degraded = pendingRagDegradedRef.current;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: currentText,
            ragSources: sources.length > 0 ? sources : undefined,
            ragDegraded: degraded || undefined,
          };
          return newMessages;
        });
      } else if (!isStreamingRef.current) {
        // Fully drained and stream done — stop
        if (drainTimerRef.current) {
          clearInterval(drainTimerRef.current);
          drainTimerRef.current = null;
        }
        setIsStreaming(false);
      }
      // pos === full.length but stream active — wait for more text
    }, 30);
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setShowPrompts(false);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    // Reset streaming state
    fullTextRef.current = '';
    drainPosRef.current = 0;
    isStreamingRef.current = false;
    pendingRagSourcesRef.current = [];
    pendingRagDegradedRef.current = false;
    if (drainTimerRef.current) {
      clearInterval(drainTimerRef.current);
      drainTimerRef.current = null;
    }

    // Add empty assistant message BEFORE fetch so loading indicator shows
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      if (!navigator.onLine) {
        throw new Error('offline');
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }].filter(
            (m) => m.role !== 'assistant' || m.content !== t.greeting,
          ),
          lang,
          sessionId,
          currentPage: location.pathname,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let buffer = '';
      let fullText = '';
      let currentEventType = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines only
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          // Parse SSE event type
          if (line.startsWith('event: ')) {
            currentEventType = line.slice(7);
            continue;
          }

          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));

              if (currentEventType === 'rag-sources') {
                pendingRagSourcesRef.current = data as RagSource[];
                currentEventType = '';
                continue;
              }

              if (currentEventType === 'rag-status') {
                pendingRagDegradedRef.current = data.status === 'degraded';
                currentEventType = '';
                continue;
              }

              currentEventType = '';

              if (data.text) {
                if (data.replace) {
                  // Leak blocked — bypass buffer, render immediately
                  fullText = data.text;
                  fullTextRef.current = data.text;
                  drainPosRef.current = data.text.length;
                  const sources = pendingRagSourcesRef.current;
                  const degraded = pendingRagDegradedRef.current;
                  setMessages((prev) => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                      role: 'assistant',
                      content: data.text,
                      ragSources: sources.length > 0 ? sources : undefined,
                      ragDegraded: degraded || undefined,
                    };
                    return newMessages;
                  });
                } else {
                  // First chunk — activate streaming
                  if (!isStreamingRef.current) {
                    isStreamingRef.current = true;
                    setIsStreaming(true);
                  }

                  fullText += data.text;
                  fullTextRef.current = fullText;
                  startDrain();
                }
              }
            } catch {
              // Skip malformed JSON
              currentEventType = '';
            }
          }
        }
      }

      // Stream ended — signal drain to flush remaining words
      isStreamingRef.current = false;

      // Fallback: if stream ended but no text was received, show error
      if (!fullText) {
        const errorMsg = t.error;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.content === '') {
            return [
              ...prev.slice(0, -1),
              { role: 'assistant', content: errorMsg },
            ];
          }
          return prev;
        });
      }
    } catch (err) {
      const isOffline = !navigator.onLine || (err instanceof Error && err.message === 'offline');
      const errorMsg = isOffline ? t.offline : t.error;
      // Clear streaming state on error
      fullTextRef.current = '';
      drainPosRef.current = 0;
      if (drainTimerRef.current) {
        clearInterval(drainTimerRef.current);
        drainTimerRef.current = null;
      }
      setIsStreaming(false);
      isStreamingRef.current = false;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '') {
          return [
            ...prev.slice(0, -1),
            { role: 'assistant', content: errorMsg },
          ];
        }
        return [...prev, { role: 'assistant', content: errorMsg }];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handlePromptClick = (query: string) => {
    sendMessage(query);
  };

  return (
    <>
      {/* Chat Button - avatar con animación sutil */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        style={{
          bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px) + 0.5rem)',
          right: 'max(1.5rem, env(safe-area-inset-right, 0px) + 0.5rem)',
        }}
        aria-label={lang === 'en' ? (isOpen ? 'Close chat with Santi' : 'Open chat with Santi') : (isOpen ? 'Cerrar chat con Santi' : 'Abrir chat con Santi')}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full rounded-full bg-gradient-theme flex items-center justify-center"
            >
              <X className="w-6 h-6 text-white" aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              {/* Avatar */}
              <picture>
                <source srcSet="/foto-avatar-sm.webp" type="image/webp" />
                <img
                  src="/foto-avatar-sm.webp"
                  alt={lang === 'en' ? 'Chat with Santi' : 'Chat con Santi'}
                  className="w-full h-full rounded-full object-cover"
                  width={56}
                  height={56}
                />
              </picture>
              {/* Pulse ring animation */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.7, 0, 0.7],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel - Fullscreen en móvil, flotante en desktop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'en' ? 'Chat with Santi' : 'Chat con Santi'}
            initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={isMobile ? { duration: 0.2, ease: 'easeOut' } : { type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed z-50 flex flex-col bg-card border-border shadow-2xl ${
              isMobile
                ? 'inset-0 h-dvh rounded-none border-0 overscroll-contain'
                : 'bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-8rem)] rounded-2xl border overflow-hidden'
            }`}
          >
            {/* Header - con avatar y botón de cerrar en móvil */}
            <div
              className="p-4 border-b border-border bg-gradient-theme-10 flex items-center justify-between"
              style={
                isMobile
                  ? { paddingTop: 'max(1rem, env(safe-area-inset-top, 0px))' }
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                <picture>
                  <source srcSet="/foto-avatar-sm.webp" type="image/webp" />
                  <img
                    src="/foto-avatar-sm.webp"
                    alt="santifer avatar"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                    width={40}
                    height={40}
                    loading="lazy"
                    decoding="async"
                  />
                </picture>
                <div>
                  <h3 className="font-display font-semibold text-foreground">
                    {t.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  aria-label="Close chat"
                >
                  <ChevronDown className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Messages - scroll optimizado para móvil */}
            <div
              aria-live="polite"
              className={`flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar overscroll-contain ${
                isMobile ? 'pb-2' : ''
              }`}
            >
              {messages.map((message, i) =>
                // Skip empty assistant messages (they show the loading indicator instead)
                message.role === 'assistant' &&
                message.content === '' ? null : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[85%]">
                      {/* Degradation banner */}
                      {message.role === 'assistant' && message.ragDegraded && (
                        <div className={`mb-1 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 ${isMobile ? 'text-xs' : 'text-[11px]'}`}>
                          {lang === 'en'
                            ? 'Answering without full access to my articles.'
                            : 'Respondiendo sin acceso completo a mis artículos.'}
                        </div>
                      )}
                      <div
                        className={`px-4 py-2.5 rounded-2xl leading-relaxed ${
                          message.role === 'user'
                            ? 'bg-gradient-theme text-white rounded-br-md'
                            : 'bg-muted text-foreground rounded-bl-md'
                        } ${isMobile ? 'text-base' : 'text-sm'} ${
                          isStreaming && i === messages.length - 1 && message.role === 'assistant'
                            ? 'streaming-cursor'
                            : ''
                        }`}
                      >
                        {message.role === 'assistant' ? (
                          isStreaming && i === messages.length - 1 ? (
                            <span className="whitespace-pre-wrap">{message.content}</span>
                          ) : (
                            <ReactMarkdown
                              components={{
                                strong: ({ children }) => (
                                  <strong className="font-semibold text-primary">
                                    {children}
                                  </strong>
                                ),
                                p: ({ children }) => (
                                  <p className="mb-3 last:mb-0">{children}</p>
                                ),
                                a: ({ href, children }) => (
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-primary underline hover:text-primary/80 transition-colors"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                              urlTransform={(url) => {
                                // Auto-linkify emails
                                if (url.includes('@') && !url.startsWith('mailto:')) {
                                  return `mailto:${url}`;
                                }
                                // Add https:// if missing
                                if (!url.startsWith('http') && !url.startsWith('mailto:')) {
                                  return `https://${url}`;
                                }
                                return url;
                              }}
                            >
                              {linkifyUrls(message.content)}
                            </ReactMarkdown>
                          )
                        ) : (
                          message.content
                        )}
                      </div>
                      {/* RAG source badges — same style as quick prompts */}
                      {message.role === 'assistant' && message.ragSources && message.ragSources.length > 0 && !isLoading && (
                        <div className="flex flex-wrap gap-1.5 mt-2 px-1">
                          {message.ragSources.filter(s => s.section_anchor).map((source, si) => {
                            const targetPath = lang === 'es' ? source.page_path_es : source.page_path_en;
                            const sectionLabels = getSectionLabels()[targetPath] || {};
                            const anchorId = source.section_anchor.replace(/^#/, '');
                            const sectionName = sectionLabels[anchorId] || '';
                            const articleName = getPageTitles()[targetPath] || source.article_id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                            const isCurrentPage = location.pathname === targetPath;

                            return (
                              <button
                                key={`${source.article_id}-${source.section_id}-${si}`}
                                onClick={() => {
                                  if (isCurrentPage && source.section_anchor) {
                                    const el = document.querySelector(source.section_anchor);
                                    if (el instanceof HTMLElement) {
                                      el.scrollIntoView({ behavior: 'instant' });
                                      el.classList.remove('hash-highlight');
                                      void el.offsetWidth;
                                      el.classList.add('hash-highlight');
                                      el.addEventListener('animationend', () => el.classList.remove('hash-highlight'), { once: true });
                                    }
                                  } else if (targetPath) {
                                    if (isMobile) setIsOpen(false);
                                    navigate(targetPath + (source.section_anchor || ''));
                                  }
                                }}
                                className={`flex items-start gap-1.5 rounded-full font-medium text-left bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 transition-colors duration-200 ${
                                  isMobile
                                    ? 'px-3 py-1.5 text-xs'
                                    : 'px-2.5 py-1 text-[10px]'
                                }`}
                              >
                                <FileText className="w-3 h-3 shrink-0" />
                                {articleName}{sectionName ? ` · ${sectionName}` : ''}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ),
              )}

              {/* Quick Prompts - animación estilo Story, colores originales */}
              {showPrompts && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex flex-wrap gap-2 pt-2 ${isMobile ? 'gap-2.5' : ''}`}
                >
                  {t.prompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handlePromptClick(prompt.query)}
                      className={`flex items-center gap-1.5 rounded-full font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 transition-colors duration-200 ${
                        isMobile
                          ? 'px-4 py-2.5 text-sm min-h-[44px]'
                          : 'px-3 py-1.5 text-xs'
                      }`}
                    >
                      <PromptIcon icon={prompt.icon} />
                      {prompt.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Contact CTA after 2+ exchanges */}
              {userMessageCount >= 2 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-3"
                >
                  <div className="p-3 rounded-xl bg-gradient-theme-10 border border-primary/20 text-center">
                    <p className="text-sm font-medium text-foreground mb-2">
                      {t.contactCtaTitle}
                    </p>
                    <a
                      href={`mailto:${translations[lang].email}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-theme-r text-white text-sm font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:brightness-95 transition-all duration-200"
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      {translations[lang].email}
                    </a>
                  </div>
                </motion.div>
              )}

              {isLoading && messages[messages.length - 1]?.content === '' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className={`bg-muted px-4 py-2.5 rounded-2xl rounded-bl-md flex items-center gap-2 ${
                      isMobile ? 'py-3' : ''
                    }`}
                  >
                    <Loader2
                      className={`text-muted-foreground animate-spin ${isMobile ? 'w-5 h-5' : 'w-4 h-4'}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-xs'}`}
                    >
                      {translations[lang].ui.typingIndicator}
                    </span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input - más grande en móvil, respeta safe area inferior */}
            <div
              className="p-4 border-t border-border bg-card"
              style={
                isMobile
                  ? {
                      paddingBottom:
                        'max(1rem, env(safe-area-inset-bottom, 0px))',
                    }
                  : undefined
              }
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t.placeholder}
                  aria-label={t.placeholder}
                  disabled={isLoading}
                  enterKeyHint="send"
                  autoComplete="off"
                  autoCorrect="off"
                  className={`flex-1 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 ${
                    isMobile ? 'py-3 text-base' : 'py-2.5 text-sm'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  aria-label={lang === 'en' ? 'Send message' : 'Enviar mensaje'}
                  className={`rounded-xl bg-gradient-theme flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${
                    isMobile ? 'w-12 h-12' : 'w-10 h-10'
                  }`}
                >
                  <Send className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
