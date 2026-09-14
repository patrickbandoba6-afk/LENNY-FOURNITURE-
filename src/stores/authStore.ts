import { create } from "zustand";
import { supabase } from "@/services/supabase";
import { useChildStore } from "@/stores/childStore";
import type { Profile, UserRole } from "@/types";

const GUEST_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: "Admin Démo",
  ADMIN: "Admin Démo",
  PARENT: "Parent Démo",
  STUDENT: "Élève Démo",
  TEACHER: "Enseignant Démo",
  SCHOOL_ADMIN: "École Démo",
  SELLER: "Vendeur Démo",
  DELIVERY_AGENT: "Livreur Démo",
};

interface AuthState {
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  enterGuestMode: (role: UserRole) => void;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (params: {
    email: string;
    password: string;
    fullName: string;
    role: Profile["role"];
  }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  isGuest: false,
  setProfile: (profile) => set({ profile, isAuthenticated: Boolean(profile) }),
  setLoading: (isLoading) => set({ isLoading }),

  // Mode démo : contourne totalement Supabase pour prévisualiser la
  // navigation et l'UI de chaque rôle sans backend configuré.
  enterGuestMode: (role) => {
    const profile: Profile = {
      id: `guest-${role.toLowerCase()}`,
      role,
      fullName: GUEST_NAMES[role],
      email: "demo@lenny-fourniture.app",
      createdAt: new Date().toISOString(),
    };

    if (role === "PARENT") {
      useChildStore.getState().setChildren([
        {
          id: "demo-child-1",
          parentId: profile.id,
          firstName: "Emma",
          lastName: "Démo",
          birthDate: "2016-03-12",
          level: "CM1",
          className: "CM1-B",
          schoolId: "demo-school",
          schoolYear: "2026-2027",
        },
      ]);
    }

    set({ profile, isAuthenticated: true, isGuest: true, isLoading: false });
  },

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
    if (get().isGuest) {
      useChildStore.getState().setChildren([]);
      set({ profile: null, isAuthenticated: false, isGuest: false });
      return;
    }
    await supabase.auth.signOut();
    set({ profile: null, isAuthenticated: false });
  },
}));
