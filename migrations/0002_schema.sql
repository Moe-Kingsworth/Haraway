-- Aso Terrace — company workspace, people, and estate operations.

create table if not exists workspaces (
  user_id text primary key,
  company_name text not null default 'Aso Terrace',
  tagline text not null default 'Estate operations, Abuja',
  address text not null default 'Plot 42, Aminu Kano Crescent, Wuse II, Abuja, FCT',
  phone text not null default '+234 9 461 2200',
  email text not null default 'ops@asoterrace.ng',
  rc_number text not null default 'RC 1847291',
  seeded_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists staff (
  id serial primary key,
  user_id text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  role text not null,
  department text not null,
  employment_type text not null default 'Full-time',
  salary_ngn integer not null,
  hire_date date not null,
  status text not null default 'active',
  is_owner boolean not null default false,
  bank_name text,
  account_number text,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists staff_user_id_idx on staff (user_id);

create table if not exists memberships (
  user_id text primary key,
  company_owner_id text not null,
  staff_id integer references staff(id) on delete set null,
  role text not null default 'admin'
);
create index if not exists memberships_owner_idx on memberships (company_owner_id);

create table if not exists attendance (
  id serial primary key,
  user_id text not null,
  staff_id integer not null references staff(id) on delete cascade,
  work_date date not null,
  clock_in timestamptz,
  clock_out timestamptz,
  status text not null,
  notes text,
  unique (staff_id, work_date)
);
create index if not exists attendance_user_id_idx on attendance (user_id);
create index if not exists attendance_staff_date_idx on attendance (staff_id, work_date);

create table if not exists leave_requests (
  id serial primary key,
  user_id text not null,
  staff_id integer not null references staff(id) on delete cascade,
  leave_type text not null,
  start_date date not null,
  end_date date not null,
  status text not null default 'pending',
  reason text,
  created_at timestamptz not null default now()
);
create index if not exists leave_user_id_idx on leave_requests (user_id);

create table if not exists payroll_runs (
  id serial primary key,
  user_id text not null,
  period_year integer not null,
  period_month integer not null,
  status text not null default 'draft',
  processed_at timestamptz,
  unique (user_id, period_year, period_month)
);
create index if not exists payroll_runs_user_id_idx on payroll_runs (user_id);

create table if not exists payslips (
  id serial primary key,
  user_id text not null,
  run_id integer not null references payroll_runs(id) on delete cascade,
  staff_id integer not null references staff(id) on delete cascade,
  basic_ngn integer not null,
  allowance_ngn integer not null,
  deduction_ngn integer not null,
  net_ngn integer not null,
  unique (run_id, staff_id)
);
create index if not exists payslips_user_id_idx on payslips (user_id);

create table if not exists tasks (
  id serial primary key,
  user_id text not null,
  title text not null,
  description text,
  staff_id integer references staff(id) on delete set null,
  client_id integer,
  property_id integer,
  priority text not null default 'medium',
  status text not null default 'todo',
  due_date date,
  created_at timestamptz not null default now()
);
create index if not exists tasks_user_id_idx on tasks (user_id);

create table if not exists performance_reviews (
  id serial primary key,
  user_id text not null,
  staff_id integer not null references staff(id) on delete cascade,
  period_label text not null,
  deals_closed integer not null default 0,
  listings_won integer not null default 0,
  attendance_score integer not null default 0,
  client_score integer not null default 0,
  overall_score integer not null default 0,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists performance_user_id_idx on performance_reviews (user_id);

create table if not exists clients (
  id serial primary key,
  user_id text not null,
  full_name text not null,
  email text,
  phone text not null,
  type text not null,
  stage text not null,
  source text,
  assigned_staff_id integer references staff(id) on delete set null,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists clients_user_id_idx on clients (user_id);

create table if not exists properties (
  id serial primary key,
  user_id text not null,
  title text not null,
  district text not null,
  address text not null,
  type text not null,
  status text not null,
  bedrooms integer,
  bathrooms integer,
  size_sqm integer,
  price_ngn bigint not null,
  description text,
  created_at timestamptz not null default now()
);
create index if not exists properties_user_id_idx on properties (user_id);

create table if not exists deals (
  id serial primary key,
  user_id text not null,
  reference text not null,
  client_id integer not null references clients(id) on delete restrict,
  property_id integer not null references properties(id) on delete restrict,
  staff_id integer references staff(id) on delete set null,
  kind text not null,
  offer_ngn bigint not null,
  status text not null,
  payment_plan text,
  issued_at date,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists deals_user_id_idx on deals (user_id);

create table if not exists payments (
  id serial primary key,
  user_id text not null,
  receipt_no text not null,
  deal_id integer references deals(id) on delete set null,
  client_id integer not null references clients(id) on delete restrict,
  amount_ngn bigint not null,
  method text not null,
  paid_at date not null,
  narration text,
  created_at timestamptz not null default now()
);
create index if not exists payments_user_id_idx on payments (user_id);
