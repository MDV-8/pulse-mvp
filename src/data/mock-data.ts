// ============================================================
// PULSE — Complete Mock Data for MVP
// Currency: ₸ (Kazakh Tenge)
// Language: Russian
// ============================================================

export interface BusinessData {
  name: string;
  category: string;
  city: string;
  size: string;
  goals: string[];
  createdAt: string;
}

export interface PulseScore {
  total: number;
  breakdown: {
    sales: number;
    clients: number;
    loyalty: number;
    marketing: number;
    profit: number;
  };
}

export interface MetricCard {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'info' | 'success';
  title: string;
  description: string;
  recommendation: string;
  action: string;
  actionLabel: string;
  expectedEffect?: string;
  priority: number;
}

export interface TodayAction {
  id: string;
  title: string;
  reason: string;
  expectedEffect: string;
  actionLabel: string;
  actionType: 'promotion' | 'clients' | 'content' | 'reviews' | 'other';
  priority: number;
}

export interface Promotion {
  id: string;
  name: string;
  discount: number;
  product: string;
  startTime: string;
  endTime: string;
  audience: string;
  status: 'active' | 'completed' | 'draft' | 'planned';
  results?: PromotionResults;
}

export interface PromotionResults {
  newClients: number;
  repeatPurchases: number;
  averageCheck: number;
  revenue: number;
  profit: number;
  newClientsChange: number;
  repeatPurchasesChange: number;
  averageCheckChange: number;
  revenueChange: number;
  profitChange: number;
}

export interface FinanceData {
  revenue: number;
  expenses: number;
  netProfit: number;
  margin: number;
  averageCheck: number;
  orders: number;
  revenueChange: number;
  expensesChange: number;
  profitChange: number;
  marginChange: number;
  averageCheckChange: number;
  ordersChange: number;
  chartData: { date: string; revenue: number; expenses: number; profit: number }[];
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  totalPurchases: number;
  totalSpent: number;
  lastVisit: string;
  frequency: string;
  segment: 'new' | 'regular' | 'vip' | 'lost';
  age?: string;
  favoriteProducts?: string[];
}

export interface ClientSegments {
  total: number;
  new: number;
  regular: number;
  lost: number;
  vip: number;
  lostClientsList: Client[];
}

export interface LoyaltyData {
  totalPointsIssued: number;
  totalPointsUsed: number;
  activeMembers: number;
  levels: { name: string; minPoints: number; benefits: string; count: number }[];
}

export interface AudienceInsight {
  ageGroups: { group: string; percent: number }[];
  peakHours: { hour: string; visits: number }[];
  popularProducts: { name: string; percent: number }[];
  visitFrequency: { label: string; percent: number }[];
  averageCheckBySegment: { segment: string; check: number }[];
  aiSummary: string;
}

export interface BusinessGoal {
  id: string;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  plan: { month: number; target: number; actual?: number }[];
  status: 'on_track' | 'behind' | 'ahead';
}

export interface BusinessEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  result: string;
  type: 'loyalty' | 'promotion' | 'marketing' | 'other';
}

export interface SimulationResult {
  expectedClients: number;
  expectedRevenue: number;
  expectedProfit: number;
  risk: 'low' | 'medium' | 'high';
  explanation: string;
}

export interface CompetitorData {
  name: string;
  category: string;
  avgCheck: number;
  popularOffers: string[];
  promotions: string[];
}

export interface SMMContent {
  postText: string;
  storiesText: string;
  reelsScript: string;
  headline: string;
  cta: string;
  audienceNote: string;
}

// ============================================================
// Mock Data Instances
// ============================================================

export const mockBusiness: BusinessData = {
  name: 'Coffee & Co',
  category: 'Кофейня',
  city: 'Алматы',
  size: 'малый (1-5 сотрудников)',
  goals: ['Больше клиентов', 'Увеличить прибыль'],
  createdAt: '2024-03-15',
};

export const mockPulseScore: PulseScore = {
  total: 91,
  breakdown: {
    sales: 92,
    clients: 78,
    loyalty: 88,
    marketing: 71,
    profit: 94,
  },
};

