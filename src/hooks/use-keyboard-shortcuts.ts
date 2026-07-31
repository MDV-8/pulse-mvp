'use client';

import { useEffect } from 'react';
import { useAppStore, type OwnerView } from '@/stores/app-store';

const VIEW_MAP: Record<number, OwnerView> = {
  1: 'dashboard',
  2: 'ai',
  3: 'sales',
  4: 'clients',
  5: 'promotions',
};

export function useKeyboardShortcuts() {
  const appMode = useAppStore((s) => s.appMode);
  const setOwnerView = useAppStore((s) => s.setOwnerView);
  const setShowCreatePromotion = useAppStore((s) => s.setShowCreatePromotion);
  const setShowReturnClients = useAppStore((s) => s.setShowReturnClients);
  const setShowAIContent = useAppStore((s) => s.setShowAIContent);
  const setShowSearch = useAppStore((s) => s.setShowSearch);
  const setShowNotifications = useAppStore((s) => s.setShowNotifications);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  useEffect(() => {
    // Only register shortcuts when in owner mode
    if (appMode !== 'owner') return;

    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement;
      // Ignore when typing in inputs / textareas
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Still allow Escape to close dialogs
        if (e.key === 'Escape') {
          e.preventDefault();
          setShowCreatePromotion(false);
          setShowReturnClients(false);
          setShowAIContent(false);
          setShowSearch(false);
          setShowNotifications(false);
        }
        return;
      }

      // Escape → close all dialogs
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowCreatePromotion(false);
        setShowReturnClients(false);
        setShowAIContent(false);
        setShowSearch(false);
        setShowNotifications(false);
        return;
      }

      // Cmd/Ctrl + K → toggle global search
      if (isMod && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
        return;
      }

      // Cmd/Ctrl + 1-5 → switch owner views
      if (isMod && e.key >= '1' && e.key <= '5') {
        e.preventDefault();
        const view = VIEW_MAP[Number(e.key)];
        if (view) setOwnerView(view);
        return;
      }

      // Cmd/Ctrl + D → toggle theme
      if (isMod && e.key === 'd') {
        e.preventDefault();
        setTheme(theme === 'dark' ? 'light' : 'dark');
        return;
      }

      // ? → open global search
      if (e.key === '?') {
        e.preventDefault();
        setShowSearch(true);
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    appMode,
    setOwnerView,
    setShowCreatePromotion,
    setShowReturnClients,
    setShowAIContent,
    setShowSearch,
    setShowNotifications,
    theme,
    setTheme,
  ]);
}
