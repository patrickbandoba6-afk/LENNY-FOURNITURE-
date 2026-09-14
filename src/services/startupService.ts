import { authService } from '@/services/authService';
import { cacheService } from '@/services/cacheService';
import { offlineService } from '@/services/offlineService';
import { sessionService } from '@/services/sessionService';
import type { Child } from '@/types/database';
import { isUserRole, type UserRole } from '@/types/roles';

export type StartupOutcome =
  | { kind: 'UNAUTHENTICATED' }
  | { kind: 'READY'; userId: string; role: UserRole }
  | { kind: 'OFFLINE_READY'; userId: string; role: UserRole }
  | { kind: 'ERROR'; message: string };

/**
 * Runs the app boot sequence described in the product spec:
 * connectivity -> session -> profile -> permissions -> children -> config.
 * Cache-first: cached data is trusted immediately, network refreshes it in
 * the background via the callers that own each screen.
 */
async function run(): Promise<StartupOutcome> {
  try {
    const connectivity = await offlineService.getStatus();

    let session;
    try {
      session = await sessionService.getSession();
    } catch (error) {
      if (connectivity === 'OFFLINE') {
        session = null;
      } else {
        throw error;
      }
    }

    if (!session) {
      await cacheService.clearAll();
      return { kind: 'UNAUTHENTICATED' };
    }

    const userId = session.user.id;

    let profile = null;
    try {
      profile = await authService.fetchProfile(userId);
      if (profile) await cacheService.set('profile', profile, { scope: userId });
    } catch (error) {
      if (connectivity === 'OFFLINE') {
        const cached = await cacheService.get<typeof profile>('profile', { scope: userId });
        profile = cached?.value ?? null;
      } else {
        throw error;
      }
    }

    if (!profile || !isUserRole(profile.role)) {
      return { kind: 'ERROR', message: 'Profil introuvable ou rôle invalide.' };
    }

    if (profile.role === 'PARENT') {
      await loadChildren(userId, connectivity);
    }

    return connectivity === 'OFFLINE'
      ? { kind: 'OFFLINE_READY', userId, role: profile.role }
      : { kind: 'READY', userId, role: profile.role };
  } catch (error) {
    return { kind: 'ERROR', message: error instanceof Error ? error.message : 'Erreur inconnue.' };
  }
}

async function loadChildren(parentId: string, connectivity: Awaited<ReturnType<typeof offlineService.getStatus>>) {
  const { supabase } = await import('@/lib/supabase');
  try {
    const { data, error } = await supabase.from('children').select('*').eq('parent_id', parentId);
    if (error) throw error;
    await cacheService.set<Child[]>('children', (data ?? []) as Child[], { scope: parentId });
  } catch {
    if (connectivity !== 'OFFLINE') {
      // Non-fatal: children list will retry from the parent dashboard.
    }
  }
}

export const startupService = { run };
