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
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FloatingChatProps {
  lang: 'es' | 'en';
}

const texts = {
  es: {
    placeholder: 'Escribe tu pregunta...',
    title: 'Santi',
    subtitle: 'Pregúntame sobre mi experiencia',
    greeting:
      '¡Hola! Soy Santi, el avatar de Santiago. Estoy aquí para contarte sobre mi experiencia, proyectos y habilidades. ¿Qué te gustaría saber?',
    error: 'Error al enviar. Inténtalo de nuevo.',
    prompts: [
      {
        icon: 'briefcase',
        label: 'Experiencia con IA',
        query: '¿Cuál es la experiencia de Santiago con IA y automatización?',
      },
      {
        icon: 'rocket',
        label: 'Proyectos destacados',
        query: '¿Cuáles son los proyectos más destacados de Santiago?',
      },
      {
        icon: 'help',
        label: '¿Por qué contratarle?',
        query: '¿Por qué debería contratar a Santiago?',
      },
      {
        icon: 'mail',
        label: 'Contactar',
        query: '¿Cómo puedo contactar a Santiago?',
      },
    ],
    contactCtaTitle: '¿Te gustaría hablar directamente?',
  },
  en: {
    placeholder: 'Type your question...',
    title: 'Santi',
    subtitle: 'Ask me about my experience',
    greeting:
      "Hi! I'm Santi, Santiago's avatar. I'm here to tell you about my experience, projects, and skills. What would you like to know?",
    error: 'Error sending. Please try again.',
    prompts: [
      {
        icon: 'briefcase',
        label: 'AI Experience',
        query: "What is Santiago's experience with AI and automation?",
      },
      {
        icon: 'rocket',
        label: 'Top Projects',
        query: "What are Santiago's most notable projects?",
      },
      {
        icon: 'help',
        label: 'Why hire him?',
        query: 'Why should I hire Santiago?',
      },
      { icon: 'mail', label: 'Contact', query: 'How can I contact Santiago?' },
    ],
    contactCtaTitle: 'Want to talk directly?',
  },
};

const PromptIcon = ({ icon }: { icon: string }) => {
  const icons = {
    briefcase: Briefcase,
    rocket: Rocket,
    help: HelpCircle,
    mail: Mail,
  };
  const Icon = icons[icon as keyof typeof icons] || HelpCircle;
  return <Icon className="w-3.5 h-3.5" />;
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

// Generate unique session ID
function generateSessionId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function FloatingChat({ lang }: FloatingChatProps) {
  const t = texts[lang];
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t.greeting },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [sessionId] = useState(() => generateSessionId());
    const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();

  const userMessageCount = messages.filter((m) => m.role === 'user').length;

  // Scroll a mensajes nuevos
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  
  // Solo actualizar greeting si el usuario aún no ha escrito nada
  useEffect(() => {
    const hasUserMessages = messages.some((m) => m.role === 'user');
    if (!hasUserMessages) {
      setMessages([{ role: 'assistant', content: t.greeting }]);
      setShowPrompts(true);
    }
  }, [lang]);

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setShowPrompts(false);
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    // Add empty assistant message BEFORE fetch so loading indicator shows
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: text }].filter(
            (m) => m.role !== 'assistant' || m.content !== t.greeting,
          ),
          lang,
          sessionId,
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete lines only
        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim();
          buffer = buffer.slice(newlineIndex + 1);

          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                fullText += data.text;
                // Update with accumulated text to avoid race conditions
                const currentText = fullText;
                setMessages((prev) => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = {
                    role: 'assistant',
                    content: currentText,
                  };
                  return newMessages;
                });
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '') {
          return [
            ...prev.slice(0, -1),
            { role: 'assistant', content: t.error },
          ];
        }
        return [...prev, { role: 'assistant', content: t.error }];
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
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        style={{
          bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px) + 0.5rem)',
          right: 'max(1.5rem, env(safe-area-inset-right, 0px) + 0.5rem)',
        }}
        aria-label="Toggle chat"
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
              <X className="w-6 h-6 text-white" />
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
              <img
                src="/chatbot-avatar.png"
                alt="Chat con Santi"
                className="w-full h-full rounded-full object-cover"
              />
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
                <img
                  src="/chatbot-avatar.png"
                  alt="Santi avatar"
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                />
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
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Messages - scroll optimizado para móvil */}
            <div
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
                    <div
                      className={`max-w-[85%] px-4 py-2.5 rounded-2xl leading-relaxed ${
                        message.role === 'user'
                          ? 'bg-gradient-theme text-white rounded-br-md'
                          : 'bg-muted text-foreground rounded-bl-md'
                      } ${isMobile ? 'text-base' : 'text-sm'}`}
                    >
                      {message.role === 'assistant' ? (
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
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
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
                      className={`flex items-center gap-1.5 rounded-full font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 transition-all duration-300 ${
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
                      href={`mailto:${lang === 'es' ? 'hola@santifer.io' : 'hi@santifer.io'}`}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-theme-r text-white text-sm font-medium hover:opacity-90 transition-opacity"
                    >
                      <Mail className="w-4 h-4" />
                      {lang === 'es' ? 'hola@santifer.io' : 'hi@santifer.io'}
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
                    />
                    <span
                      className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-xs'}`}
                    >
                      {lang === 'en' ? 'Santi is typing...' : 'Santi está escribiendo...'}
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
                  disabled={isLoading}
                  enterKeyHint="send"
                  autoComplete="off"
                  autoCorrect="off"
                  className={`flex-1 px-4 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 ${
                    isMobile ? 'py-3 text-base' : 'py-2.5 text-sm'
                  }`}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className={`rounded-xl bg-gradient-theme flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity ${
                    isMobile ? 'w-12 h-12' : 'w-10 h-10'
                  }`}
                >
                  <Send className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
