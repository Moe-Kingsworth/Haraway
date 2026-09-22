import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql, type Sql } from "@/lib/db";
import { asNumber, todayWAT } from "@/lib/format";
import type { Access, MemberRole, Staff, Workspace } from "@/lib/types";

type UserRow = { id: string; name: string | null; email: string | null };

export function num(v: unknown): number {
  return asNumber(v);
}

export function dateStr(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "").slice(0, 10);
}

export function tsStr(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function workspaceFrom(row: {
  user_id: string;
  company_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  rc_number: string;
}): Workspace {
  return {
    userId: row.user_id,
    companyName: row.company_name,
    tagline: row.tagline,
    address: row.address,
    phone: row.phone,
    email: row.email,
    rcNumber: row.rc_number,
  };
}

export function mapStaff(row: {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employment_type: string;
  salary_ngn: number;
  hire_date: unknown;
  status: string;
  is_owner: boolean;
  bank_name: string | null;
  account_number: string | null;
  notes: string | null;
}): Staff {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    department: row.department,
    employmentType: row.employment_type,
    salaryNgn: num(row.salary_ngn),
    hireDate: dateStr(row.hire_date),
    status: row.status,
    isOwner: Boolean(row.is_owner),
    bankName: row.bank_name,
    accountNumber: row.account_number,
    notes: row.notes,
  };
}

async function loadUser(sql: Sql, userId: string): Promise<UserRow> {
  const rows = await sql<UserRow>`
    select "id", "name", "email" from "user" where "id" = ${userId}
  `;
  return rows[0] ?? { id: userId, name: "Managing Director", email: "md@asoterrace.ng" };
}

async function loadWorkspace(sql: Sql, ownerId: string): Promise<Workspace | null> {
  const rows = await sql<{
    user_id: string;
    company_name: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    rc_number: string;
  }>`select user_id, company_name, tagline, address, phone, email, rc_number from workspaces where user_id = ${ownerId}`;
  return rows[0] ? workspaceFrom(rows[0]) : null;
}

export async function resolveAccess(userId: string): Promise<Access> {
  const sql = await getSql();
  const profile = await loadUser(sql, userId);

  const existing = await sql<{
    user_id: string;
    company_owner_id: string;
    staff_id: number | null;
    role: string;
  }>`select user_id, company_owner_id, staff_id, role from memberships where user_id = ${userId}`;

  if (existing[0]) {
    const m = existing[0];
    const workspace = (await loadWorkspace(sql, m.company_owner_id)) ?? {
      userId: m.company_owner_id,
      companyName: "Aso Terrace",
      tagline: "Estate operations, Abuja",
      address: "Plot 42, Aminu Kano Crescent, Wuse II, Abuja, FCT",
      phone: "+234 9 461 2200",
      email: "ops@asoterrace.ng",
      rcNumber: "RC 1847291",
    };
    return {
      userId,
      ownerId: m.company_owner_id,
      role: m.role === "staff" ? "staff" : "admin",
      staffId: m.staff_id,
      displayName: profile.name ?? "Colleague",
      email: profile.email ?? "",
      workspace,
    };
  }

  const email = (profile.email ?? "").trim().toLowerCase();
  if (email) {
    const match = await sql<{ id: number; user_id: string }>`
      select id, user_id from staff where lower(email) = ${email} limit 1
    `;
    if (match[0] && match[0].user_id !== userId) {
      await sql`
        insert into memberships (user_id, company_owner_id, staff_id, role)
        values (${userId}, ${match[0].user_id}, ${match[0].id}, ${"staff"})
      `;
      const workspace = (await loadWorkspace(sql, match[0].user_id))!;
      return {
        userId,
        ownerId: match[0].user_id,
        role: "staff",
        staffId: match[0].id,
        displayName: profile.name ?? "Colleague",
        email: profile.email ?? "",
        workspace,
      };
    }
  }

  await seedWorkspace(sql, userId, profile);
  const workspace = (await loadWorkspace(sql, userId))!;
  const ownerStaff = await sql<{ id: number }>`
    select id from staff where user_id = ${userId} and is_owner = true limit 1
  `;
  return {
    userId,
    ownerId: userId,
    role: "admin",
    staffId: ownerStaff[0]?.id ?? null,
    displayName: profile.name ?? "Managing Director",
    email: profile.email ?? "",
    workspace,
  };
}

