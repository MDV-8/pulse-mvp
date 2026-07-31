'use client';

import { useState, useRef, useEffect } from 'react';
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
  if (lower.includes('продаж')) return aiChatResponses.sales_down;
  if (lower.includes('прибыл')) return aiChatResponses.profit_down;
  if (lower.includes('чек') || lower.includes('средний')) return aiChatResponses.average_check;
  if (lower.includes('вернуть') || lower.includes('клиент')) return aiChatResponses.clients_return;
  if (lower.includes('ацци') || lower.includes('выгод')) return aiChatResponses.best_promotion;
  if (lower.includes('аудитори') || lower.includes('кто')) return aiChatResponses.audience;
  return aiChatResponses.default;
}

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
        <div className="whitespace-pre-wrap">{message.content}</div>
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

    setTimeout(() => {
      setIsTyping(false);
      addAIChatMessage({ role: 'assistant', content: response });
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const showWelcome = aiChatMessages.length === 0 && !isTyping;

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
                Привет! Я AI-ассистент PULSE. Я анализирую данные вашего бизнеса и помогаю принимать решения. Что вас интересует?
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
