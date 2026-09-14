import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFIX = "lenny-fourniture:cache:";

// Stratégie CACHE-FIRST : jamais de secrets/tokens ici, uniquement des
// données déjà publiques/affichables (profils, listes, dashboard...).
export const cacheService = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      // best-effort - le cache n'est jamais une source de vérité critique
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(PREFIX + key);
    } catch {
      // ignore
    }
  },

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const ours = keys.filter((k) => k.startsWith(PREFIX));
      await AsyncStorage.multiRemove(ours);
    } catch {
      // ignore
    }
  },
};