export const mockMetrics: MetricCard[] = [
  {
    label: 'Выручка',
    value: '1 284 000 ₸',
    change: 12,
    trend: 'up',
  },
  {
    label: 'Клиенты',
    value: '1 248',
    change: 8,
    trend: 'up',
  },
  {
    label: 'Средний чек',
    value: '5 420 ₸',
    change: -3,
    trend: 'down',
  },
  {
    label: 'Прибыль',
    value: '386 000 ₸',
    change: 9,
    trend: 'up',
  },
];

export const mockInsights: AIInsight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Поток клиентов после 18:00 снизился',
    description:
      'Количество клиентов в вечернее время (после 18:00) уменьшилось на 31% по сравнению с прошлой неделей. Это основная причина снижения общей выручки.',
    recommendation:
      'Рекомендуем запустить Happy Hour с 18:00 до 20:00 со скидкой 15% на все кофейные напитки. Это привлечёт вечернюю аудиторию и повысит поток.',
    action: 'create_promotion',
    actionLabel: 'Запустить Happy Hour',
    expectedEffect: 'Ожидаемый рост клиентов: +18%, эффект на выручку: +9%',
    priority: 1,
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Утренний поток растёт',
    description:
      'Количество утренних клиентов (7:00–10:00) выросло на 14%. Растёт спрос на завтраки и капучино.',
    recommendation:
      'Добавьте утренний комбо-набор: кофе + выпечка со скидкой 10%. Это закрепит рост и повысит средний чек.',
    action: 'create_promotion',
    actionLabel: 'Создать комбо',
    expectedEffect: 'Ожидаемый рост чека: +22%',
    priority: 2,
  },
  {
    id: '3',
    type: 'info',
    title: '18 клиентов не были более 30 дней',
    description:
      'Обнаружена группа из 18 клиентов, которые не совершали покупку более 30 дней. Часть из них — регулярные клиенты.',
    recommendation:
      'Отправьте персональное предложение с бонусом 500₸ на следующий визит. Это эффективнее массовой рассылки.',
    action: 'return_clients',
    actionLabel: 'Вернуть клиентов',
    expectedEffect: 'Ожидаемый возврат: 40-60% клиентов',
    priority: 3,
  },
];

export const mockTodayActions: TodayAction[] = [
  {
    id: '1',
    title: 'Запустить Happy Hour',
    reason: 'Низкий поток клиентов после 18:00 (снижение 31%)',
    expectedEffect: '+18% клиентов, +9% выручки',
    actionLabel: 'ЗАПУСТИТЬ',
    actionType: 'promotion',
    priority: 1,
  },
  {
    id: '2',
    title: 'Вернуть 18 потерянных клиентов',
    reason: 'Не совершали покупку более 30 дней',
    expectedEffect: 'Возврат 40–60% клиентов',
    actionLabel: 'СОЗДАТЬ',
    actionType: 'clients',
    priority: 2,
  },
  {
    id: '3',
    title: 'Опубликовать Stories',
    reason: 'Ожидается высокий спрос вечером (прогноз AI)',
    expectedEffect: '+12% вовлечённости',
    actionLabel: 'СОЗДАТЬ',
    actionType: 'content',
    priority: 3,
  },
  {
    id: '4',
    title: 'Ответить на 3 отзыва',
    reason: 'Новые отзывы от клиентов ждут ответа',
    expectedEffect: 'Улучшение рейтинга и доверия',
    actionLabel: 'ПОСМОТРЕТЬ',
    actionType: 'reviews',
    priority: 4,
  },
  {
    id: '5',
    title: 'Пополнить запас кофе',
    reason: 'Остаток арабики — 2 дня при текущем расходе',
    expectedEffect: 'Избежание упущенных продаж',
    actionLabel: 'ЗАПИСАТЬ',
    actionType: 'other',
    priority: 5,
  },
];

