import { create } from 'zustand';

import { offlineService, type ConnectivityStatus } from '@/services/offlineService';
import { startupService } from '@/services/startupService';
import { detectLocale, type SupportedLocale } from '@/i18n';
import type { UserRole } from '@/types/roles';

export type AppStatus = 'INITIALIZING' | 'LOADING' | 'READY' | 'REFRESHING' | 'OFFLINE' | 'ERROR';

interface AppState {
  status: AppStatus;
  connectivity: ConnectivityStatus;
  locale: SupportedLocale;
  userId: string | null;
  role: UserRole | null;
  errorMessage: string | null;
  boot: () => Promise<void>;
  setLocale: (locale: SupportedLocale) => void;
  reset: () => void;
}

let unsubscribeConnectivity: (() => void) | null = null;

export const useAppStore = create<AppState>((set, get) => ({
  status: 'INITIALIZING',
  connectivity: 'UNKNOWN',
  locale: detectLocale(),
  userId: null,
  role: null,
  errorMessage: null,

  boot: async () => {
    set({ status: 'LOADING', errorMessage: null });

    unsubscribeConnectivity?.();
    unsubscribeConnectivity = offlineService.subscribe((connectivity) => {
      set({ connectivity });
      if (connectivity === 'OFFLINE' && get().status === 'READY') {
        set({ status: 'OFFLINE' });
      } else if (connectivity === 'ONLINE' && get().status === 'OFFLINE') {
        set({ status: 'READY' });
      }
    });

    const outcome = await startupService.run();

    switch (outcome.kind) {
      case 'UNAUTHENTICATED':
        set({ status: 'READY', userId: null, role: null });
        return;
      case 'READY':
        set({ status: 'READY', userId: outcome.userId, role: outcome.role });
        return;
      case 'OFFLINE_READY':
        set({ status: 'OFFLINE', userId: outcome.userId, role: outcome.role });
        return;
      case 'ERROR':
        set({ status: 'ERROR', errorMessage: outcome.message });
        return;
    }
  },

  setLocale: (locale) => set({ locale }),

  reset: () => set({ userId: null, role: null, errorMessage: null }),
}));