export function assertAdmin(access: Access): void {
  if (access.role !== "admin") {
    throw new Error("Only the operations desk can do that.");
  }
}

export const updateWorkspace = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    companyName: string;
    tagline: string;
    address: string;
    phone: string;
    email: string;
    rcNumber: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    const companyName = data.companyName.trim();
    if (!companyName) throw new Error("The firm needs a name.");
    await sql`
      update workspaces set
        company_name = ${companyName},
        tagline = ${data.tagline.trim()},
        address = ${data.address.trim()},
        phone = ${data.phone.trim()},
        email = ${data.email.trim()},
        rc_number = ${data.rcNumber.trim()}
      where user_id = ${access.ownerId}
    `;
    return { ok: true };
  });


const seedLocks = new Map<string, Promise<void>>();

function tagFrom(userId: string): string {
  return userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toLowerCase() || "desk";
}

function weekdaysBetween(from: string, to: string): string[] {
  const out: string[] = [];
  const cur = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  while (cur <= end) {
    const day = cur.getUTCDay();
    if (day !== 0 && day !== 6) out.push(cur.toISOString().slice(0, 10));
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return out;
}

async function insertAttendanceRows(
  sql: Sql,
  userId: string,
  rows: Array<{
    staffId: number;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    status: string;
  }>,
): Promise<void> {
  const chunkSize = 80;
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const params: unknown[] = [];
    const values = chunk.map((row, idx) => {
      const b = idx * 6;
      params.push(userId, row.staffId, row.date, row.clockIn, row.clockOut, row.status);
      return `($${b + 1}, $${b + 2}, $${b + 3}::date, $${b + 4}::timestamptz, $${b + 5}::timestamptz, $${b + 6})`;
    });
    await sql.query(
      `insert into attendance (user_id, staff_id, work_date, clock_in, clock_out, status) values ${values.join(",")}`,
      params,
    );
  }
}

async function seedWorkspace(sql: Sql, userId: string, profile: UserRow): Promise<void> {
  const pending = seedLocks.get(userId);
  if (pending) {
    await pending;
    return;
  }

  const run = seedWorkspaceInner(sql, userId, profile);
  seedLocks.set(userId, run);
  try {
    await run;
  } finally {
    seedLocks.delete(userId);
  }
}

