import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { type Role } from "@/lib/constants";
import { getSql } from "@/lib/db";
import { todayWAT } from "@/lib/format";
import { supabaseAdmin } from "@/lib/supabase";
import type { AuditLogEntry, Staff, SuperAdminAttendanceRow, SuperAdminDashboardData } from "@/lib/types";
import { assertAdmin, assertNotFounder, mapStaff, resolveAccess, tsStr } from "./access";

export async function logAuditEvent(
  actorName: string,
  action: string,
  target: string,
  details: Record<string, unknown> = {},
): Promise<void> {
  try {
    const sql = await getSql();
    await sql`
      insert into audit_log (actor_name, action, target, timestamp, details)
      values (${actorName}, ${action}, ${target}, now(), ${JSON.stringify(details)}::jsonb)
    `;
  } catch (err) {
    console.error("[audit_log] failed to record event:", err);
  }
}

export const getSuperAdminDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<SuperAdminDashboardData> => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    const today = todayWAT();

    // 1. Live attendance (today)
    const activeStaff = await sql<{
      id: number;
      full_name: string;
      department: string;
    }>`
      select id, full_name, department
      from staff
      where user_id = ${access.ownerId} and status = 'active'
      order by department, full_name
    `;

    const todayAttendance = await sql<{
      id: number;
      staff_id: number;
      clock_in: unknown;
      clock_out: unknown;
      status: string;
    }>`
      select id, staff_id, clock_in, clock_out, status
      from attendance
      where user_id = ${access.ownerId} and work_date = ${today}::date
    `;

    const activeLeaves = await sql<{ staff_id: number }>`
      select staff_id
      from leave_requests
      where user_id = ${access.ownerId}
        and status = 'approved'
        and start_date <= ${today}::date
        and end_date >= ${today}::date
    `;

    const attMap = new Map(todayAttendance.map((a) => [a.staff_id, a]));
    const leaveSet = new Set(activeLeaves.map((l) => l.staff_id));

    let completeCount = 0;
    let incompleteCount = 0;
    let absentCount = 0;
    let onLeaveCount = 0;

    const attendanceRows: SuperAdminAttendanceRow[] = activeStaff.map((s) => {
      const att = attMap.get(s.id);
      const onLeave = leaveSet.has(s.id);

      let status: "Complete" | "Incomplete" | "Absent" | "On Leave" = "Absent";
      if (onLeave) {
        status = "On Leave";
        onLeaveCount++;
      } else if (att?.clock_in && att?.clock_out) {
        status = "Complete";
        completeCount++;
      } else if (att?.clock_in) {
        status = "Incomplete";
        incompleteCount++;
      } else {
        status = "Absent";
        absentCount++;
      }

      return {
        id: att?.id ?? null,
        staffId: s.id,
        name: s.full_name,
        department: s.department,
        clockIn: tsStr(att?.clock_in),
        clockOut: tsStr(att?.clock_out),
        status,
      };
    });

    // 2. System activity feed (latest 10 entries)
    const rawLogs = await sql<{
      id: number;
      actor_name: string;
      action: string;
      target: string;
      timestamp: unknown;
      details: unknown;
    }>`
      select id, actor_name, action, target, timestamp, details
      from audit_log
      order by timestamp desc
      limit 10
    `;

    const auditLogs: AuditLogEntry[] = rawLogs.map((l) => ({
      id: l.id,
      actorName: l.actor_name,
      action: l.action,
      target: l.target,
      timestamp: tsStr(l.timestamp) ?? new Date().toISOString(),
      details: typeof l.details === "object" ? (l.details as Record<string, string | number | boolean | null>) : null,
    }));

    // 3. Staff summary cards
    const summaryCounts = await sql<{
      total_active: number;
      suspended: number;
      created_month: number;
    }>`
      select
        count(*) filter (where status = 'active')::int as total_active,
        count(*) filter (where status = 'suspended')::int as suspended,
        count(*) filter (where created_at >= date_trunc('month', now()))::int as created_month
      from staff
      where user_id = ${access.ownerId}
    `;

    const counts = summaryCounts[0] ?? { total_active: 0, suspended: 0, created_month: 0 };

    return {
      attendanceRows,
      summary: {
        totalPresent: completeCount + incompleteCount,
        totalAbsent: absentCount,
        incomplete: incompleteCount,
        onLeave: onLeaveCount,
      },
      auditLogs,
      staffSummary: {
        totalActive: Number(counts.total_active || 0),
        suspended: Number(counts.suspended || 0),
        createdThisMonth: Number(counts.created_month || 0),
      },
    };
  });

