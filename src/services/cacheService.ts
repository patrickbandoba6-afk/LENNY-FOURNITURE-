import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic, non-sensitive cache. Never store auth tokens or secrets here —
 * use SecureStore (see src/lib/supabase.ts) for those.
 */
const CACHE_PREFIX = 'schoolone:cache:';

export type CacheKey =
  | 'profile'
  | 'children'
  | 'active_child_id'
  | 'school'
  | 'classes'
  | 'timetable'
  | 'homework_recent'
  | 'notifications'
  | 'categories'
  | 'recent_products'
  | 'cart'
  | 'preferences'
  | 'app_config';

interface CacheEnvelope<T> {
  value: T;
  cachedAt: number;
  ttlMs: number | null;
}

function keyFor(key: CacheKey, scope?: string): string {
  return `${CACHE_PREFIX}${scope ? `${scope}:` : ''}${key}`;
}

async function set<T>(key: CacheKey, value: T, options?: { scope?: string; ttlMs?: number }): Promise<void> {
  const envelope: CacheEnvelope<T> = {
    value,
    cachedAt: Date.now(),
    ttlMs: options?.ttlMs ?? null,
  };
  await AsyncStorage.setItem(keyFor(key, options?.scope), JSON.stringify(envelope));
}

async function get<T>(key: CacheKey, options?: { scope?: string }): Promise<{ value: T; isStale: boolean } | null> {
  const raw = await AsyncStorage.getItem(keyFor(key, options?.scope));
  if (!raw) return null;

  try {
    const envelope = JSON.parse(raw) as CacheEnvelope<T>;
    const isStale = envelope.ttlMs != null && Date.now() - envelope.cachedAt > envelope.ttlMs;
    return { value: envelope.value, isStale };
  } catch {
    return null;
  }
}

async function remove(key: CacheKey, options?: { scope?: string }): Promise<void> {
  await AsyncStorage.removeItem(keyFor(key, options?.scope));
}

async function clearAll(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
  if (cacheKeys.length) await AsyncStorage.multiRemove(cacheKeys);
}

export const cacheService = { get, set, remove, clearAll };
