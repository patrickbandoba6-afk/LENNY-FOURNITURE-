import type { UserRole } from "@/types";

export const ROLE_HOME_ROUTE: Record<UserRole, string> = {
  SUPER_ADMIN: "/(admin)",
  ADMIN: "/(admin)",
  PARENT: "/(parent)",
  STUDENT: "/(student)",
  TEACHER: "/(teacher)",
  SCHOOL_ADMIN: "/(admin)",
  SELLER: "/(seller)",
  DELIVERY_AGENT: "/(seller)",
};
