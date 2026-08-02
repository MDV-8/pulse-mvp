'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, AlertTriangle, ChevronDown, ChevronUp, Phone, ShoppingBag, Clock, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExportButton } from '@/components/pulse/shared/export-button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { useAppStore } from '@/stores/app-store';
import {
  mockClients,
  mockClientSegments,
  type Client,
} from '@/data/mock-data';

const segmentLabels: Record<Client['segment'], string> = {
  new: 'Новый',
  regular: 'Постоянный',
  vip: 'VIP',
  lost: 'Потерянный',
};

const segmentColors: Record<Client['segment'], string> = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  regular: 'bg-green-500/20 text-green-400 border-green-500/30',
  vip: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const segmentDotColors: Record<Client['segment'], string> = {
  new: 'bg-blue-400',
  regular: 'bg-green-400',
  vip: 'bg-purple-400',
  lost: 'bg-red-400',
};

type SegmentFilter = 'all' | Client['segment'];

export default function ClientsList() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<SegmentFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);

  const filters: { key: SegmentFilter; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'new', label: 'Новые' },
    { key: 'regular', label: 'Постоянные' },
    { key: 'vip', label: 'VIP' },
    { key: 'lost', label: 'Потерянные' },
  ];

  const filtered = mockClients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchesFilter = filter === 'all' || c.segment === filter;
    return matchesSearch && matchesFilter;
  });

  const summaryCards = [
    { label: 'Всего', value: mockClientSegments.total.toLocaleString('ru'), icon: Users, color: 'text-purple-400' },
    { label: 'Новые', value: mockClientSegments.new.toLocaleString('ru'), icon: Star, color: 'text-blue-400' },
    { label: 'Постоянные', value: mockClientSegments.regular.toLocaleString('ru'), icon: ShoppingBag, color: 'text-green-400' },
    { label: 'VIP', value: mockClientSegments.vip.toLocaleString('ru'), icon: Star, color: 'text-purple-400' },
  ];

  const expandedClient = expandedId ? mockClients.find((c) => c.id === expandedId) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20 shrink-0">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-shadow-glow">Клиенты</h1>
        </div>
        <span className="w-2 h-2 rounded-full bg-purple-400 particle-drift shrink-0" />
        <div className="ml-auto shrink-0">
          <ExportButton
            title="Клиенты"
            headers={['Имя', 'Телефон', 'Покупки', 'Сумма', 'Сегмент']}
            rows={filtered.map((c) => [
              c.name,
              c.phone,
              String(c.totalPurchases),
              `${c.totalSpent.toLocaleString('ru')} ₸`,
              segmentLabels[c.segment],
            ])}
          />
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={`py-4 px-4 card-hover-lift hover-scale ${card.label === 'VIP' ? 'glass-card-accent-amber' : ''}`}>
              <CardContent className="p-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${card.color}`}>
                    <card.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{card.label}</p>
                    <p className={`text-xl font-bold ${card.label === 'Всего' ? 'stat-glow-purple number-glow' : card.label === 'VIP' ? 'number-glow' : ''}`}>{card.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Поиск по имени или телефону..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 focus:shadow-[0_0_12px_rgba(139,92,246,0.15)]"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((f) => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.key)}
              className={
                filter === f.key
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : ''
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Client Table */}
      <Card className="p-0 overflow-hidden">
        <ScrollArea className="max-h-[480px] overflow-x-auto">
          <Table className="min-w-[500px]">
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead>Имя</TableHead>
                <TableHead className="hidden md:table-cell">Телефон</TableHead>
                <TableHead>Покупки</TableHead>
                <TableHead className="hidden sm:table-cell">Сумма</TableHead>
                <TableHead className="hidden lg:table-cell">Последний визит</TableHead>
                <TableHead>Сегмент</TableHead>
                <TableHead className="hidden md:table-cell">Частота</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => (
                <TableRow
                  key={client.id}
                  className={`border-b border-border/30 hover:bg-muted/30 cursor-pointer transition-colors card-hover-lift hover-scale ${filtered.indexOf(client) % 2 === 0 ? 'bg-transparent' : 'bg-muted/[0.02]'}`}
                  onClick={() =>
                    setExpandedId(expandedId === client.id ? null : client.id)
                  }
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${segmentDotColors[client.segment]}`}
                      />
                      <span className="font-medium">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {client.phone}
                  </TableCell>
                  <TableCell>{client.totalPurchases}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {client.totalSpent.toLocaleString('ru')} ₸
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {client.lastVisit}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-xs ${segmentColors[client.segment]}`}
                    >
                      {segmentLabels[client.segment]}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {client.frequency}
                  </TableCell>
                  <TableCell>
                    {expandedId === client.id ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Expanded Client Detail */}
      {expandedClient && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <Card className="border-t-0 rounded-t-none">
            <CardContent className="p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{expandedClient.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  <span className="stat-glow-green">{expandedClient.totalSpent.toLocaleString('ru')} ₸</span> всего
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>Последний визит: {expandedClient.lastVisit}</span>
                </div>
              </div>
              {expandedClient.favoriteProducts && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Любимые продукты:</span>
                  <div className="flex gap-1">
                    {expandedClient.favoriteProducts.map((p) => (
                      <Badge key={p} variant="secondary" className="text-xs">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {expandedClient.age && (
                <div className="text-sm text-muted-foreground">
                  Возраст: {expandedClient.age}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Lost Clients Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-red-500/30 bg-red-500/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-red-500/20 mt-0.5">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-red-400">Потерянные клиенты</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {mockClientSegments.lost} клиентов не совершали покупку более 30 дней
                  </p>
                </div>
              </div>
              <Button
                onClick={() => setShowReturnClients(true)}
                className="bg-red-600 hover:bg-red-700 text-white whitespace-nowrap micro-interaction"
              >
                ВЕРНУТЬ КЛИЕНТОВ
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
