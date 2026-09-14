import { useAppStore } from '@/store/appStore';
import { ROLE_HOME_ROUTE, type UserRole } from '@/types/roles';

type GuardResult =
  | { state: 'LOADING' }
  | { state: 'UNAUTHENTICATED' }
  | { state: 'WRONG_ROLE'; redirectTo: string }
  | { state: 'ALLOWED' };

/**
 * Route groups are role-scoped in the UI, but this is a UX convenience only
 * — the real access boundary is Supabase RLS (see supabase/migrations).
 */
export function useRoleGuard(allowedRoles: UserRole[]): GuardResult {
  const status = useAppStore((s) => s.status);
  const userId = useAppStore((s) => s.userId);
  const role = useAppStore((s) => s.role);

  if (status === 'INITIALIZING' || status === 'LOADING') return { state: 'LOADING' };
  if (!userId || !role) return { state: 'UNAUTHENTICATED' };
  if (!allowedRoles.includes(role)) return { state: 'WRONG_ROLE', redirectTo: ROLE_HOME_ROUTE[role] };
  return { state: 'ALLOWED' };
}