export const listUsers = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<Staff[]> => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapStaff>[0]>`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password, bank_name, account_number, notes,
             employee_id, position
      from staff
      where user_id = ${access.ownerId}
      order by is_founder_account desc, is_owner desc, full_name
    `;
    return rows.map(mapStaff);
  });

export const createUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    fullName: string;
    email: string;
    phone: string;
    employeeId: string;
    department: string;
    position: string;
    role: Role;
    status: string;
    temporaryPassword: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") {
      throw new Error("Only Super Admins can create new user accounts.");
    }
    const sql = await getSql();
    const fullName = data.fullName.trim();
    const email = data.email.trim().toLowerCase();
    const phone = data.phone.trim();
    const employeeId = data.employeeId.trim();
    const position = data.position.trim();
    const password = data.temporaryPassword.trim();

    if (!fullName || !email || !password) {
      throw new Error("Full name, email, and temporary password are required.");
    }

    // Check duplicate email in staff table
    const existing = await sql<{ id: number }>`
      select id from staff where lower(email) = ${email} limit 1
    `;
    if (existing[0]) {
      throw new Error(`A staff member with email "${email}" already exists.`);
    }

    // 1. Create auth user in Supabase Auth
    let authUserId = "";
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError || !authData.user) {
      // If user already exists in Supabase Auth, retrieve their id
      const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
      const match = existingUser?.users?.find((u) => u.email?.toLowerCase() === email);
      if (match) {
        authUserId = match.id;
        await supabaseAdmin.auth.admin.updateUserById(authUserId, { password });
      } else {
        throw new Error(authError?.message || "Failed to create Supabase Auth user.");
      }
    } else {
      authUserId = authData.user.id;
    }

    // 2. Insert staff record
    const inserted = await sql<{ id: number }>`
      insert into staff (
        user_id, full_name, email, phone, role, department, employment_type,
        salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password,
        employee_id, position
      ) values (
        ${access.ownerId}, ${fullName}, ${email}, ${phone}, ${data.role}, ${data.department}, ${"Full-time"},
        ${500000}, now()::date, ${data.status || "active"}, false, false, true,
        ${employeeId || `ES-${Date.now().toString().slice(-4)}`}, ${position || "Associate"}
      ) returning id
    `;
    const staffId = inserted[0]!.id;

    // 3. Link membership
    await sql`
      insert into memberships (user_id, company_owner_id, staff_id, role)
      values (${authUserId}, ${access.ownerId}, ${staffId}, ${data.role})
      on conflict (user_id) do update set staff_id = excluded.staff_id, role = excluded.role
    `;

    // 4. Log to audit_log
    await logAuditEvent(access.displayName, "Create User", fullName, {
      staffId,
      email,
      role: data.role,
      department: data.department,
      employeeId,
    });

    return { ok: true, staffId };
  });

export const editUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: number;
    fullName: string;
    phone: string;
    employeeId: string;
    department: string;
    position: string;
    role: Role;
    status: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") {
      throw new Error("Only Super Admins can edit users.");
    }
    const sql = await getSql();

    const targetRows = await sql<Parameters<typeof mapStaff>[0]>`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password, bank_name, account_number, notes,
             employee_id, position
      from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
    if (!targetRows[0]) throw new Error("User not found.");
    const target = mapStaff(targetRows[0]);

    if (target.isFounderAccount) {
      if (target.role !== data.role) {
        assertNotFounder(target, "change the role of");
      }
      if (target.status !== data.status && data.status !== "active") {
        assertNotFounder(target, "suspend");
      }
    }

    await sql`
      update staff set
        full_name = ${data.fullName.trim()},
        phone = ${data.phone.trim()},
        employee_id = ${data.employeeId.trim()},
        department = ${data.department},
        position = ${data.position.trim()},
        role = ${data.role},
        status = ${data.status}
      where id = ${data.id} and user_id = ${access.ownerId}
    `;

    await sql`
      update memberships set role = ${data.role}
      where staff_id = ${data.id}
    `;

    await logAuditEvent(access.displayName, "Edit User", target.fullName, {
      staffId: data.id,
      old: { role: target.role, department: target.department, status: target.status, position: target.position },
      new: { role: data.role, department: data.department, status: data.status, position: data.position },
    });

    return { ok: true };
  });

export const suspendUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") throw new Error("Only Super Admins can suspend users.");
    const sql = await getSql();

    const targetRows = await sql<Parameters<typeof mapStaff>[0]>`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password, bank_name, account_number, notes,
             employee_id, position
      from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
    if (!targetRows[0]) throw new Error("User not found.");
    const target = mapStaff(targetRows[0]);
    assertNotFounder(target, "suspend");

    await sql`
      update staff set status = 'suspended'
      where id = ${data.id} and user_id = ${access.ownerId}
    `;

    await logAuditEvent(access.displayName, "Suspend User", target.fullName, { staffId: data.id });
    return { ok: true };
  });