export const mockPromotions: Promotion[] = [
  {
    id: 'p1',
    name: 'Happy Hour',
    discount: 15,
    product: 'Все кофейные напитки',
    startTime: '2025-01-20 18:00',
    endTime: '2025-01-25 20:00',
    audience: 'Все клиенты',
    status: 'completed',
    results: {
      newClients: 47,
      repeatPurchases: 89,
      averageCheck: 4870,
      revenue: 412000,
      profit: 128000,
      newClientsChange: 18,
      repeatPurchasesChange: 12,
      averageCheckChange: -5,
      revenueChange: 11,
      profitChange: 7,
    },
  },
  {
    id: 'p2',
    name: 'Утренний комбо',
    discount: 10,
    product: 'Кофе + выпечка',
    startTime: '2025-01-27 07:00',
    endTime: '2025-02-10 10:00',
    audience: 'Все клиенты',
    status: 'active',
  },
  {
    id: 'p3',
    name: 'Приветственный бонус',
    discount: 20,
    product: 'Первый заказ',
    startTime: '2025-02-01 00:00',
    endTime: '2025-03-01 23:59',
    audience: 'Новые клиенты',
    status: 'planned',
  },
];

export const mockFinanceData: FinanceData = {
  revenue: 1284000,
  expenses: 898000,
  netProfit: 386000,
  margin: 30.1,
  averageCheck: 5420,
  orders: 237,
  revenueChange: 12,
  expensesChange: 8,
  profitChange: 9,
  marginChange: 0.5,
  averageCheckChange: -3,
  ordersChange: 15,
  chartData: [
    { date: '01.01', revenue: 142000, expenses: 98000, profit: 44000 },
    { date: '01.05', revenue: 158000, expenses: 105000, profit: 53000 },
    { date: '01.10', revenue: 135000, expenses: 92000, profit: 43000 },
    { date: '01.15', revenue: 168000, expenses: 118000, profit: 50000 },
    { date: '01.20', revenue: 192000, expenses: 134000, profit: 58000 },
    { date: '01.25', revenue: 178000, expenses: 126000, profit: 52000 },
    { date: '01.30', revenue: 211000, expenses: 145000, profit: 66000 },
  ],
};

export const mockClients: Client[] = [
  {
    id: 'c1',
    name: 'Айдана К.',
    phone: '+7 771 123 4567',
    totalPurchases: 34,
    totalSpent: 184280,
    lastVisit: '2025-01-29',
    frequency: '3-4 раза в неделю',
    segment: 'vip',
    age: '25-34',
    favoriteProducts: ['Капучино', 'Чизкейк'],
  },
  {
    id: 'c2',
    name: 'Дмитрий С.',
    phone: '+7 702 234 5678',
    totalPurchases: 21,
    totalSpent: 105420,
    lastVisit: '2025-01-28',
    frequency: '1-2 раза в неделю',
    segment: 'regular',
    age: '25-34',
    favoriteProducts: ['Латте', 'Круассан'],
  },
  {
    id: 'c3',
    name: 'Мария Л.',
    phone: '+7 777 345 6789',
    totalPurchases: 2,
    totalSpent: 12800,
    lastVisit: '2025-01-10',
    frequency: 'редко',
    segment: 'lost',
    age: '18-24',
    favoriteProducts: ['Американо'],
  },
  {
    id: 'c4',
    name: 'Арман Б.',
    phone: '+7 701 456 7890',
    totalPurchases: 1,
    totalSpent: 4200,
    lastVisit: '2025-01-05',
    frequency: 'однократно',
    segment: 'new',
    age: '35-44',
    favoriteProducts: ['Эспрессо'],
  },
  {
    id: 'c5',
    name: 'Нурлан Т.',
    phone: '+7 775 567 8901',
    totalPurchases: 56,
    totalSpent: 312400,
    lastVisit: '2025-01-30',
    frequency: '5-6 раз в неделю',
    segment: 'vip',
    age: '25-34',
    favoriteProducts: ['Капучино', 'Раф', 'Тирамису'],
  },
  {
    id: 'c6',
    name: 'Сауле М.',
    phone: '+7 708 678 9012',
    totalPurchases: 15,
    totalSpent: 72100,
    lastVisit: '2025-01-27',
    frequency: '1 раз в неделю',
    segment: 'regular',
    age: '45+',
    favoriteProducts: ['Латте', 'Брауни'],
  },
  {
    id: 'c7',
    name: 'Тимур К.',
    phone: '+7 773 789 0123',
    totalPurchases: 3,
    totalSpent: 15600,
    lastVisit: '2025-01-20',
    frequency: 'редко',
    segment: 'lost',
    age: '18-24',
    favoriteProducts: ['Айс-латте'],
  },
  {
    id: 'c8',
    name: 'Елена В.',
    phone: '+7 707 890 1234',
    totalPurchases: 28,
    totalSpent: 156800,
    lastVisit: '2025-01-29',
    frequency: '3-4 раза в неделю',
    segment: 'vip',
    age: '25-34',
    favoriteProducts: ['Капучино', 'Маффины'],
  },
  {
    id: 'c9',
    name: 'Бекзат О.',
    phone: '+7 776 901 2345',
    totalPurchases: 1,
    totalSpent: 3800,
    lastVisit: '2025-01-25',
    frequency: 'однократно',
    segment: 'new',
    age: '35-44',
    favoriteProducts: ['Двойной эспрессо'],
  },
  {
    id: 'c10',
    name: 'Динара А.',
    phone: '+7 770 012 3456',
    totalPurchases: 19,
    totalSpent: 98700,
    lastVisit: '2025-01-28',
    frequency: '2-3 раза в неделю',
    segment: 'regular',
    age: '18-24',
    favoriteProducts: ['Раф', 'Чизкейк'],
  },
];

