-- SCHOOLONE — Phase 1 schema & RLS
-- Core tables for auth/profiles, school structure, academics, marketplace,
-- orders/payments/delivery, canteen/transport/activities, documents,
-- notifications, AI assistant, and audit. RLS is enabled on every table;
-- policies below cover the access rules explicitly called out in the spec
-- (a minor's data is never public, users only see their own role-scoped
-- data). Later phases will add write policies as each feature ships.

create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum (
  'SUPER_ADMIN', 'ADMIN', 'PARENT', 'STUDENT', 'TEACHER',
  'SCHOOL_ADMIN', 'SELLER', 'DELIVERY_AGENT'
);

create type homework_status as enum ('TODO', 'IN_PROGRESS', 'DONE', 'LATE');
create type homework_priority as enum ('LOW', 'MEDIUM', 'HIGH');
create type order_status as enum (
  'PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPED',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'REFUNDED'
);
create type delivery_mode as enum ('HOME', 'SCHOOL', 'RELAY_POINT', 'STORE_PICKUP', 'EXPRESS');

-- ============================================================
-- HELPERS
-- ============================================================
create function public.current_role() returns user_role
  language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create function public.is_admin() returns boolean
  language sql stable security definer set search_path = public as $$
  select coalesce(public.current_role() in ('ADMIN', 'SUPER_ADMIN'), false);
$$;

create function public.set_updated_at() returns trigger
  language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================
-- PROFILES & FAMILY
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  full_name text,
  avatar_url text,
  email text,
  phone text,
  country text,
  locale text not null default 'fr',
  currency text not null default 'EUR',
  timezone text not null default 'Europe/Paris',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  birth_date date,
  class_id uuid,
  school_id uuid,
  school_year text,
  photo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_children_updated_at before update on public.children
  for each row execute function public.set_updated_at();

-- ============================================================
-- SCHOOLS / CLASSES
-- ============================================================
create table public.schools (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id),
  name text not null,
  address text,
  phone text,
  email text,
  website text,
  description text,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_schools_updated_at before update on public.schools
  for each row execute function public.set_updated_at();

create table public.school_years (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  label text not null,
  starts_on date not null,
  ends_on date not null,
  created_at timestamptz not null default now()
);

create table public.classes (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  school_year_id uuid references public.school_years(id),
  name text not null,
  level text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_classes_updated_at before update on public.classes
  for each row execute function public.set_updated_at();

alter table public.children
  add constraint children_class_fk foreign key (class_id) references public.classes(id) on delete set null,
  add constraint children_school_fk foreign key (school_id) references public.schools(id) on delete set null;

create table public.class_students (
  class_id uuid not null references public.classes(id) on delete cascade,
  student_id uuid not null references public.children(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (class_id, student_id)
);

create table public.class_teachers (
  class_id uuid not null references public.classes(id) on delete cascade,
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (class_id, teacher_id)
);

-- ============================================================
-- ACADEMICS
-- ============================================================
create table public.subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table public.timetables (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id) on delete cascade,
  teacher_id uuid references public.profiles(id),
  weekday smallint not null check (weekday between 0 and 6),
  starts_at time not null,
  ends_at time not null,
  room text,
  created_at timestamptz not null default now()
);

create table public.homework (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  subject_id uuid not null references public.subjects(id),
  title text not null,
  description text,
  due_date timestamptz not null,
  priority homework_priority not null default 'MEDIUM',
  created_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_homework_updated_at before update on public.homework
  for each row execute function public.set_updated_at();

create table public.homework_submissions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework(id) on delete cascade,
  student_id uuid not null references public.children(id) on delete cascade,
  status homework_status not null default 'TODO',
  submitted_at timestamptz,
  attachment_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (homework_id, student_id)
);
create trigger trg_hw_submissions_updated_at before update on public.homework_submissions
  for each row execute function public.set_updated_at();

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.children(id) on delete cascade,
  subject_id uuid not null references public.subjects(id),
  value numeric(5, 2) not null,
  max_value numeric(5, 2) not null default 20,
  label text,
  graded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.report_cards (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.children(id) on delete cascade,
  school_year_id uuid references public.school_years(id),
  period text not null,
  file_url text,
  created_at timestamptz not null default now()
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid references public.classes(id),
  title text not null,
  body text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- SCHOOL SUPPLY LISTS
-- ============================================================
create table public.school_supply_lists (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid references public.classes(id),
  school_year text not null,
  title text not null,
  created_at timestamptz not null default now()
);

create table public.school_supply_list_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid not null references public.school_supply_lists(id) on delete cascade,
  product_name text not null,
  quantity integer not null default 1,
  format text,
  brand text,
  category text,
  product_id uuid,
  created_at timestamptz not null default now()
);

-- ============================================================
-- MARKETPLACE
-- ============================================================
create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  parent_id uuid references public.product_categories(id),
  created_at timestamptz not null default now()
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  currency text not null default 'EUR',
  stock integer not null default 0 check (stock >= 0),
  sku text,
  category_id uuid references public.product_categories(id),
  brand text,
  recommended_level text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create trigger trg_products_updated_at before update on public.products
  for each row execute function public.set_updated_at();

alter table public.school_supply_list_items
  add constraint supply_item_product_fk foreign key (product_id) references public.products(id) on delete set null;

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position smallint not null default 0
);

