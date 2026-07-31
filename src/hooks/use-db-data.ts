'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

// ============================================================
// Types matching the DB schema / API response
// ============================================================

export interface DBPromotion {
  id: string;
  name: string;
  discount: number;
  product: string;
  audience: string;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DBOrder {
  id: string;
  orderNumber: number;
  items: string;
  total: number;
  status: string;
  createdAt: string;
}

interface DBDataState {
  promotions: DBPromotion[];
  orders: DBOrder[];
  loading: boolean;
  refetch: () => void;
}

export function useDBData(): DBDataState {
  const [promotions, setPromotions] = useState<DBPromotion[]>([]);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);

  // Prevent double-fetch in React StrictMode
  const mountedRef = useRef(false);

  const fetchData = useCallback(async () => {
    try {
      const [promosRes, ordersRes] = await Promise.all([
        fetch('/api/promotions'),
        fetch('/api/orders'),
      ]);

      if (promosRes.ok) {
        const promos = await promosRes.json();
        setPromotions(Array.isArray(promos) ? promos : []);
      }

      if (ordersRes.ok) {
        const ords = await ordersRes.json();
        setOrders(Array.isArray(ords) ? ords : []);
      }
    } catch (error) {
      console.error('[useDBData] Failed to fetch:', error);
      // Fallback to empty arrays on error
      setPromotions([]);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    fetchData();
  }, [fetchData]);

  return { promotions, orders, loading, refetch: fetchData };
}