export const mockClientSegments: ClientSegments = {
  total: 1248,
  new: 156,
  regular: 724,
  lost: 198,
  vip: 170,
  lostClientsList: mockClients.filter((c) => c.segment === 'lost'),
};

export const mockLoyaltyData: LoyaltyData = {
  totalPointsIssued: 485200,
  totalPointsUsed: 312400,
  activeMembers: 894,
  levels: [
    {
      name: 'Бронза',
      minPoints: 0,
      benefits: 'Накопление бонусов 1₸ = 1 балл',
      count: 420,
    },
    {
      name: 'Серебро',
      minPoints: 5000,
      benefits: 'Накопление 1.5₸ = 1 балл, день рождения — сюрприз',
      count: 312,
    },
    {
      name: 'Золото',
      minPoints: 15000,
      benefits: 'Накопление 2₸ = 1 балл, персональные предложения',
      count: 132,
    },
    {
      name: 'Платина',
      minPoints: 30000,
      benefits: 'Приоритетное обслуживание, эксклюзивные акции',
      count: 30,
    },
  ],
};

export const mockAudienceInsight: AudienceInsight = {
  ageGroups: [
    { group: '18–24', percent: 42 },
    { group: '25–34', percent: 31 },
    { group: '35–44', percent: 18 },
    { group: '45+', percent: 9 },
  ],
  peakHours: [
    { hour: '07:00', visits: 45 },
    { hour: '08:00', visits: 78 },
    { hour: '09:00', visits: 92 },
    { hour: '10:00', visits: 65 },
    { hour: '11:00', visits: 42 },
    { hour: '12:00', visits: 58 },
    { hour: '13:00', visits: 72 },
    { hour: '14:00', visits: 48 },
    { hour: '15:00', visits: 38 },
    { hour: '16:00', visits: 32 },
    { hour: '17:00', visits: 41 },
    { hour: '18:00', visits: 28 },
    { hour: '19:00', visits: 22 },
    { hour: '20:00', visits: 18 },
  ],
  popularProducts: [
    { name: 'Капучино', percent: 34 },
    { name: 'Латте', percent: 22 },
    { name: 'Раф', percent: 15 },
    { name: 'Американо', percent: 12 },
    { name: 'Эспрессо', percent: 9 },
    { name: 'Айс-латте', percent: 8 },
  ],
  visitFrequency: [
    { label: 'Ежедневно', percent: 12 },
    { label: '3-4 раза в неделю', percent: 28 },
    { label: '1-2 раза в неделю', percent: 35 },
    { label: '1-2 раза в месяц', percent: 18 },
    { label: 'Реже', percent: 7 },
  ],
  averageCheckBySegment: [
    { segment: 'VIP', check: 6800 },
    { segment: 'Постоянные', check: 5100 },
    { segment: 'Новые', check: 4200 },
  ],
  aiSummary:
    'Основная аудитория — 18–34 года (73%). Рекомендуем делать акцент на вечерние акции и короткий видеоконтент. Пиковая нагрузка — утро (8:00–10:00). Наибольший потенциал роста — вечерний сегмент (18:00–20:00).',
};

