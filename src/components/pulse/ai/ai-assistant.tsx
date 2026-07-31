'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/app-store';
import { aiChatResponses } from '@/data/mock-data';
import type { AIChatMessage } from '@/stores/app-store';

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('помощь') || lower.includes('помоги') || lower.includes('что можешь'))
    return aiChatResponses.help;
  if (lower.includes('конкурент') || lower.includes('рынок'))
    return aiChatResponses.competitors;
  if (lower.includes('лояльност') || lower.includes('бонус') || lower.includes('программа'))
    return aiChatResponses.loyalty;
  if (lower.includes('спасибо') || lower.includes('благодар'))
    return aiChatResponses.thanks;
  if (lower.includes('продаж')) return aiChatResponses.sales_down;
  if (lower.includes('прибыл')) return aiChatResponses.profit_down;
  if (lower.includes('чек') || lower.includes('средний')) return aiChatResponses.average_check;
  if (lower.includes('вернуть') || lower.includes('клиент')) return aiChatResponses.clients_return;
  if (lower.includes('ацци') || lower.includes('выгод')) return aiChatResponses.best_promotion;
  if (lower.includes('аудитори') || lower.includes('кто')) return aiChatResponses.audience;
  return aiChatResponses.default;
}

/** Variable typing delay based on response length */
function getTypingDelay(response: string): number {
  const len = response.length;
  if (len < 100) return 800 + Math.random() * 400;  // 0.8-1.2s
  if (len < 300) return 1200 + Math.random() * 600; // 1.2-1.8s
  return 1800 + Math.random() * 700;                 // 1.8-2.5s
}

/** Simple markdown-to-JSX renderer for AI responses */
function renderMarkdown(text: string) {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line → paragraph break
    if (!trimmed) {
      elements.push(<div key={key++} className="h-2" />);
      continue;
    }

    // Bullet point (•)
    if (trimmed.startsWith('•') || trimmed.startsWith('- ')) {
      const content = trimmed.startsWith('•') ? trimmed.slice(1).trim() : trimmed.slice(2).trim();
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-1">
          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
          <span>{renderInlineMarkdown(content)}</span>
        </div>
      );
      continue;
    }

    // Numbered list (e.g. "1.")
    const numMatch = trimmed.match(/^(\d+)\.\s(.+)/);
    if (numMatch) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 ml-1">
          <span className="text-primary font-medium text-xs mt-0.5 shrink-0 w-4 text-right">{numMatch[1]}.</span>
          <span>{renderInlineMarkdown(numMatch[2])}</span>
        </div>
      );
      continue;
    }

    // Regular line
    elements.push(
      <p key={key++} className="leading-relaxed">
        {renderInlineMarkdown(trimmed)}
      </p>
    );
  }

  return elements;
}

/** Render **bold** inline */
function renderInlineMarkdown(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

/** Footer tip shown after AI responses */
const RESPONSE_FOOTER = '💡 Совет: Вы можете применить рекомендации прямо из панели управления';

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      className="flex items-end gap-3"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
      </div>
      <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3">
        <div className="flex items-center gap-1.5">
          <motion.span
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="h-2 w-2 rounded-full bg-muted-foreground"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ChatMessage({ message }: { message: AIChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={cn(
        'flex gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 mt-0.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-card border border-border rounded-bl-sm'
        )}
      >
        {isUser ? (
          <div className="whitespace-pre-wrap">{message.content}</div>
        ) : (
          <div>{renderMarkdown(message.content)}</div>
        )}
        {!isUser && (
          <div className="mt-2.5 pt-2 border-t border-border/50">
            <p className="text-[11px] text-muted-foreground/60 italic">{RESPONSE_FOOTER}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

const SUGGESTED_QUESTIONS = [
  'Почему упали продажи?',
  'Как увеличить средний чек?',
  'Кого стоит вернуть?',
  'Какая акция выгоднее?',
];

export function AIAssistant() {
  const { aiChatMessages, addAIChatMessage, clearAIChat } = useAppStore();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [aiChatMessages, isTyping]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    addAIChatMessage({ role: 'user', content: messageText });
    setInputValue('');
    setIsTyping(true);

    const response = getAIResponse(messageText);
    const delay = getTypingDelay(response);

    setTimeout(() => {
      setIsTyping(false);
      addAIChatMessage({ role: 'assistant', content: response });
    }, delay);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showWelcome = aiChatMessages.length === 0 && !isTyping;

  const welcomeMessage = useMemo(
    () =>
      'Привет! Я AI-ассистент PULSE 💜\n\nЯ анализирую данные вашего бизнеса «Coffee & Co» и помогаю принимать решения.\n\nЧто вас интересует прямо сейчас?',
    []
  );

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-base font-semibold">AI Ассистент</h2>
            <p className="text-xs text-muted-foreground">
              Получает данные вашего бизнеса
            </p>
          </div>
        </div>
        {aiChatMessages.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={clearAIChat}
          >
            Очистить
          </Button>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollRef} className="flex-1 px-4 sm:px-6 py-4">
        <div className="space-y-4">
          {/* Welcome Message */}
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-start gap-3"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="rounded-2xl rounded-bl-sm bg-card border border-border px-4 py-3 text-sm leading-relaxed max-w-[85%]">
                {renderMarkdown(welcomeMessage)}
              </div>
            </motion.div>
          )}

          {/* Chat Messages */}
          {aiChatMessages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && <TypingIndicator />}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Suggested Questions */}
      {showWelcome && (
        <div className="border-t border-border px-4 sm:px-6 py-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <motion.button
                key={q}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSend(q)}
                className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Input Area */}
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Спросите что-нибудь..."
            className="flex-1 bg-card border-border h-10 text-sm"
            disabled={isTyping}
          />
          <Button
            size="icon"
            className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