create table public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (product_id, author_id)
);

create table public.inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.books (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  isbn text,
  author text,
  publisher text
);

create table public.uniforms (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  school_id uuid references public.schools(id),
  size text
);

create table public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

create table public.search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  query text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CART / ORDERS / PAYMENTS / DELIVERY
-- ============================================================
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  label text,
  line1 text not null,
  line2 text,
  city text not null,
  postal_code text,
  country text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.carts (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_carts_updated_at before update on public.carts
  for each row execute function public.set_updated_at();

create table public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id),
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (cart_id, product_id)
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id),
  status order_status not null default 'PENDING',
  total numeric(10, 2) not null default 0,
  currency text not null default 'EUR',
  delivery_mode delivery_mode,
  address_id uuid references public.addresses(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_orders_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  seller_id uuid not null references public.profiles(id),
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null
);

create table public.order_status_history (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  status order_status not null,
  note text,
  created_at timestamptz not null default now()
);

create table public.delivery_agents (
  id uuid primary key references public.profiles(id) on delete cascade,
  vehicle text,
  is_active boolean not null default true
);

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  agent_id uuid references public.delivery_agents(id),
  status order_status not null default 'PENDING',
  eta timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_deliveries_updated_at before update on public.deliveries
  for each row execute function public.set_updated_at();

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null,
  provider_ref text,
  amount numeric(10, 2) not null,
  currency text not null default 'EUR',
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  file_url text,
  created_at timestamptz not null default now()
);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.payments(id) on delete cascade,
  amount numeric(10, 2) not null,
  reason text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- CANTEEN / TRANSPORT / ACTIVITIES
-- ============================================================
create table public.canteens (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null
);

create table public.canteen_menus (
  id uuid primary key default gen_random_uuid(),
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  served_on date not null,
  description text not null
);

create table public.canteen_reservations (
  id uuid primary key default gen_random_uuid(),
  canteen_id uuid not null references public.canteens(id) on delete cascade,
  student_id uuid not null references public.children(id) on delete cascade,
  menu_id uuid references public.canteen_menus(id),
  reserved_on date not null,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table public.school_transport (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  carrier_name text
);

create table public.transport_routes (
  id uuid primary key default gen_random_uuid(),
  transport_id uuid not null references public.school_transport(id) on delete cascade,
  name text not null
);

create table public.transport_stops (
  id uuid primary key default gen_random_uuid(),
  route_id uuid not null references public.transport_routes(id) on delete cascade,
  name text not null,
  scheduled_time time,
  position smallint not null default 0
);

create table public.activities (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid references public.profiles(id),
  name text not null,
  category text not null,
  city text,
  price numeric(10, 2),
  min_age smallint,
  max_age smallint,
  description text,
  created_at timestamptz not null default now()
);

create table public.activity_bookings (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references public.activities(id) on delete cascade,
  student_id uuid not null references public.children(id) on delete cascade,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

-- ============================================================
-- DOCUMENTS / NOTIFICATIONS / AI / AUDIT
-- ============================================================
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  student_id uuid references public.children(id) on delete cascade,
  kind text not null,
  file_url text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  created_at timestamptz not null default now()
);

create table public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity text not null,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
-- Enable RLS on every table (default deny until a policy grants access).
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables
    where schemaname = 'public'
      and tablename not like 'pg_%'
  loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;

-- Profiles: everyone can read their own row; admins read all; only the
-- owner (or an admin) can update it.
create policy profiles_select_own on public.profiles for select
  using (id = auth.uid() or public.is_admin());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid() or public.is_admin());
create policy profiles_insert_self on public.profiles for insert
  with check (id = auth.uid());

-- Children: never exposed publicly — only the parent, the teachers of the
-- child's class, the owning school admin, or an admin can read them.
create policy children_select on public.children for select
  using (
    parent_id = auth.uid()
    or public.is_admin()
    or exists (
      select 1 from public.class_teachers ct
      where ct.class_id = children.class_id and ct.teacher_id = auth.uid()
    )
    or exists (
      select 1 from public.schools s
      where s.id = children.school_id and s.owner_id = auth.uid()
    )
  );
create policy children_write on public.children for all
  using (parent_id = auth.uid() or public.is_admin())
  with check (parent_id = auth.uid() or public.is_admin());

-- Schools: public directory (read for all authenticated users), write
-- restricted to the owning school admin or an admin.
create policy schools_select_all on public.schools for select using (true);
create policy schools_write_owner on public.schools for all
  using (owner_id = auth.uid() or public.is_admin())
  with check (owner_id = auth.uid() or public.is_admin());