export const mockGoals: BusinessGoal[] = [
  {
    id: 'g1',
    title: 'Увеличить месячную прибыль на 20%',
    targetValue: 20,
    currentValue: 9,
    unit: '%',
    deadline: '2025-04-15',
    status: 'on_track',
    plan: [
      { month: 1, target: 5, actual: 9 },
      { month: 2, target: 12, actual: 9 },
      { month: 3, target: 17 },
      { month: 4, target: 20 },
    ],
  },
  {
    id: 'g2',
    title: 'Привлечь 200 новых клиентов',
    targetValue: 200,
    currentValue: 156,
    unit: 'человек',
    deadline: '2025-03-31',
    status: 'on_track',
    plan: [
      { month: 1, target: 50, actual: 48 },
      { month: 2, target: 100, actual: 108 },
      { month: 3, target: 200 },
    ],
  },
  {
    id: 'g3',
    title: 'Снизить отток клиентов до 10%',
    targetValue: 10,
    currentValue: 15.8,
    unit: '%',
    deadline: '2025-06-30',
    status: 'behind',
    plan: [
      { month: 1, target: 14, actual: 15.8 },
      { month: 2, target: 12 },
      { month: 3, target: 10 },
    ],
  },
];

export const mockBusinessHistory: BusinessEvent[] = [
  {
    id: 'e1',
    date: '2024-11-01',
    title: 'Запуск программы лояльности',
    description: 'Запущена бонусная система с 4 уровнями',
    result: 'Повторные покупки +18%',
    type: 'loyalty',
  },
  {
    id: 'e2',
    date: '2024-12-01',
    title: 'Запуск Happy Hour',
    description: 'Скидка 15% на все напитки с 18:00 до 20:00',
    result: 'Вечерний поток +21%',
    type: 'promotion',
  },
  {
    id: 'e3',
    date: '2025-01-15',
    title: 'Акция «Приведи друга»',
    description: 'Бонус 500₸ за каждого приглашённого друга',
    result: 'Новых клиентов +32',
    type: 'marketing',
  },
];

export const mockCompetitors: CompetitorData[] = [
  {
    name: 'Coffee Lab',
    category: 'Кофейня',
    avgCheck: 4800,
    popularOffers: ['Сезонный кофе', 'Комбо бизнес-ланч'],
    promotions: ['Скидка 20% на первый заказ', 'Кэшбэк 5%'],
  },
  {
    name: 'Bean & Brew',
    category: 'Кофейня',
    avgCheck: 5200,
    popularOffers: ['Спешелти кофе', 'Веган десерты'],
    promotions: ['Карта постоянного гостя', 'Happy Hour 17:00–19:00'],
  },
  {
    name: 'StarCoffee',
    category: 'Сеть кофеен',
    avgCheck: 6100,
    popularOffers: ['Фирменные напитки', 'Сувениры'],
    promotions: ['Программа «Звёзды»', 'Скидка 10% по коду'],
  },
];

export const mockClientPromotions = [
  {
    id: 'cp1',
    title: '−20% на кофе после 18:00',
    description: 'Happy Hour в Coffee & Co',
    businessName: 'Coffee & Co',
    distance: '0.8 км',
    rating: 4.8,
    expiresAt: '2025-02-10',
    isOpen: true,
    category: 'Кофейня',
  },
  {
    id: 'cp2',
    title: '−15% на всё меню',
    description: 'День рождения заведения',
    businessName: 'Bean & Brew',
    distance: '1.2 км',
    rating: 4.6,
    expiresAt: '2025-02-05',
    isOpen: true,
    category: 'Кофейня',
  },
  {
    id: 'cp3',
    title: 'Бесплатный десерт при заказе от 3000₸',
    description: 'Новые гости',
    businessName: 'Sweet Corner',
    distance: '2.1 км',
    rating: 4.3,
    expiresAt: '2025-02-15',
    isOpen: false,
    category: 'Еда',
  },
  {
    id: 'cp4',
    title: '−10% на стрижку',
    description: 'Первое посещение',
    businessName: 'Style Studio',
    distance: '1.5 км',
    rating: 4.7,
    expiresAt: '2025-03-01',
    isOpen: true,
    category: 'Красота',
  },
  {
    id: 'cp5',
    title: 'Тренировка в подарок',
    description: 'Пробный день',
    businessName: 'FitZone',
    distance: '3.0 км',
    rating: 4.5,
    expiresAt: '2025-02-20',
    isOpen: true,
    category: 'Фитнес',
  },
];

