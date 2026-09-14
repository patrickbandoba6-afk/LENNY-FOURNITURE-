const required = (
  value: string | undefined,
  name: string,
  devFallback: string
): string => {
  if (!value) {
    if (__DEV__) {
      console.warn(`[env] ${name} manquant - vérifie ton fichier .env`);
      return devFallback;
    }
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
};

export const isSupabaseConfigured = Boolean(
  process.env.EXPO_PUBLIC_SUPABASE_URL &&
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
);

export const env = {
  supabaseUrl: required(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    "EXPO_PUBLIC_SUPABASE_URL",
    "https://placeholder.supabase.co"
  ),
  supabaseAnonKey: required(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    "EXPO_PUBLIC_SUPABASE_ANON_KEY",
    "placeholder-anon-key"
  ),
  aiProvider: process.env.EXPO_PUBLIC_AI_PROVIDER ?? "",
};
