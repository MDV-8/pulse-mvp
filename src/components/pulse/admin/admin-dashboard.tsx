'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Wrench, FileText, Users, Pen,
  Plus, Pencil, Trash2, Search, Activity, Building2, Sparkles, MessageSquare,
  Brain, Lightbulb, UserPlus, Heart, TrendingUp, Eye, Calendar, PenTool, Check,
  ArrowUpRight, ArrowDownRight, Minus, Instagram, Mail, Megaphone, Bell, Zap,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  mockAdminTools, mockAdminTemplates,
} from '@/data/mock-data';
import { useAppStore } from '@/stores/app-store';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Sparkles, Users: UserPlus, Heart, Pen: PenTool, TrendingUp, Eye, Calendar,
};

type AdminTab = 'dashboard' | 'tools' | 'templates' | 'users' | 'content';

const adminTabs: { key: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'tools', label: 'Инструменты', icon: Wrench },
  { key: 'templates', label: 'Шаблоны', icon: FileText },
  { key: 'users', label: 'Пользователи', icon: Users },
  { key: 'content', label: 'Контент', icon: Pen },
];

const statColors = [
  'from-purple-500 to-violet-500',
  'from-green-500 to-emerald-500',
  'from-cyan-500 to-blue-500',
  'from-pink-500 to-rose-500',
];

const toolColors: Record<string, string> = {
  'Brain': 'bg-purple-500/15 text-purple-400',
  'Sparkles': 'bg-amber-500/15 text-amber-400',
  'Users': 'bg-green-500/15 text-green-400',
  'Heart': 'bg-pink-500/15 text-pink-400',
  'Pen': 'bg-cyan-500/15 text-cyan-400',
  'TrendingUp': 'bg-emerald-500/15 text-emerald-400',
  'Eye': 'bg-blue-500/15 text-blue-400',
  'Calendar': 'bg-orange-500/15 text-orange-400',
  'Lightbulb': 'bg-yellow-500/15 text-yellow-400',
  'MessageSquare': 'bg-teal-500/15 text-teal-400',
};