export const mockNearbyPlaces = [
  {
    id: 'np1',
    name: 'Coffee & Co',
    category: 'Кофейня',
    distance: '0.0 км',
    rating: 4.8,
    isOpen: true,
    promo: 'Happy Hour −20%',
  },
  {
    id: 'np2',
    name: 'Bean & Brew',
    category: 'Кофейня',
    distance: '1.2 км',
    rating: 4.6,
    isOpen: true,
    promo: '−15% на всё',
  },
  {
    id: 'np3',
    name: 'Pizza Milano',
    category: 'Еда',
    distance: '1.8 км',
    rating: 4.4,
    isOpen: true,
    promo: '',
  },
  {
    id: 'np4',
    name: 'Style Studio',
    category: 'Красота',
    distance: '1.5 км',
    rating: 4.7,
    isOpen: false,
    promo: '−10% на стрижку',
  },
  {
    id: 'np5',
    name: 'FitZone',
    category: 'Фитнес',
    distance: '3.0 км',
    rating: 4.5,
    isOpen: true,
    promo: 'Тренировка в подарок',
  },
  {
    id: 'np6',
    name: 'CityMart',
    category: 'Магазины',
    distance: '0.5 км',
    rating: 4.2,
    isOpen: true,
    promo: '',
  },
  {
    id: 'np7',
    name: 'DryClean Pro',
    category: 'Услуги',
    distance: '2.3 км',
    rating: 4.1,
    isOpen: false,
    promo: '',
  },
];

// AI Chat pre-built responses
export const aiChatResponses: Record<string, string> = {
  default:
    'Я могу помочь с анализом вашего бизнеса. Попробуйте спросить:\n\n• «Почему упали продажи?»\n• «Как увеличить средний чек?»\n• «Кого стоит вернуть из клиентов?»\n• «Какая акция будет выгоднее?»\n• «Почему упала прибыль?»',
  sales_down:
    'Продажи снизились на 8% за последнюю неделю.\n\nОсновная причина:\n−14% новых клиентов.\n\nПри этом повторные покупки выросли на 5% — постоянные клиенты остаются лояльны.\n\nПроблема в привлечении новой аудитории.\n\nРекомендация: запустить локальную акцию для привлечения новых клиентов — например, «Первый кофе за 1₸» или скидка 20% на первый заказ.',
  profit_down:
    'Прибыль снизилась на 5%, несмотря на рост выручки на 3%.\n\nПричина: увеличились расходы на продвижение (+18%).\n\nROI маркетинговых активностей:\n— Сocial media: 2.4₸ на каждый вложенный 1₸\n— Реферальная программа: 4.1₸ на каждый вложенный 1₸\n\nРекомендация: перераспределить бюджет в пользу реферальной программы — она эффективнее в 1.7 раза.',
  average_check:
    'Средний чек: 5 420 ₸ (−3% к прошлой неделе).\n\nПо сегментам:\n— VIP клиенты: 6 800 ₸ (стабильно)\n— Постоянные: 5 100 ₸ (−4%)\n— Новые: 4 200 ₸ (−8%)\n\nСнижение чека у новых клиентов связано с акцией «Первый заказ −20%».\n\nРекомендации:\n1. Добавить upsell: «Добавьте десерт за 800₸ (вместо 1200₸)»\n2. Создать комбо-наборы для повышения чека на 15–20%',
  clients_return:
    'Найдено 18 клиентов, которые не совершали покупку более 30 дней.\n\nИз них:\n— 7 были VIP (частота 3+ раза в неделю)\n— 8 — постоянные (1-2 раза в неделю)\n— 3 — новые (совершили 1-2 покупки)\n\nНаиболее ценные для возврата — VIP-клиенты.\n\nРекомендация:\n1. VIP: персональное предложение +500₸ бонус\n2. Постоянные: промокод на −15%\n3. Новые: «Мы скучаем!» — бонус на следующий заказ',
  best_promotion:
    'Анализ истории акций за последние 3 месяца:\n\n1. Happy Hour (18:00–20:00, −15%)\n   ROI: +11% выручки, +7% прибыли\n   Лучший результат по привлечению новых клиентов\n\n2. Утренний комбо (кофе + выпечка, −10%)\n   ROI: +8% выручки, +12% прибыли\n   Лучший результат по маржинальности\n\n3. Приветственный бонус (−20% первый заказ)\n   ROI: +15% новых клиентов\n   Но маржинальность −18% на этих заказах\n\nРекомендация: комбинируйте Happy Hour + утренний комбо для максимального эффекта.',
  audience:
    'Ваша основная аудитория:\n\nВозраст:\n18–24 — 42% (студенты, молодые специалисты)\n25–34 — 31% (офисные работники)\n35–44 — 18%\n45+ — 9%\n\nПоведения:\n— Пик посещений: 8:00–10:00 (утро)\n— Самый популярный продукт: Капучино (34%)\n— Частота: 63% посещают 1+ раз в неделю\n\nРекомендации:\n1. Вечерние акции для молодёжи (18–24)\n2. Комбо-наборы для офисных (25–34)\n3. Короткий видеоконтент для соцсетей',
};

