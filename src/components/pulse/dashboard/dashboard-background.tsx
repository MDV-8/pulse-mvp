'use client';

import { useAppStore } from '@/stores/app-store';

/**
 * DashboardBackground — subtle ambient gradient blobs for the dark theme dashboard.
 * Renders two large, slowly animating gradient blobs behind all content.
 * Only visible in dark theme. Uses pointer-events-none so it never blocks interaction.
 */
export function DashboardBackground() {
  const theme = useAppStore((s) => s.theme);

  if (theme !== 'dark') return null;

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Purple blob — top-left area, figure-8 float */}
      <div className="dashboard-blob-1 absolute -top-32 -left-32" />

      {/* Cyan blob — bottom-right area, opposite pattern */}
      <div className="dashboard-blob-2 absolute -bottom-32 -right-32" />
    </div>
  );
}
