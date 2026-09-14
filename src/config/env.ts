const required = (value: string | undefined, name: string): string => {
  if (!value) {
    if (__DEV__) {
      console.warn(`[env] ${name} manquant - vérifie ton fichier .env`);
      return "";
    }
    throw new Error(`Variable d'environnement manquante: ${name}`);
  }
  return value;
};

export const env = {
  supabaseUrl: required(
    process.env.EXPO_PUBLIC_SUPABASE_URL,
    "EXPO_PUBLIC_SUPABASE_URL"
  ),
  supabaseAnonKey: required(
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    "EXPO_PUBLIC_SUPABASE_ANON_KEY"
  ),
  aiProvider: process.env.EXPO_PUBLIC_AI_PROVIDER ?? "",
};

export const isSupabaseConfigured = Boolean(
  env.supabaseUrl && env.supabaseAnonKey
);
