export const USER_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'PARENT',
  'STUDENT',
  'TEACHER',
  'SCHOOL_ADMIN',
  'SELLER',
  'DELIVERY_AGENT',
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  SUPER_ADMIN: '/(admin)',
  ADMIN: '/(admin)',
  PARENT: '/(parent)',
  STUDENT: '/(student)',
  TEACHER: '/(teacher)',
  SCHOOL_ADMIN: '/(school)',
  SELLER: '/(seller)',
  DELIVERY_AGENT: '/(delivery)',
};

export function isUserRole(value: string | null | undefined): value is UserRole {
  return !!value && (USER_ROLES as readonly string[]).includes(value);
}
