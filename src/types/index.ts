export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "PARENT"
  | "STUDENT"
  | "TEACHER"
  | "SCHOOL_ADMIN"
  | "SELLER"
  | "DELIVERY_AGENT";

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface ChildProfile {
  id: string;
  parentId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  photoUrl?: string | null;
  level: string;
  className: string;
  schoolId: string;
  schoolYear: string;
}

export type HomeworkStatus = "A_FAIRE" | "EN_COURS" | "TERMINE" | "EN_RETARD";

export interface Homework {
  id: string;
  childId: string;
  subject: string;
  title: string;
  description: string;
  dueDate: string;
  priority: "BASSE" | "NORMALE" | "HAUTE";
  status: HomeworkStatus;
  attachments?: string[];
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type AppLifecycleState =
  | "INITIALIZING"
  | "LOADING"
  | "READY"
  | "REFRESHING"
  | "OFFLINE"
  | "ERROR";
