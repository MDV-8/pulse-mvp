'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Send, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/app-store';
import { aiChatResponses } from '@/data/mock-data';
import type { AIChatMessage } from '@/stores/app-store';

type AIMode = 'keywords' | 'neural';

const DEFAULT_GREETINGS = [
  'Хороший вопрос! Давайте посмотрим на данные "Coffee & Co". Попробуйте спросить про продажи, акции, клиентов или конкурентов — у меня есть точные данные по вашему бизнесу.',
  'Интересно! Я постоянно анализирую данные вашего "Coffee & Co". Спросите меня про средний чек, возврат клиентов или лучшую акцию — помогу с конкретикой.',
  'Я здесь, чтобы помочь вашему бизнесу "Coffee & Co" 💜 Задайте вопрос про продажи, прибыль, лояльность или маркетинг — и я дам рекомендации на основе реальных данных.',
  'Отличный день для анализа бизнеса! Попросите меня проанализировать аудиторию, проверить запасы или подобрать стратегию ценообразования для "Coffee & Co".',
];

function getRandomGreeting(): string {
  return DEFAULT_GREETINGS[Math.floor(Math.random() * DEFAULT_GREETINGS.length)];
}

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('помощь') || lower.includes('помоги') || lower.includes('что можешь'))
    return aiChatResponses.help;
  if (lower.includes('конкурент') || lower.includes('рынок') || lower.includes('сосед'))
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

  // Weather-based: suggest promotions based on weather
  if (lower.includes('погода') || lower.includes('дождь') || lower.includes('холодно') || lower.includes('жара') || lower.includes('снег') || lower.includes('ветер'))
    return `Погода напрямую влияет на трафик "Coffee & Co"!

**Анализ по типам погоды:**
— Дождь/снег: трафик −22%, но средний чек +8% (клиенты задерживаются)
— Жара (+35°C): спрос на айс-напитки +45%, горячий кофе −30%
— Холодно: какао и горячий шоколад +38%

**Рекомендации:**
1. При плохой погоде — запустите промо "Дождь не помеха": скидка 10% на доставку
2. В жару — выделите айс-напитки на видное место, добавьте "охлаждённый комбо" за 3 500₸
3. Автоматические пуш-уведомления при смене погоды

Ожидаемый эффект: +12–18% выручки в "непогожие" дни.`;

  // Staff/scheduling
  if (lower.includes('сотрудник') || lower.includes('график') || lower.includes('смен') || lower.includes('персонал') || lower.includes('бариста'))
    return `Анализ загрузки персонала "Coffee & Co":

**Текущая ситуация:**
— Утренняя смена (7:00–14:00): 2 бариста, загрузка 92%
— Дневная смена (14:00–20:00): 2 бариста, загрузка 58%
— Вечерняя (20:00–23:00): 1 бариста, загрузка 34%

**Проблемы:**
• Утром — очереди, время обслуживания +4 мин
• Днём — переизбыток персонала (зарплаты −15 000₸/мес впустую)

**Оптимизация графика:**
1. Утро: +1 бариста (7:00–11:00), стоимость 4 500₸/смена
2. День: −1 бариста после 16:00
3. Вечер: совмещать с закрытием

**Экономия:** до 45 000₸/мес при сохранении качества обслуживания.`;

  // Inventory
  if (lower.includes('запас') || lower.includes('остаток') || lower.includes('ингредиент') || lower.includes('сырь') || lower.includes('кофе зерно') || lower.includes('молок'))
    return `Состояние запасов "Coffee & Co" на сегодня:

**Критичные (осталось < 3 дней):**
• Арабика Эфиопия — 2.1 кг (расход 1.2 кг/день)
• Молоко 3.2% — 8 л (расход 3.5 л/день)
• Сироп карамельный — 0.4 л

**Норма (3–7 дней):**
• Робуста — 4.8 кг
• Чизкейк — 6 штук
• Круассаны — 12 штук

**Профицит (> 7 дней):**
• Стаканы бумажные — запас на 21 день
• Крышки — запас на 18 дней (переизбыток 12 000₸ в замороженном капитале)

**Рекомендации:**
1. Срочно заказать арабику и молоко — прогноз поставки 2 дня
2. Снизить заказ стаканов на 30%
3. Включить автоуведомление при остатке < 3 дней

Прогноз потерь при бездействии: ~38 000₸/неделю из-за упущенных продаж.`;

  // Marketing
  if (lower.includes('реклама') || lower.includes('трафик') || lower.includes('продвижен') || lower.includes('маркетинг') || lower.includes('бюджет'))
    return `Анализ маркетинга "Coffee & Co" за последний месяц:

**Каналы привлечения:**
1. Instagram — 48% новых клиентов, стоимость привлечения 320₸
2. Сарафанное радио — 28%, стоимость 0₸
3. 2GIS/Google Maps — 15%, стоимость 180₸
4. Промокоды в мессенджерах — 9%, стоимость 450₸

**Что работает лучше всего:**
• Stories с процессом приготовления кофе — охват +35%
• Реферальная программа "Приведи друга" — ROI 4.1₸ на 1₸

**Что не работает:**
• Таргетированная реклама — стоимость клика выросла на 40%

**Рекомендации:**
1. Увеличить бюджет на реферальную программу на 20 000₸
2. Публиковать 5–7 Stories/неделю (сейчас 2–3)
3. Запустить акцию "Отметь нас" — бонус 200₸ за пост

Прогноз: +25% новых клиентов при бюджете 50 000₸/мес.`;

  // Morning/evening time-based
  if (lower.includes('утро') || lower.includes('утренн') || lower.includes('вечер') || lower.includes('вечерн') || lower.includes('сегодня') || lower.includes('сейчас'))
    return `Бизнес-прогноз для "Coffee & Co" на текущий день:

**Утро (7:00–10:00):**
• Ожидается 85–110 клиентов (пик в 8:30)
• Популярные: капучино (48%), латте (28%), американо (15%)
• Рекомендация: подготовить 120 порций молока, все бариста на смене

**День (10:00–17:00):**
• Ожидается 45–60 клиентов
• Спрос на десерты: +22% к утру
• Рекомендация: выложить свежую выпечку к 11:00 для Instagram Stories

**Вечер (17:00–23:00):**
• Ожидается 25–35 клиентов (потенциально +40% с акцией)
• Если запущен Happy Hour: прогноз 40–50 клиентов
• Рекомендация: активировать пуш-уведомление о Happy Hour в 17:30

**Прогноз выручки на день:** 42 000–48 000₸`;

  // Price/pricing
  if (lower.includes('цена') || lower.includes('стоимость') || lower.includes('поднять') || lower.includes('снизить') || lower.includes('скидк') || lower.includes('наценк'))
    return `Анализ ценообразования "Coffee & Co":

**Текущие цены vs конкуренты:**
— Капучино: 1 800₸ (средний по району 1 650₸, +9%)
— Латте: 2 000₸ (средний 1 800₸, +11%)
— Раф: 2 200₸ (средний 2 100₸, +5%)
— Десерты: 1 200–1 800₸ (ниже рынка на 8%)

**Ценовая эластичность:**
• Напитки: повышение на 100₸ → −3% продаж (приемлемо)
• Десерты: повышение на 200₸ → −12% продаж (рискованно)

**Рекомендации:**
1. Повысить цены на напитки на 100₸ (ожидаемый эффект: +18 000₸/мес при потере 3% клиентов)
2. НЕ повышать цены на десерты — они привлекают трафик
3. Ввести "двойной размер" за +500₸ — маржа +65%
4. Комбо "Кофе + десерт" за 2 800₸ вместо 3 000₸ — повышение чека на 15%

Итого потенциальный рост прибыли: +12% (≈46 000₸/мес).`;

  // Reviews/ratings
  if (lower.includes('отзыв') || lower.includes('рейтинг') || lower.includes('оценк') || lower.includes('звезд') || lower.includes('google') || lower.includes('2gis'))
    return `Управление отзывами "Coffee & Co":

**Текущий рейтинг:**
• Google Maps: 4.8 ⭐ (312 отзывов)
• 2GIS: 4.7 ⭐ (189 отзывов)
• Instagram: 4.6 ⭐ (на основе упоминаний)

**Новые отзывы (последние 7 дней):**
• 5⭐ — 8 отзывов
• 4⭐ — 3 отзыва
• 3⭐ — 1 отзыв (жалоба на время ожидания)
• Без ответа — 5 отзывов

**Тренды из отзывов:**
• Позитивные: вкус кофе (67%), атмосфера (23%), персонал (10%)
• Негативные: время ожидания (2 упоминания), отсутствие парковки (1)

**Рекомендации:**
1. Ответить на все 5 неответственных отзыва за 24 часа
2. При негативном отзыве — предложить бонус 300₸ на следующий визит
3. Попросить довольных клиентов оставить отзыв (карточка с QR-кодом на чеке)

Цель: 4.9⭐ на Google к концу месяца.`;

  // Social media
  if (lower.includes('инста') || lower.includes('соцсет') || lower.includes('пост') || lower.includes('stories') || lower.includes('контент') || lower.includes('подписч'))
    return `Соцсети "Coffee & Co" — анализ и план:

**Текущие показатели:**
• Instagram: 2 340 подписчиков (+87 за месяц)
• Средний охват поста: 340 человек (14.5%)
• Средний охват Stories: 520 человек (22%)
• Вовлечённость: 4.2% (хороший показатель)

**Самый успешный контент:**
1. Видео приготовления латте-арт — 1 200 просмотров
2. Утренняя атмосфера кофейни — 890 просмотров
3. "За кулисами" с бариста — 760 просмотров

**План контента на неделю:**
• Понедельник: Reels "Рецепт недели" (айс-матча)
• Среда: Stories "Выбор клиентов" (голосование)
• Пятница: Пост "Итоги недели" с цифрами
• Воскресенье: Утренний Reels "Открываем Coffee & Co"

**Рекомендации:**
1. Увеличить Reels до 3/неделю (алгоритм даёт +40% охвата)
2. Добавить user-generated контент (фото клиентов за 200₸ бонус)
3. Использовать геотеги и хештеги #алматыкофе #coffeealmaty`;

  // Delivery
  if (lower.includes('доставка') || lower.includes('курьер') || lower.includes('wolt') || lower.includes('glovo') || lower.includes('самовывоз'))
    return `Доставка "Coffee & Co" — текущая ситуация:

**Каналы доставки:**
• Wolt: 28 заказов/день, средний чек 3 200₸, комиссия 25%
• Glovo: 18 заказов/день, средний чек 2 800₸, комиссия 28%
• Самовывоз: 12 заказов/день, средний чек 4 100₸ (без комиссии)

**Анализ прибыльности:**
— Wolt: чистая прибыль 320₸/заказ (маржа 10%)
— Glovo: чистая прибыль 140₸/заказ (маржа 5%)
— Самовывоз: чистая прибыль 1 640₸/заказ (маржа 40%)

**Проблемы:**
• Wolt/Glovo забирают 53 000₸/неделю комиссиями
• Время доставки: 25 мин (клиенты ожидают 18 мин)

**Рекомендации:**
1. Добавить "премиум-доставку" за 4 500₸ (минимальный заказ + десерт) — маржа +18%
2. Продвигать самовывоз: скидка 10% при самовывозе (всё равно выгоднее, чем 25% комиссии)
3. Упаковать "кофейный сет" для офисов (от 10 000₸, доставка бесплатная)

Потенциальная экономия: 28 000₸/неделю.`;

  // Random greeting if no keyword matches
  return getRandomGreeting();
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

