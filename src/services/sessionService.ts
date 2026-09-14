import { supabase } from "@/services/supabase";
import { cacheService } from "@/services/cacheService";
import type { Profile } from "@/types";

const PROFILE_CACHE_KEY = "profile";

export const sessionService = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, email, avatar_url, created_at")
      .eq("id", userId)
      .single();

    if (error || !data) {
      return cacheService.get<Profile>(PROFILE_CACHE_KEY);
    }

    const profile: Profile = {
      id: data.id,
      role: data.role,
      fullName: data.full_name,
      email: data.email,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
    };

    await cacheService.set(PROFILE_CACHE_KEY, profile);
    return profile;
  },

  async getCachedProfile(): Promise<Profile | null> {
    return cacheService.get<Profile>(PROFILE_CACHE_KEY);
  },

  async clear(): Promise<void> {
    await cacheService.remove(PROFILE_CACHE_KEY);
  },
};