-- Homework / grades / report cards: visible to the student's parent, the
-- student's class teachers, and admins — never public.
create policy homework_select on public.homework for select
  using (
    public.is_admin()
    or exists (select 1 from public.class_teachers ct where ct.class_id = homework.class_id and ct.teacher_id = auth.uid())
    or exists (
      select 1 from public.class_students cs
      join public.children c on c.id = cs.student_id
      where cs.class_id = homework.class_id and c.parent_id = auth.uid()
    )
  );
create policy homework_write_teacher on public.homework for insert
  with check (created_by = auth.uid() or public.is_admin());
create policy homework_update_teacher on public.homework for update
  using (created_by = auth.uid() or public.is_admin());

create policy grades_select on public.grades for select
  using (
    public.is_admin()
    or exists (select 1 from public.children c where c.id = grades.student_id and c.parent_id = auth.uid())
    or graded_by = auth.uid()
  );
create policy grades_write_teacher on public.grades for insert
  with check (graded_by = auth.uid() or public.is_admin());

create policy report_cards_select on public.report_cards for select
  using (
    public.is_admin()
    or exists (select 1 from public.children c where c.id = report_cards.student_id and c.parent_id = auth.uid())
  );

-- Products / catalog: public read of active products; only the owning
-- seller (or admin) can write.
create policy products_select_active on public.products for select
  using (is_active or seller_id = auth.uid() or public.is_admin());
create policy products_write_owner on public.products for all
  using (seller_id = auth.uid() or public.is_admin())
  with check (seller_id = auth.uid() or public.is_admin());
create policy product_categories_select on public.product_categories for select using (true);

-- Carts / orders: strictly scoped to the owning parent; sellers can read
-- the order lines that belong to them; admins see everything.
create policy carts_owner on public.carts for all
  using (parent_id = auth.uid() or public.is_admin())
  with check (parent_id = auth.uid() or public.is_admin());
create policy cart_items_owner on public.cart_items for all
  using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and (c.parent_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.carts c where c.id = cart_items.cart_id and (c.parent_id = auth.uid() or public.is_admin())));

create policy orders_owner_select on public.orders for select
  using (
    parent_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.order_items oi where oi.order_id = orders.id and oi.seller_id = auth.uid())
  );
create policy orders_owner_write on public.orders for all
  using (parent_id = auth.uid() or public.is_admin())
  with check (parent_id = auth.uid() or public.is_admin());

create policy order_items_select on public.order_items for select
  using (
    seller_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.orders o where o.id = order_items.order_id and o.parent_id = auth.uid())
  );

-- Payments/invoices/refunds: only the paying parent and admins.
create policy payments_select on public.payments for select
  using (public.is_admin() or exists (select 1 from public.orders o where o.id = payments.order_id and o.parent_id = auth.uid()));
create policy invoices_select on public.invoices for select
  using (public.is_admin() or exists (select 1 from public.orders o where o.id = invoices.order_id and o.parent_id = auth.uid()));

-- Documents: strictly private to the owner (and the child's parent) plus admins.
create policy documents_owner on public.documents for all
  using (
    owner_id = auth.uid()
    or public.is_admin()
    or exists (select 1 from public.children c where c.id = documents.student_id and c.parent_id = auth.uid())
  )
  with check (owner_id = auth.uid() or public.is_admin());

-- Notifications: only the recipient.
create policy notifications_owner on public.notifications for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- AI conversations/messages: only the owning user.
create policy ai_conversations_owner on public.ai_conversations for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy ai_messages_owner on public.ai_messages for all
  using (exists (select 1 from public.ai_conversations c where c.id = ai_messages.conversation_id and (c.user_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.ai_conversations c where c.id = ai_messages.conversation_id and (c.user_id = auth.uid() or public.is_admin())));

-- Favorites / search history / addresses: private to the owning user.
create policy favorites_owner on public.favorites for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy search_history_owner on public.search_history for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());
create policy addresses_owner on public.addresses for all
  using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

-- Audit logs: admin-only, append via security-definer functions only in
-- later phases — no direct client writes.
create policy audit_logs_admin_read on public.audit_logs for select using (public.is_admin());

-- Announcements / activities / canteen menus / transport: readable by any
-- authenticated user (public info once published); writes land in later
-- phases behind role-specific policies.
create policy announcements_select on public.announcements for select using (true);
create policy activities_select on public.activities for select using (true);
create policy canteen_menus_select on public.canteen_menus for select using (true);
create policy transport_routes_select on public.transport_routes for select using (true);
create policy transport_stops_select on public.transport_stops for select using (true);

-- ============================================================
-- PROFILE BOOTSTRAP
-- ============================================================
-- Creates the profiles row automatically when a new auth user signs up,
-- defaulting to PARENT (the most common signup); other roles are granted
-- by an admin/school onboarding flow in a later phase.
create function public.handle_new_user() returns trigger
  language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'PARENT'),
    new.raw_user_meta_data ->> 'full_name',
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
