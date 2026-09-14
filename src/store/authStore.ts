import { create } from 'zustand';

import { authService } from '@/services/authService';
import { sessionService } from '@/services/sessionService';
import { useAppStore } from '@/store/appStore';

interface AuthState {
  isSubmitting: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSubmitting: false,
  error: null,

  signIn: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      await authService.signInWithPassword(email, password);
      await useAppStore.getState().boot();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Connexion impossible.' });
    } finally {
      set({ isSubmitting: false });
    }
  },

  signUp: async (email, password, fullName) => {
    set({ isSubmitting: true, error: null });
    try {
      await authService.signUpWithPassword(email, password, fullName);
      await useAppStore.getState().boot();
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Inscription impossible.' });
    } finally {
      set({ isSubmitting: false });
    }
  },

  requestPasswordReset: async (email) => {
    set({ isSubmitting: true, error: null });
    try {
      await authService.sendPasswordReset(email);
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Envoi impossible.' });
    } finally {
      set({ isSubmitting: false });
    }
  },

  signOut: async () => {
    await sessionService.signOut();
    useAppStore.getState().reset();
    await useAppStore.getState().boot();
  },

  clearError: () => set({ error: null }),
}));
