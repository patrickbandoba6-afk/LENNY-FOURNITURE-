import type { UserRole } from './roles';

export type ID = string;

export interface Profile {
  id: ID;
  role: UserRole;
  full_name: string | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  country: string | null;
  locale: 'fr' | 'en';
  currency: string;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: ID;
  parent_id: ID;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  class_id: ID | null;
  school_id: ID | null;
  school_year: string | null;
  photo_url: string | null;
  created_at: string;
}

export interface School {
  id: ID;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  country: string | null;
  created_at: string;
}

export type HomeworkStatus = 'TODO' | 'IN_PROGRESS' | 'DONE' | 'LATE';

export interface Homework {
  id: ID;
  class_id: ID;
  subject_id: ID;
  title: string;
  description: string | null;
  due_date: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  created_by: ID;
  created_at: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Product {
  id: ID;
  seller_id: ID;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  stock: number;
  sku: string | null;
  category_id: ID | null;
  brand: string | null;
  created_at: string;
}

export interface Order {
  id: ID;
  parent_id: ID;
  status: OrderStatus;
  total: number;
  currency: string;
  created_at: string;
}
