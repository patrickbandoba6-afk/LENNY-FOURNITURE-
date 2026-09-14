import { useEffect, useState } from 'react';

import { authService } from '@/services/authService';
import { cacheService } from '@/services/cacheService';
import { useAppStore } from '@/store/appStore';
import type { Profile } from '@/types/database';

export function useProfile() {
  const userId = useAppStore((s) => s.userId);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!userId) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    cacheService.get<Profile>('profile', { scope: userId }).then((cached) => {
      if (!cancelled && cached) setProfile(cached.value);
    });

    authService
      .fetchProfile(userId)
      .then((fresh) => {
        if (cancelled || !fresh) return;
        setProfile(fresh);
        cacheService.set('profile', fresh, { scope: userId });
      })
      .catch(() => {
        // Offline or transient error: cached value (if any) already shown.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { profile, isLoading };
}