function NeuralTypingIndicator() {
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
      <div className="rounded-2xl rounded-bl-sm bg-card border border-primary/30 px-4 py-3">
        <div className="flex items-center gap-2">
          <motion.span
            className="text-primary text-sm font-medium"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            AI думает
          </motion.span>
          <div className="flex gap-0.5">
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.15 }}
            />
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: 0.3 }}
            />
          </div>
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
  const [aiMode, setAiMode] = useState<AIMode>('neural');
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

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText || isTyping) return;

    addAIChatMessage({ role: 'user', content: messageText });
    setInputValue('');
    setIsTyping(true);

    if (aiMode === 'neural') {
      try {
        const history = aiChatMessages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const res = await fetch('/api/ai-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        const data = await res.json();

        if (data.success && data.response) {
          setIsTyping(false);
          addAIChatMessage({ role: 'assistant', content: data.response });
          return;
        }
        // If API returns unsuccessful, fall through to keyword matching
        console.warn('AI API returned unsuccessful, falling back to keywords');
      } catch (err) {
        // Network error or other issue — fall back to keyword matching
        console.warn('AI API failed, falling back to keywords:', err);
      }
    }

    // Keyword matching (default mode or fallback)
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
      'Привет! Я AI-ассистент PULSE 💜\n\nЯ анализирую данные вашего бизнеса "Coffee & Co" и помогаю принимать решения.\n\nЧто вас интересует прямо сейчас?',
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
        <div className="flex items-center gap-2">
          {/* AI Mode Toggle */}
          <div className="flex items-center gap-1.5 rounded-lg bg-card border border-border p-0.5">
            <button
              onClick={() => setAiMode('keywords')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all',
                aiMode === 'keywords'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Ключевые слова
            </button>
            <button
              onClick={() => setAiMode('neural')}
              className={cn(
                'px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1.5',
                aiMode === 'neural'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Zap className="h-3 w-3" />
              Нейросеть
              <span className={cn(
                'text-[9px] font-bold px-1 py-0.5 rounded leading-none',
                aiMode === 'neural'
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-primary/15 text-primary'
              )}>
                BETA
              </span>
            </button>
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
            {isTyping && (aiMode === 'neural' ? <NeuralTypingIndicator /> : <TypingIndicator />)}
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

      {/* Disclaimer for Neural mode */}
      {aiMode === 'neural' && (
        <div className="px-4 sm:px-6">
          <p className="text-[10px] text-muted-foreground/50 text-center">
            AI ответы могут быть неточными. Демо режим.
          </p>
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