import { sessionService } from "@/services/sessionService";
import { offlineService } from "@/services/offlineService";
import type { AppLifecycleState, Profile } from "@/types";

export interface StartupResult {
  state: AppLifecycleState;
  profile: Profile | null;
}

// Initialise l'app au lancement : réseau -> session -> profil (cache-first).
// Ne bloque jamais sur le réseau : si hors-ligne, on part du profil en cache.
export async function runStartup(): Promise<StartupResult> {
  const online = await offlineService.isOnline();

  if (!online) {
    const cached = await sessionService.getCachedProfile();
    return { state: "OFFLINE", profile: cached };
  }

  try {
    const profile = await sessionService.getCurrentProfile();
    return { state: "READY", profile };
  } catch {
    const cached = await sessionService.getCachedProfile();
    return { state: cached ? "OFFLINE" : "ERROR", profile: cached };
  }
}