async function seedWorkspaceInner(sql: Sql, userId: string, profile: UserRow): Promise<void> {
  const already = await sql<{ seeded_at: string | null }>`
    select seeded_at from workspaces where user_id = ${userId}
  `;
  if (already[0]?.seeded_at) {
    const mem = await sql`select user_id from memberships where user_id = ${userId}`;
    if (mem[0]) return;
  }

  await sql`delete from payments where user_id = ${userId}`;
  await sql`delete from deals where user_id = ${userId}`;
  await sql`delete from tasks where user_id = ${userId}`;
  await sql`delete from performance_reviews where user_id = ${userId}`;
  await sql`delete from payslips where user_id = ${userId}`;
  await sql`delete from payroll_runs where user_id = ${userId}`;
  await sql`delete from leave_requests where user_id = ${userId}`;
  await sql`delete from attendance where user_id = ${userId}`;
  await sql`delete from properties where user_id = ${userId}`;
  await sql`delete from clients where user_id = ${userId}`;
  await sql`delete from memberships where company_owner_id = ${userId}`;
  await sql`delete from staff where user_id = ${userId}`;
  await sql`delete from workspaces where user_id = ${userId}`;

  await sql`
    insert into workspaces (user_id, company_name, tagline, address, phone, email, rc_number)
    values (
      ${userId},
      ${"Aso Terrace"},
      ${"Estate operations, Abuja"},
      ${"Plot 42, Aminu Kano Crescent, Wuse II, Abuja, FCT"},
      ${"+234 9 461 2200"},
      ${"ops@asoterrace.ng"},
      ${"RC 1847291"}
    )
  `;

  const tag = tagFrom(userId);
  const ownerName = profile.name?.trim() || "Ibrahim Abdullahi";
  const ownerEmail = profile.email?.trim() || `md.${tag}@asoterrace.ng`;

  const people: Array<{
    name: string;
    email: string;
    phone: string;
    role: string;
    dept: string;
    salary: number;
    hire: string;
    owner: boolean;
    bank: string;
    acct: string;
  }> = [
    {
      name: ownerName,
      email: ownerEmail,
      phone: "+234 803 441 2201",
      role: "Managing Director",
      dept: "Leadership",
      salary: 1_800_000,
      hire: "2019-03-01",
      owner: true,
      bank: "GTBank",
      acct: "0148823310",
    },
    {
      name: "Chinedu Okonkwo",
      email: `chinedu.${tag}@asoterrace.ng`,
      phone: "+234 809 112 4482",
      role: "Principal Agent",
      dept: "Sales",
      salary: 850_000,
      hire: "2021-06-14",
      owner: false,
      bank: "Access Bank",
      acct: "0771928461",
    },
    {
      name: "Aisha Bello",
      email: `aisha.${tag}@asoterrace.ng`,
      phone: "+234 701 334 9088",
      role: "Senior Agent",
      dept: "Sales",
      salary: 720_000,
      hire: "2022-02-07",
      owner: false,
      bank: "Zenith Bank",
      acct: "2219087743",
    },
    {
      name: "Tunde Adeyemi",
      email: `tunde.${tag}@asoterrace.ng`,
      phone: "+234 802 665 1190",
      role: "Legal Counsel",
      dept: "Legal",
      salary: 950_000,
      hire: "2020-11-02",
      owner: false,
      bank: "UBA",
      acct: "1004482916",
    },
    {
      name: "Ngozi Eze",
      email: `ngozi.${tag}@asoterrace.ng`,
      phone: "+234 803 778 2204",
      role: "Head of Finance",
      dept: "Finance",
      salary: 900_000,
      hire: "2020-04-20",
      owner: false,
      bank: "First Bank",
      acct: "3091182745",
    },
    {
      name: "Ibrahim Suleiman",
      email: `ibrahim.${tag}@asoterrace.ng`,
      phone: "+234 706 441 8832",
      role: "Facilities Lead",
      dept: "Operations",
      salary: 580_000,
      hire: "2023-01-16",
      owner: false,
      bank: "GTBank",
      acct: "0261193847",
    },
    {
      name: "Folake Adewale",
      email: `folake.${tag}@asoterrace.ng`,
      phone: "+234 805 992 1107",
      role: "Client Relations",
      dept: "Sales",
      salary: 640_000,
      hire: "2023-08-01",
      owner: false,
      bank: "Stanbic IBTC",
      acct: "0038912271",
    },
    {
      name: "Yusuf Dantata",
      email: `yusuf.${tag}@asoterrace.ng`,
      phone: "+234 809 221 6674",
      role: "Land Surveyor",
      dept: "Operations",
      salary: 700_000,
      hire: "2022-09-12",
      owner: false,
      bank: "Access Bank",
      acct: "0693318490",
    },
  ];

  const staffIds: number[] = [];
  for (const p of people) {
    const inserted = await sql<{ id: number }>`
      insert into staff (
        user_id, full_name, email, phone, role, department, employment_type,
        salary_ngn, hire_date, status, is_owner, bank_name, account_number
      ) values (
        ${userId}, ${p.name}, ${p.email}, ${p.phone}, ${p.role}, ${p.dept}, ${"Full-time"},
        ${p.salary}, ${p.hire}::date, ${"active"}, ${p.owner}, ${p.bank}, ${p.acct}
      ) returning id
    `;
    staffIds.push(inserted[0]!.id);
  }

  const ownerStaffId = staffIds[0]!;
  await sql`
    insert into memberships (user_id, company_owner_id, staff_id, role)
    values (${userId}, ${userId}, ${ownerStaffId}, ${"admin"})
  `;

  const today = todayWAT();
  const yesterday = (() => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  })();
  const days = weekdaysBetween("2026-08-03", yesterday);
  const attendanceRows: Array<{
    staffId: number;
    date: string;
    clockIn: string | null;
    clockOut: string | null;
    status: string;
  }> = [];

  for (let i = 0; i < staffIds.length; i++) {
    const sid = staffIds[i]!;
    for (let d = 0; d < days.length; d++) {
      const date = days[d]!;
      const roll = (i * 7 + d * 3) % 11;
      let status = "present";
      let hour = 7 + ((i + d) % 2);
      let minute = 10 + ((i * 13 + d * 7) % 45);
      if (roll === 0) {
        status = "late";
        hour = 9;
        minute = 12 + (d % 20);
      } else if (roll === 1 && d % 9 === 0) {
        status = "remote";
        hour = 8;
        minute = 5;
      } else if (roll === 2 && d % 13 === 0) {
        status = "leave";
      } else if (roll === 3 && d % 17 === 0) {
        status = "absent";
      }
      const clockIn =
        status === "absent" || status === "leave"
          ? null
          : `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+01:00`;
      const outHour = 17 + ((i + d) % 2);
      const clockOut =
        clockIn && status !== "leave"
          ? `${date}T${String(outHour).padStart(2, "0")}:${String(20 + (d % 25)).padStart(2, "0")}:00+01:00`
          : null;
      attendanceRows.push({ staffId: sid, date, clockIn, clockOut, status });
    }
  }
  await insertAttendanceRows(sql, userId, attendanceRows);

  await sql`
    insert into leave_requests (user_id, staff_id, leave_type, start_date, end_date, status, reason)
    values
      (${userId}, ${staffIds[5]!}, ${"annual"}, ${"2026-09-14"}::date, ${"2026-09-18"}::date, ${"pending"}, ${"Family visit to Kaduna"}),
      (${userId}, ${staffIds[2]!}, ${"sick"}, ${"2026-08-21"}::date, ${"2026-08-22"}::date, ${"approved"}, ${"Malaria recovery"}),
      (${userId}, ${staffIds[6]!}, ${"casual"}, ${"2026-09-10"}::date, ${"2026-09-10"}::date, ${"pending"}, ${"School run — parents meeting"})
  `;

  const aug = await sql<{ id: number }>`
    insert into payroll_runs (user_id, period_year, period_month, status, processed_at)
    values (${userId}, ${2026}, ${8}, ${"paid"}, ${"2026-08-28T10:00:00+01:00"})
    returning id
  `;
  for (let i = 0; i < people.length; i++) {
    const p = people[i]!;
    const basic = p.salary;
    const allowance = Math.round(basic * 0.2);
    const deduction = Math.round(basic * 0.08);
    const net = basic + allowance - deduction;
    await sql`
      insert into payslips (user_id, run_id, staff_id, basic_ngn, allowance_ngn, deduction_ngn, net_ngn)
      values (${userId}, ${aug[0]!.id}, ${staffIds[i]!}, ${basic}, ${allowance}, ${deduction}, ${net})
    `;
  }

  const reviews: Array<[number, string, number, number, number, number, number, string]> = [
    [0, "Q2 2026", 4, 6, 96, 91, 93, "Steady leadership of the Guzape and Maitama closings."],
    [1, "Q2 2026", 6, 9, 94, 88, 91, "Top originator. Watch follow-up speed on Jahi leads."],
    [2, "Q2 2026", 5, 7, 90, 92, 90, "Strong with family buyers in Life Camp and Gwarinpa."],
    [3, "Q2 2026", 0, 0, 98, 95, 94, "Clean title packs. No failed searches this quarter."],
    [4, "Q2 2026", 0, 0, 97, 90, 92, "Collections discipline held. Receipts issued same day."],
    [5, "Q2 2026", 0, 0, 88, 86, 86, "Site reports lag on Fridays. Tighten the log."],
    [6, "Q2 2026", 3, 5, 93, 94, 93, "Clients stay because she calls after every viewing."],
    [7, "Q2 2026", 0, 2, 91, 87, 88, "Survey plans now land within four working days."],
  ];
  for (const r of reviews) {
    await sql`
      insert into performance_reviews (
        user_id, staff_id, period_label, deals_closed, listings_won,
        attendance_score, client_score, overall_score, notes
      ) values (
        ${userId}, ${staffIds[r[0]]!}, ${r[1]}, ${r[2]}, ${r[3]}, ${r[4]}, ${r[5]}, ${r[6]}, ${r[7]}
      )
    `;
  }

  const clientRows = [
    ["Hauwa Suleiman", "hauwa.suleiman@gmail.com", "+234 803 210 4491", "buyer", "offer", "Referral — Maitama mosque", 1],
    ["Olumide Bakare", "olu.bakare@zenithbank.com", "+234 809 441 2280", "buyer", "due_diligence", "Walk-in, Wuse II", 1],
    ["Fatima Mohammed", "fatima.m@icloud.com", "+234 701 992 3344", "investor", "viewing", "Instagram", 2],
    ["Emeka Obi", "emeka.obi@gmail.com", "+234 802 118 7765", "seller", "closed", "Existing client", 1],
    ["Amina Yusuf", "amina.yusuf@nnpc.gov.ng", "+234 803 667 1902", "buyer", "lead", "Billboard, Airport Road", 6],
    ["Richard Danjuma", "rdanjuma@sahelcap.ng", "+234 809 330 4418", "investor", "offer", "Introduced by Yusuf", 7],
    ["Blessing Okoro", "blessing.okoro@yahoo.com", "+234 706 228 9011", "tenant", "viewing", "PropertyPro", 2],
    ["Khalid Lawal", "k.lawal@gmail.com", "+234 805 441 0029", "landlord", "closed", "Jabi lake circle", 1],
    ["Nneka Ibe", "nneka.ibe@mtn.com", "+234 803 991 2740", "buyer", "due_diligence", "Referral — Asokoro", 2],
    ["Samuel Bassey", "sam.bassey@gmail.com", "+234 701 448 3390", "buyer", "lost", "Price-sensitive", 6],
  ] as const;

  const clientIds: number[] = [];
  for (const c of clientRows) {
    const assigned = staffIds[c[6]] ?? staffIds[1]!;
    const inserted = await sql<{ id: number }>`
      insert into clients (user_id, full_name, email, phone, type, stage, source, assigned_staff_id, notes)
      values (${userId}, ${c[0]}, ${c[1]}, ${c[2]}, ${c[3]}, ${c[4]}, ${c[5]}, ${assigned}, ${null})
      returning id
    `;
    clientIds.push(inserted[0]!.id);
  }

  const propertyRows = [
    ["Seven-bed mansion, Maitama Cadastral", "Maitama", "12 Mississippi Street, Maitama", "Mansion", "available", 7, 8, 980, 1_850_000_000, "Pool, staff quarters, dual generators. Title: C of O."],
    ["Four-bed duplex, Asokoro hill", "Asokoro", "9 Kwame Nkrumah Crescent, Asokoro", "Duplex", "reserved", 4, 5, 420, 680_000_000, "Reserved pending search. Family compound at the rear."],
    ["Three-bed lake apartment, Jabi", "Jabi", "Tower B, Jabi Lake Mall Residences", "Apartment", "available", 3, 3, 168, 185_000_000, "Serviced, lake view, 24-hour concierge."],
    ["Residential plot, Katampe Extension", "Katampe Extension", "Plot 441, Cadastral Zone B19", "Plot", "available", null, null, 800, 95_000_000, "Dry land, gazette in progress. Survey lodged."],
    ["Five-bed terrace, Guzape", "Guzape", "18 Congo Street, Guzape", "Terrace", "sold", 5, 5, 380, 420_000_000, "Closed August 2026. Client: Emeka Obi."],
    ["Ground-floor plaza, Wuse II", "Wuse II", "Aminu Kano Crescent, opposite the mosque", "Commercial", "available", null, null, 620, 2_100_000_000, "Nine shops, parking for 22. Sitting tenant till 2028."],
    ["Five-bed duplex, Life Camp", "Life Camp", "4 Close, 6th Avenue, Life Camp", "Duplex", "let", 5, 4, 310, 310_000_000, "Let to an embassy family. Two-year term."],
    ["Penthouse, Jahi", "Jahi", "The Ridge, Jahi District", "Penthouse", "available", 4, 4, 290, 245_000_000, "Two parking, gym access, city view west."],
    ["Four-bed duplex, Gwarinpa", "Gwarinpa", "1st Avenue, 41 Road, Gwarinpa", "Duplex", "available", 4, 4, 240, 165_000_000, "Newly painted. BQ attached."],
    ["Serviced two-bed, CBD", "Central Business District", "The Address, Constitution Avenue", "Apartment", "reserved", 2, 2, 118, 220_000_000, "Corporate reserve. Offer out."],
  ] as const;

  const propertyIds: number[] = [];
  for (const p of propertyRows) {
    const inserted = await sql<{ id: number }>`
      insert into properties (
        user_id, title, district, address, type, status, bedrooms, bathrooms, size_sqm, price_ngn, description
      ) values (
        ${userId}, ${p[0]}, ${p[1]}, ${p[2]}, ${p[3]}, ${p[4]}, ${p[5]}, ${p[6]}, ${p[7]}, ${p[8]}, ${p[9]}
      ) returning id
    `;
    propertyIds.push(inserted[0]!.id);
  }

  const deals = [
    ["AT-SAL-2026-014", 3, 4, 1, "sale", 420_000_000, "completed", "outright", "2026-07-18", "Balance cleared 12 August."],
    ["AT-SAL-2026-021", 0, 1, 1, "sale", 650_000_000, "accepted", "instalment", "2026-08-26", "20% committed. Search on."],
    ["AT-SAL-2026-022", 1, 9, 2, "sale", 210_000_000, "issued", "mortgage", "2026-09-02", "Waiting on bank offer letter."],
    ["AT-LEA-2026-008", 6, 6, 2, "lease", 12_000_000, "completed", "outright", "2026-06-04", "Two-year term, embassy family."],
    ["AT-SAL-2026-019", 5, 0, 1, "sale", 1_750_000_000, "draft", "outright", null, "Maitama mansion. Awaiting board."],
    ["AT-SAL-2026-023", 8, 2, 2, "sale", 180_000_000, "issued", "instalment", "2026-09-04", "Jabi lake apartment, staged payments."],
  ] as const;

  const dealIds: number[] = [];
  for (const d of deals) {
    const inserted = await sql<{ id: number }>`
      insert into deals (
        user_id, reference, client_id, property_id, staff_id, kind, offer_ngn, status, payment_plan, issued_at, notes
      ) values (
        ${userId}, ${d[0]}, ${clientIds[d[1]]!}, ${propertyIds[d[2]]!}, ${staffIds[d[3]]!},
        ${d[4]}, ${d[5]}, ${d[6]}, ${d[7]}, ${d[8]}, ${d[9]}
      ) returning id
    `;
    dealIds.push(inserted[0]!.id);
  }

  const payments: Array<[string, number | null, number, number, string, string, string]> = [
    ["AT-RCP-2026-031", 0, 3, 84_000_000, "transfer", "2026-04-18", "Guzape terrace — first instalment"],
    ["AT-RCP-2026-038", 0, 3, 168_000_000, "transfer", "2026-06-12", "Guzape terrace — second instalment"],
    ["AT-RCP-2026-044", 0, 3, 168_000_000, "transfer", "2026-08-12", "Guzape terrace — final balance"],
    ["AT-RCP-2026-041", 3, 6, 12_000_000, "transfer", "2026-06-04", "Life Camp duplex — two-year rent"],
    ["AT-RCP-2026-047", 1, 0, 130_000_000, "transfer", "2026-08-28", "Asokoro duplex — 20% commitment"],
    ["AT-RCP-2026-049", 2, 1, 21_000_000, "transfer", "2026-09-03", "CBD apartment — reservation fee"],
    ["AT-RCP-2026-050", 5, 8, 36_000_000, "pos", "2026-09-05", "Jabi apartment — first staging"],
    ["AT-RCP-2026-033", null, 7, 4_500_000, "cash", "2026-05-22", "Jabi landlord — agency fee"],
    ["AT-RCP-2026-028", null, 4, 2_000_000, "transfer", "2026-03-14", "Retainer — Katampe plot search"],
  ];
  for (const p of payments) {
    await sql`
      insert into payments (user_id, receipt_no, deal_id, client_id, amount_ngn, method, paid_at, narration)
      values (
        ${userId}, ${p[0]}, ${p[1] == null ? null : dealIds[p[1]]!}, ${clientIds[p[2]]!},
        ${p[3]}, ${p[4]}, ${p[5]}::date, ${p[6]}
      )
    `;
  }

  const tasks: Array<[string, string, number, string, string, string | null]> = [
    ["Issue search request — Asokoro duplex", "Lodge AGIS search for Hauwa Suleiman’s reserved duplex.", 3, "doing", "high", "2026-09-08"],
    ["Prepare offer letter — Jabi lake apartment", "Nneka Ibe, staged payments, send for MD sign-off.", 1, "todo", "high", "2026-09-09"],
    ["Call Amina Yusuf", "Airport Road lead. Book Saturday viewing in Gwarinpa.", 6, "todo", "medium", "2026-09-08"],
    ["Collect keys from Life Camp tenant", "Embassy family requested extra remote for the BQ.", 5, "doing", "low", "2026-09-11"],
    ["File Guzape C of O pack", "Scan and archive the completed sale.", 3, "done", "medium", "2026-09-02"],
    ["September payroll draft", "Confirm leave deductions before processing.", 4, "todo", "high", "2026-09-25"],
    ["Site visit — Katampe plot 441", "Confirm beacons with Yusuf before the weekend.", 7, "todo", "medium", "2026-09-10"],
    ["Follow up Zenith mortgage desk", "Olumide Bakare’s CBD apartment.", 2, "blocked", "high", "2026-09-07"],
    ["Photograph Jahi penthouse", "Afternoon light, west terrace.", 6, "todo", "low", "2026-09-12"],
    ["Write viewing notes — Fatima Mohammed", "Investor, wants two more Jabi units.", 2, "doing", "medium", "2026-09-08"],
  ];
  for (const t of tasks) {
    await sql`
      insert into tasks (user_id, title, description, staff_id, priority, status, due_date)
      values (${userId}, ${t[0]}, ${t[1]}, ${staffIds[t[2]]!}, ${t[4]}, ${t[3]}, ${t[5]})
    `;
  }

  await sql`update workspaces set seeded_at = now() where user_id = ${userId}`;
}

export const getBootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    let me: Staff | null = null;
    if (access.staffId) {
      const rows = await sql<Parameters<typeof mapStaff>[0]>`
        select id, full_name, email, phone, role, department, employment_type,
               salary_ngn, hire_date, status, is_owner, bank_name, account_number, notes
        from staff where id = ${access.staffId} and user_id = ${access.ownerId}
      `;
      me = rows[0] ? mapStaff(rows[0]) : null;
    }
    return { access, me };
  });

export type { MemberRole };