// ---- Dashboard Tab ----
function DashboardTab() {
  const stats = [
    { label: 'Всего пользователей', value: '2 847', icon: Users, trend: '+12%', trendDir: 'up' as const },
    { label: 'Активных бизнесов', value: '342', icon: Building2, trend: '+8%', trendDir: 'up' as const },
    { label: 'Акций создано', value: '1 204', icon: Sparkles, trend: '-3%', trendDir: 'down' as const },
    { label: 'AI-запросов', value: '18 942', icon: Brain, trend: '+24%', trendDir: 'up' as const },
  ];

  const recentActivity = [
    { id: '1', text: 'Coffee & Co запустил акцию «Happy Hour»', time: '5 мин назад' },
    { id: '2', text: 'Новый бизнес зарегистрирован: FitZone', time: '12 мин назад' },
    { id: '3', text: 'AI сгенерировал 8 рекомендаций', time: '18 мин назад' },
    { id: '4', text: 'Обновлён шаблон «Комбо-набор»', time: '1 час назад' },
    { id: '5', text: 'Регистрация 23 новых пользователей', time: '2 часа назад' },
    { id: '6', text: 'Отчёт по финансам за январь готов', time: '3 часа назад' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="py-4 px-4 overflow-hidden relative card-hover-lift micro-interaction">
              {/* Gradient left border accent */}
              <div className={cn('absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-gradient-to-b', statColors[i])} />
              <CardContent className="p-0">
                <div className="flex items-center gap-3 pl-2">
                  <div className="p-2 rounded-lg bg-muted">
                    <s.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground truncate">{s.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{s.value}</p>
                    </div>
                  </div>
                  <div className={cn(
                    'flex items-center gap-0.5 text-xs font-medium shrink-0',
                    s.trendDir === 'up' ? 'text-green-400' : 'text-red-400'
                  )}>
                    {s.trendDir === 'up' ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    {s.trend}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-purple-400" />
            Последняя активность
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.03 }}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>{a.text}</span>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {a.time}
                </span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- Tools Tab ----
interface AdminTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  enabled: boolean;
}

function ToolsTab() {
  const [tools, setTools] = useState<AdminTool[]>(mockAdminTools);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');

  const toggleTool = (id: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const startEdit = (tool: AdminTool) => {
    setEditingId(tool.id);
    setEditName(tool.name);
    setEditDesc(tool.description);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setTools((prev) =>
      prev.map((t) =>
        t.id === editingId ? { ...t, name: editName, description: editDesc } : t
      )
    );
    setEditingId(null);
  };

  const addTool = () => {
    const newTool: AdminTool = {
      id: `at-${Date.now()}`,
      name: 'Новый инструмент',
      description: 'Описание инструмента',
      icon: 'Lightbulb',
      enabled: false,
    };
    setTools((prev) => [...prev, newTool]);
    startEdit(newTool);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Инструменты</h2>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={addTool}>
          <Plus className="w-4 h-4 mr-1" />
          Добавить
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool, i) => {
          const IconComponent = iconMap[tool.icon] || Lightbulb;
          const isEditing = editingId === tool.id;
          const colorClass = toolColors[tool.icon] || toolColors['Lightbulb'];

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={cn('p-0 transition-opacity card-hover-lift micro-interaction', !tool.enabled && 'opacity-60')}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Circular colored icon container */}
                      <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', colorClass)}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      {isEditing ? (
                        <div className="space-y-1 flex-1">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-7 text-sm"
                          />
                          <Input
                            value={editDesc}
                            onChange={(e) => setEditDesc(e.target.value)}
                            className="h-7 text-sm"
                          />
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-semibold text-sm">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {tool.description}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isEditing ? (
                        <Button size="sm" variant="ghost" onClick={saveEdit} className="text-green-400 hover:text-green-300">
                          <Check className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => startEdit(tool)} className="text-muted-foreground hover:text-foreground">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      'text-xs font-medium',
                      tool.enabled ? 'text-green-400' : 'text-red-400/70'
                    )}>
                      {tool.enabled ? '● Включён' : '○ Выключен'}
                    </span>
                    <Switch checked={tool.enabled} onCheckedChange={() => toggleTool(tool.id)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Templates Tab ----
interface Template {
  id: string;
  name: string;
  description: string;
  discount: number;
  category: string;
}

const templateGradients = [
  'from-purple-500/10 to-violet-500/5',
  'from-green-500/10 to-emerald-500/5',
  'from-cyan-500/10 to-blue-500/5',
  'from-pink-500/10 to-rose-500/5',
  'from-amber-500/10 to-orange-500/5',
];

function TemplatesTab() {
  const [templates, setTemplates] = useState<Template[]>(mockAdminTemplates);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const addTemplate = () => {
    if (!newName.trim()) return;
    setTemplates((prev) => [
      ...prev,
      {
        id: `tpl-${Date.now()}`,
        name: newName,
        description: newDesc,
        discount: parseInt(newDiscount) || 0,
        category: newCategory || 'Все',
      },
    ]);
    setShowAdd(false);
    setNewName('');
    setNewDesc('');
    setNewDiscount('');
    setNewCategory('');
  };

  const deleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Шаблоны акций</h2>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Добавить шаблон
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ScrollArea className="max-h-[500px] md:contents">
          {templates.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card className={cn('p-0 overflow-hidden hover:border-purple-500/30 transition-colors card-hover-lift micro-interaction')}>
                {/* Top gradient strip */}
                <div className={cn('h-1.5 bg-gradient-to-r', templateGradients[i % templateGradients.length])} />
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm">{tpl.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {tpl.description}
                      </p>
                    </div>
                    {tpl.discount > 0 && (
                      <div className="shrink-0 w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold text-green-400">-{tpl.discount}%</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {tpl.category}
                    </Badge>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground h-7 w-7 p-0" onClick={() => toast.info(`Редактирование шаблона «${tpl.name}» будет доступно в следующей версии`)}>
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-muted-foreground hover:text-red-400 h-7 w-7 p-0"
                        onClick={() => deleteTemplate(tpl.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </ScrollArea>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle>Добавить шаблон</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Название</label>
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Название шаблона" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Описание</label>
              <Input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Описание" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Скидка (%)</label>
                <Input value={newDiscount} onChange={(e) => setNewDiscount(e.target.value)} placeholder="0" type="number" />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">Категория</label>
                <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Все" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Отмена</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white" onClick={addTemplate}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ---- Users Tab ----
const mockUsers = [
  { id: 'u1', name: 'Айсара К.', email: 'aisara@coffee-co.kz', business: 'Coffee & Co', plan: 'Про', status: 'active', joined: '2024-03-15' },
  { id: 'u2', name: 'Дмитрий С.', email: 'dmitry@beanbrew.kz', business: 'Bean & Brew', plan: 'Старт', status: 'active', joined: '2024-06-22' },
  { id: 'u3', name: 'Мария Л.', email: 'maria@pizza-mi.kz', business: 'Pizza Milano', plan: 'Бизнес', status: 'active', joined: '2024-09-10' },
  { id: 'u4', name: 'Арман Б.', email: 'arman@style.kz', business: 'Style Studio', plan: 'Старт', status: 'trial', joined: '2025-01-05' },
  { id: 'u5', name: 'Нурлан Т.', email: 'nurlan@fitzone.kz', business: 'FitZone', plan: 'Бизнес', status: 'active', joined: '2024-11-18' },
  { id: 'u6', name: 'Сауле М.', email: 'saul@citymart.kz', business: 'CityMart', plan: 'Про', status: 'inactive', joined: '2024-04-02' },
];

const avatarColors = [
  'bg-purple-500/20 text-purple-400',
  'bg-green-500/20 text-green-400',
  'bg-cyan-500/20 text-cyan-400',
  'bg-pink-500/20 text-pink-400',
  'bg-amber-500/20 text-amber-400',
  'bg-blue-500/20 text-blue-400',
];

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

function UsersTab() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.business.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="text-[10px] bg-green-500/20 text-green-400 border-green-500/30">Активен</Badge>;
      case 'trial': return <Badge className="text-[10px] bg-purple-500/20 text-purple-400 border-purple-500/30">Триал</Badge>;
      case 'inactive': return <Badge className="text-[10px] bg-red-500/20 text-red-400 border-red-500/30">Неактивен</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <h2 className="text-lg font-semibold">Пользователи</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Поиск..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm w-48"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 bg-muted border border-border rounded-md text-sm px-2 text-foreground"
          >
            <option value="all">Все</option>
            <option value="active">Активные</option>
            <option value="trial">Триал</option>
            <option value="inactive">Неактивные</option>
          </select>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <ScrollArea className="max-h-[400px] overflow-x-auto">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead>Пользователь</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Бизнес</TableHead>
                <TableHead className="hidden sm:table-cell">План</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead className="hidden lg:table-cell">Дата</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((user, idx) => (
                <TableRow key={user.id} className="border-b border-border/30 card-hover-lift">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0', avatarColors[idx % avatarColors.length])}>
                        {getInitials(user.name)}
                      </div>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">{user.email}</TableCell>
                  <TableCell className="text-sm">{user.business}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant="outline" className="text-xs">{user.plan}</Badge>
                  </TableCell>
                  <TableCell>{statusBadge(user.status)}</TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </div>
  );
}

// ---- Content Tab ----
const contentBlocks = [
  { id: 'cb1', name: 'Instagram посты', description: 'Автоматическая генерация постов', enabled: true, icon: Instagram },
  { id: 'cb2', name: 'Stories', description: 'Короткий контент для Stories', enabled: true, icon: Sparkles },
  { id: 'cb3', name: 'Reels сценарии', description: 'Сценарии для коротких видео', enabled: false, icon: Megaphone },
  { id: 'cb4', name: 'Email-рассылки', description: 'Недельные новости и предложения', enabled: true, icon: Mail },
  { id: 'cb5', name: 'Push-уведомления', description: 'Уведомления для клиентов', enabled: false, icon: Bell },
  { id: 'cb6', name: 'AI рекомендации', description: 'Персонализированные предложения', enabled: true, icon: Zap },
];

const contentColors = [
  'bg-pink-500/15 text-pink-400',
  'bg-purple-500/15 text-purple-400',
  'bg-amber-500/15 text-amber-400',
  'bg-cyan-500/15 text-cyan-400',
  'bg-orange-500/15 text-orange-400',
  'bg-yellow-500/15 text-yellow-400',
];

function ContentTab() {
  const [blocks, setBlocks] = useState(contentBlocks);

  const toggleBlock = (id: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-500/20">
          <Pen className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Управление контентом</h2>
          <p className="text-xs text-muted-foreground">Включайте и выключайте типы генерируемого контента</p>
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        {blocks.map((block, i) => {
          const BlockIcon = block.icon;
          return (
            <motion.div
              key={block.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className={cn('p-0 transition-opacity', !block.enabled && 'opacity-60')}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', contentColors[i])}>
                        <BlockIcon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{block.name}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{block.description}</p>
                      </div>
                    </div>
                    <Switch checked={block.enabled} onCheckedChange={() => toggleBlock(block.id)} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Main Component ----
export default function AdminDashboard() {
  const adminView = useAppStore((s) => s.adminView);

  return (
    <div className="space-y-6 glass-shine rounded-2xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600/15 via-purple-500/5 to-transparent border border-purple-500/10 p-5"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-purple-500/5 rounded-full blur-[80px]" />
        <div className="relative flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 shrink-0">
            <LayoutDashboard className="w-5 h-5 text-purple-400" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold truncate">Добро пожаловать в панель управления</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className="pulse-text-gradient font-medium">PULSE</span> • Admin Dashboard
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tab Content — driven by sidebar (adminView from store) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={adminView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {adminView === 'dashboard' && <DashboardTab />}
          {adminView === 'tools' && <ToolsTab />}
          {adminView === 'templates' && <TemplatesTab />}
          {adminView === 'users' && <UsersTab />}
          {adminView === 'content' && <ContentTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
