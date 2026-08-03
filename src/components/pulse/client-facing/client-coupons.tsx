'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Tag, Star, MapPin, Ticket, QrCode, Copy, Check, Gift,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/app-store';
import { mockClientPromotions } from '@/data/mock-data';

export default function ClientCoupons() {
  const [activeTab, setActiveTab] = useState<'promotions' | 'my-coupons'>('promotions');
  const [showQR, setShowQR] = useState<string | null>(null);
  const clientCoupons = useAppStore((s) => s.clientCoupons);
  const addClientCoupon = useAppStore((s) => s.addClientCoupon);
  const redeemCoupon = useAppStore((s) => s.useClientCoupon);

  const handleGetCoupon = (promo: (typeof mockClientPromotions)[number]) => {
    const code = `${promo.businessName.slice(0, 6).toUpperCase().replace(/\s/g, '')}-${Math.floor(Math.random() * 100)}`;
    addClientCoupon({
      id: `coupon-${Date.now()}`,
      title: promo.title,
      code,
    });
  };

  const handleUseCoupon = (id: string) => {
    redeemCoupon(id);
    setShowQR(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-500/20">
          <Ticket className="w-5 h-5 text-purple-400" />
        </div>
        <h1 className="text-2xl font-bold">Акции и купоны</h1>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button
          variant={activeTab === 'promotions' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('promotions')}
          className={activeTab === 'promotions' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
        >
          <Gift className="w-4 h-4 mr-1.5" />
          Акции
        </Button>
        <Button
          variant={activeTab === 'my-coupons' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveTab('my-coupons')}
          className={activeTab === 'my-coupons' ? 'bg-purple-600 hover:bg-purple-700 text-white' : ''}
        >
          <Ticket className="w-4 h-4 mr-1.5" />
          Мои купоны
          {clientCoupons.length > 0 && (
            <Badge className="ml-1.5 bg-purple-500/30 text-purple-300 text-[10px] px-1.5">
              {clientCoupons.length}
            </Badge>
          )}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'promotions' ? (
          <motion.div
            key="promotions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {mockClientPromotions.map((promo, i) => (
              <motion.div
                key={promo.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className="p-0 overflow-hidden">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{promo.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {promo.description}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-400 shrink-0"
                      >
                        {promo.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {promo.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        {promo.rating}
                      </span>
                      <span className="text-muted-foreground/60">
                        до {promo.expiresAt}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {promo.businessName}
                      </span>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white text-xs"
                        onClick={() => handleGetCoupon(promo)}
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        Получить купон
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="coupons"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-3"
          >
            {clientCoupons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Ticket className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">У вас пока нет купонов</p>
                <p className="text-xs mt-1">Получите купон из раздела «Акции»</p>
              </div>
            ) : (
              clientCoupons.map((coupon, i) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Card
                    className={`p-0 overflow-hidden ${
                      coupon.used
                        ? 'opacity-60'
                        : ''
                    }`}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm">{coupon.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-xs font-mono bg-muted px-2 py-0.5 rounded">
                              {coupon.code}
                            </code>
                            <Badge
                              variant={coupon.used ? 'secondary' : 'default'}
                              className={`text-[10px] ${
                                coupon.used
                                  ? 'bg-muted text-muted-foreground'
                                  : 'bg-green-500/20 text-green-400 border-green-500/30'
                              }`}
                            >
                              {coupon.used ? 'Использован' : 'Активен'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {!coupon.used && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-xs border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                            onClick={() =>
                              setShowQR(showQR === coupon.id ? null : coupon.id)
                            }
                          >
                            <QrCode className="w-3 h-3 mr-1" />
                            Показать QR
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs"
                            onClick={() => handleUseCoupon(coupon.id)}
                          >
                            Использовать
                          </Button>
                        </div>
                      )}

                      {/* QR Code Display */}
                      <AnimatePresence>
                        {showQR === coupon.id && !coupon.used && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <Separator className="mb-3" />
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-40 h-40 bg-white rounded-xl p-3 flex items-center justify-center">
                                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                  <div className="text-center">
                                    <QrCode className="w-12 h-12 text-white mx-auto mb-2" />
                                    <p className="text-white text-xs font-mono font-bold">
                                      {coupon.code}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Покажите этот код кассиру
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
