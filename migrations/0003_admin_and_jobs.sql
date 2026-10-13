-- Eden Shelters — Super Admin Dashboard, User Management, Audit Log, and Job Applications

-- 1. Extend staff table with employee_id and position
alter table staff add column if not exists employee_id text;
alter table staff add column if not exists position text;

update staff set employee_id = 'ES-' || lpad(id::text, 4, '0') where employee_id is null;
update staff set position = case
  when role = 'super_admin' then 'Managing Director'
  when role = 'executive' then 'Executive Director'
  when role = 'hr_admin' then 'HR Manager'
  when role = 'finance' then 'Finance Lead'
  when role = 'team_lead' and department = 'Sales' then 'Head of Sales'
  when role = 'team_lead' and department = 'Operations' then 'Operations Manager'
  when role = 'secretary' then 'Executive Secretary'
  else 'Associate'
end where position is null;

-- 2. Audit Log table
create table if not exists audit_log (
  id serial primary key,
  actor_name text not null,
  action text not null,
  target text not null,
  timestamp timestamptz not null default now(),
  details jsonb default '{}'::jsonb
);
create index if not exists audit_log_timestamp_idx on audit_log (timestamp desc);
create index if not exists audit_log_action_idx on audit_log (action);

-- 3. Job Postings table
create table if not exists job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  employment_type text not null default 'Full-time',
  location text default 'Abuja, Nigeria',
  description text,
  requirements text,
  responsibilities text,
  status text default 'draft',
  created_by integer references staff(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists job_postings_status_idx on job_postings (status);
create index if not exists job_postings_created_at_idx on job_postings (created_at desc);

-- 4. Job Applications table
create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  job_posting_id uuid references job_postings(id) on delete cascade,
  full_name text not null,
  email text not null,
  phone text not null,
  years_experience int default 0,
  current_job_title text,
  cover_letter text,
  cv_url text,
  linkedin_url text,
  portfolio_url text,
  referral_source text,
  status text default 'applied',
  internal_notes text,
  interview_date timestamptz,
  interview_format text,
  rejection_reason text,
  converted_to_staff_id integer references staff(id) on delete set null,
  created_at timestamptz default now()
);
create index if not exists job_applications_job_posting_idx on job_applications (job_posting_id);
create index if not exists job_applications_status_idx on job_applications (status);
create index if not exists job_applications_created_at_idx on job_applications (created_at desc);

-- 5. Enable Supabase Realtime publication if available
do $$
begin
  alter publication supabase_realtime add table attendance;
exception when others then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table audit_log;
exception when others then null;
end $$;

-- 6. Storage bucket for CVs if storage schema exists
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('cvs', 'cvs', true)
  on conflict (id) do nothing;
exception when others then null;
end $$;