export const mockAdminTools = [
  {
    id: 'at1',
    name: 'AI Аналитика',
    description: 'Автоматический анализ данных бизнеса и рекомендации',
    icon: 'Brain',
    enabled: true,
  },
  {
    id: 'at2',
    name: 'Умные акции',
    description: 'Создание акций с AI-прогнозированием результатов',
    icon: 'Sparkles',
    enabled: true,
  },
  {
    id: 'at3',
    name: 'CRM Lite',
    description: 'Управление клиентами и сегментация',
    icon: 'Users',
    enabled: true,
  },
  {
    id: 'at4',
    name: 'Программа лояльности',
    description: 'Бонусная система с уровнями',
    icon: 'Heart',
    enabled: true,
  },
  {
    id: 'at5',
    name: 'AI Контент',
    description: 'Генерация контента для соцсетей',
    icon: 'Pen',
    enabled: true,
  },
  {
    id: 'at6',
    name: 'AI Финансист',
    description: 'Финансовая аналитика и прогнозирование',
    icon: 'TrendingUp',
    enabled: false,
  },
  {
    id: 'at7',
    name: 'Конкуренты',
    description: 'Мониторинг рынка рядом',
    icon: 'Eye',
    enabled: false,
  },
  {
    id: 'at8',
    name: 'AI Календарь',
    description: 'Предиктивные рекомендации по сезонности',
    icon: 'Calendar',
    enabled: false,
  },
];

export const mockAdminTemplates = [
  {
    id: 'tpl1',
    name: 'Happy Hour',
    description: 'Скидка на вечерние часы для увеличения потока',
    discount: 15,
    category: 'Кофейня',
  },
  {
    id: 'tpl2',
    name: 'Приветственный бонус',
    description: 'Скидка для новых клиентов',
    discount: 20,
    category: 'Все',
  },
  {
    id: 'tpl3',
    name: 'Комбо-набор',
    description: 'Комбинация товаров со скидкой',
    discount: 10,
    category: 'Все',
  },
  {
    id: 'tpl4',
    name: 'День рождения',
    description: 'Специальное предложение на день рождения клиента',
    discount: 25,
    category: 'Все',
  },
  {
    id: 'tpl5',
    name: 'Верни друга',
    description: 'Бонус за привлечение нового клиента',
    discount: 0,
    category: 'Все',
  },
];
