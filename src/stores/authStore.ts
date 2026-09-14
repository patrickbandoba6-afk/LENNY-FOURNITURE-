import { create } from "zustand";
import { supabase } from "@/services/supabase";
import type { Profile } from "@/types";

interface AuthState {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    role: Profile["role"];
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  setProfile: (profile) => set({ profile, isAuthenticated: Boolean(profile) }),
  setLoading: (isLoading) => set({ isLoading }),

  signIn: async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { error: error.message };
    return {};
  },

  signUp: async ({ email, password, fullName, role }) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };

    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        role,
        full_name: fullName,
        email,
      });
      if (profileError) return { error: profileError.message };
    }
    return {};
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ profile: null, isAuthenticated: false });
  },
}));