export const reactivateUser = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") throw new Error("Only Super Admins can reactivate users.");
    const sql = await getSql();

    const targetRows = await sql<{ id: number; full_name: string }>`
      select id, full_name from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
    if (!targetRows[0]) throw new Error("User not found.");

    await sql`
      update staff set status = 'active'
      where id = ${data.id} and user_id = ${access.ownerId}
    `;

    await logAuditEvent(access.displayName, "Reactivate User", targetRows[0].full_name, { staffId: data.id });
    return { ok: true };
  });

export const resetUserPassword = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; temporaryPassword?: string }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") throw new Error("Only Super Admins can reset user passwords.");
    const sql = await getSql();

    const targetRows = await sql<{ id: number; full_name: string; email: string }>`
      select id, full_name, email from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
    if (!targetRows[0]) throw new Error("User not found.");
    const target = targetRows[0];

    const tempPassword = data.temporaryPassword?.trim() || `EdenPass#${Math.floor(1000 + Math.random() * 9000)}`;

    // Update password in Supabase Auth
    try {
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const match = usersData?.users?.find((u) => u.email?.toLowerCase() === target.email.toLowerCase());
      if (match) {
        await supabaseAdmin.auth.admin.updateUserById(match.id, { password: tempPassword });
      }
    } catch (e) {
      console.warn("Could not update auth user directly:", e);
    }

    await sql`
      update staff set must_change_password = true
      where id = ${data.id} and user_id = ${access.ownerId}
    `;

    await logAuditEvent(access.displayName, "Reset Password", target.full_name, { staffId: data.id });
    return { ok: true, temporaryPassword: tempPassword };
  });

export const promoteSuperAdmin = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") throw new Error("Only Super Admins can promote users.");
    const sql = await getSql();

    const targetRows = await sql<{ id: number; full_name: string }>`
      select id, full_name from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
    if (!targetRows[0]) throw new Error("User not found.");

    await sql`
      update staff set role = 'super_admin'
      where id = ${data.id} and user_id = ${access.ownerId}
    `;
    await sql`
      update memberships set role = 'super_admin'
      where staff_id = ${data.id}
    `;

    await logAuditEvent(access.displayName, "Promote to Super Admin", targetRows[0].full_name, { staffId: data.id });
    return { ok: true };
  });

export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: {
    actionType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "super_admin") throw new Error("Only Super Admins can view audit logs.");
    const sql = await getSql();

    const page = Math.max(1, data.page || 1);
    const limit = Math.min(100, Math.max(1, data.limit || 20));
    const offset = (page - 1) * limit;

    const actionFilter = data.actionType?.trim();
    const startFilter = data.startDate?.trim();
    const endFilter = data.endDate?.trim();

    const rows = await sql<{
      id: number;
      actor_name: string;
      action: string;
      target: string;
      timestamp: unknown;
      details: unknown;
    }>`
      select id, actor_name, action, target, timestamp, details
      from audit_log
      where (${!actionFilter} or action = ${actionFilter || ""})
        and (${!startFilter} or timestamp >= ${startFilter || "1970-01-01"}::timestamptz)
        and (${!endFilter} or timestamp <= ${endFilter ? `${endFilter}T23:59:59Z` : "9999-12-31"}::timestamptz)
      order by timestamp desc
      limit ${limit} offset ${offset}
    `;

    const countRes = await sql<{ count: number }>`
      select count(*)::int as count
      from audit_log
      where (${!actionFilter} or action = ${actionFilter || ""})
        and (${!startFilter} or timestamp >= ${startFilter || "1970-01-01"}::timestamptz)
        and (${!endFilter} or timestamp <= ${endFilter ? `${endFilter}T23:59:59Z` : "9999-12-31"}::timestamptz)
    `;

    const totalCount = Number(countRes[0]?.count || 0);

    const logs: AuditLogEntry[] = rows.map((r) => ({
      id: r.id,
      actorName: r.actor_name,
      action: r.action,
      target: r.target,
      timestamp: tsStr(r.timestamp) ?? new Date().toISOString(),
      details: typeof r.details === "object" ? (r.details as Record<string, string | number | boolean | null>) : null,
    }));

    return {
      rows: logs,
      totalCount,
      page,
      totalPages: Math.max(1, Math.ceil(totalCount / limit)),
    };
  });
