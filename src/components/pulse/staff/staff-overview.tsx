'use client';

import { Users, Clock, TrendingUp } from 'lucide-react';

const employees = [
  {
    name: 'Алина Маратова',
    initials: 'АМ',
    role: 'Бариста',
    gradient: 'from-purple-500 to-violet-600',
    isWorking: true,
    revenue: 87400,
    clients: 47,
    performance: 92,
  },
  {
    name: 'Бекзат Нуркенов',
    initials: 'БН',
    role: 'Кассир',
    gradient: 'from-blue-500 to-cyan-600',
    isWorking: true,
    revenue: 62300,
    clients: 38,
    performance: 85,
  },
  {
    name: 'Дарья Иванова',
    initials: 'ДИ',
    role: 'Менеджер',
    gradient: 'from-emerald-500 to-teal-600',
    isWorking: true,
    revenue: 95100,
    clients: 52,
    performance: 97,
  },
  {
    name: 'Канат Сериков',
    initials: 'КС',
    role: 'Повар',
    gradient: 'from-amber-500 to-orange-600',
    isWorking: false,
    revenue: 0,
    clients: 0,
    performance: 78,
  },
  {
    name: 'Санжар Алимов',
    initials: 'СА',
    role: 'Курьер',
    gradient: 'from-pink-500 to-rose-600',
    isWorking: true,
    revenue: 41200,
    clients: 24,
    performance: 81,
  },
];

const teamStats = [
  {
    label: 'Среднее время обслуживания',
    value: '4.2 мин',
    icon: Clock,
    color: 'text-purple-400',
  },
  {
    label: 'Удовлетворённость клиентов',
    value: '94%',
    icon: TrendingUp,
    color: 'text-green-400',
  },
];

export function StaffOverview() {
  const workingCount = employees.filter((e) => e.isWorking).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-shadow-glow">Команда</h2>
          <p className="text-sm text-muted-foreground">
            {workingCount} из {employees.length} сотрудников на смене
          </p>
        </div>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {employees.map((emp) => (
          <div
            key={emp.name}
            className="glass-card rounded-xl p-4 card-hover"
          >
            <div className="flex items-start gap-3 mb-3">
              {/* Avatar */}
              <div
                className={`w-11 h-11 rounded-full bg-gradient-to-br ${emp.gradient} flex items-center justify-center text-sm font-bold text-white shrink-0`}
              >
                {emp.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm truncate">
                    {emp.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-muted-foreground">
                    {emp.role}
                  </span>
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        emp.isWorking ? 'bg-green-400' : 'bg-muted-foreground/40'
                      }`}
                    />
                    <span
                      className={`text-[10px] ${
                        emp.isWorking
                          ? 'text-green-400'
                          : 'text-muted-foreground/50'
                      }`}
                    >
                      {emp.isWorking ? 'На смене' : 'Выходной'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {emp.isWorking && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Выручка сегодня</span>
                  <span className="font-semibold">
                    {emp.revenue.toLocaleString('ru')} ₸
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Обслужено</span>
                  <span className="font-semibold">
                    {emp.clients} клиентов
                  </span>
                </div>
                {/* Performance Bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-muted-foreground">Эффективность</span>
                    <span className="font-medium">{emp.performance}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${emp.gradient} transition-all duration-500`}
                      style={{ width: `${emp.performance}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Team Efficiency */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Эффективность команды
        </h3>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {teamStats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
            >
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Sales per Employee Bar Chart */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground mb-2">Продажи по сотрудникам</p>
          {employees
            .filter((e) => e.isWorking)
            .sort((a, b) => b.revenue - a.revenue)
            .map((emp) => {
              const maxRevenue = Math.max(
                ...employees.filter((e) => e.isWorking).map((e) => e.revenue),
              );
              const widthPercent = (emp.revenue / maxRevenue) * 100;

              return (
                <div key={emp.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium truncate mr-2">{emp.name}</span>
                    <span className="text-muted-foreground whitespace-nowrap">
                      {emp.revenue.toLocaleString('ru')} ₸
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${emp.gradient} transition-all duration-700`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
