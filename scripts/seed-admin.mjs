import pg from "pg";
import { createClient } from "@supabase/supabase-js";

try {
  process.loadEnvFile?.();
} catch {}

const supabaseUrl = process.env.SUPABASE_URL || "https://educveznypnobejyaial.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

const email = "moekingsworth@gmail.com";
const fullName = "Moses Kingsworth";
const defaultPassword = "AchetuKingsworth@2119!";

// 1. Ensure user exists in Supabase Auth
let userId;
const { data: listData } = await supabaseAdmin.auth.admin.listUsers();
const existingUser = listData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

if (existingUser) {
  userId = existingUser.id;
  await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: defaultPassword,
    user_metadata: { full_name: fullName, name: fullName },
    email_confirm: true,
  });
  console.log(`Updated existing auth user: ${email} (${userId})`);
} else {
  const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: defaultPassword,
    email_confirm: true,
    user_metadata: { full_name: fullName, name: fullName },
  });
  if (createErr) throw createErr;
  userId = newUser.user.id;
  console.log(`Created new auth user: ${email} (${userId})`);
}

// 2. Ensure DB records in PostgreSQL
const client = new pg.Client({
  connectionString: "postgresql://postgres.educveznypnobejyaial:AchetuKingsworth%402119!@aws-1-eu-north-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
});
await client.connect();

// Workspace
await client.query(`
  insert into workspaces (user_id, company_name, tagline, address, phone, email, rc_number, seeded_at)
  values ($1, 'Eden Shelters', 'Estate operations, Abuja', 'F8, Melita Plaza, Gimbiya Street, Area 11 Garki FCT, Abuja', '+234 9 461 2200', 'ops@edenshelters.ng', 'RC 1847291', now())
  on conflict (user_id) do update set
    company_name = excluded.company_name,
    tagline = excluded.tagline,
    address = excluded.address;
`, [userId]);

// Staff
const staffRes = await client.query(`
  insert into staff (
    user_id, full_name, email, phone, role, department, employment_type,
    salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password
  ) values (
    $1, $2, $3, '+234 803 441 2201', 'super_admin', 'Executive', 'Full-time',
    1800000, '2019-03-01'::date, 'active', true, true, false
  )
  on conflict do nothing
  returning id;
`, [userId, fullName, email]);

let staffId = staffRes.rows[0]?.id;
if (!staffId) {
  const existingStaff = await client.query(
    "select id from staff where lower(email) = $1 limit 1",
    [email.toLowerCase()]
  );
  staffId = existingStaff.rows[0]?.id;
  await client.query(`
    update staff set
      role = 'super_admin',
      is_founder_account = true,
      must_change_password = false,
      status = 'active',
      full_name = $2
    where id = $1
  `, [staffId, fullName]);
}

// Membership
await client.query(`
  insert into memberships (user_id, company_owner_id, staff_id, role)
  values ($1, $1, $2, 'super_admin')
  on conflict (user_id) do update set
    staff_id = excluded.staff_id,
    role = excluded.role;
`, [userId, staffId]);

console.log(`Seeded Super Admin staff id: ${staffId}`);
await client.end();
console.log("Seeding complete!");
