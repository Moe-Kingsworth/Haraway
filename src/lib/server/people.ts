import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { isWeekend, todayWAT } from "@/lib/format";
import type { AttendanceRow, LeaveRow, Payslip, PayrollRun, Review, Staff, TaskRow } from "@/lib/types";
import { assertAdmin, dateStr, mapStaff, num, resolveAccess, tsStr } from "./access";

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapStaff>[0]>`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, bank_name, account_number, notes
      from staff where user_id = ${access.ownerId} order by is_owner desc, full_name
    `;
    const mapped = rows.map(mapStaff);
    if (access.role === "staff") {
      return mapped.map((s) =>
        s.id === access.staffId ? s : { ...s, salaryNgn: 0, bankName: null, accountNumber: null },
      );
    }
    return mapped;
  });

export const upsertStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    fullName: string;
    email: string;
    phone: string;
    role: string;
    department: string;
    salaryNgn: number;
    hireDate: string;
    status: string;
    bankName?: string;
    accountNumber?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    const name = data.fullName.trim();
    const email = data.email.trim().toLowerCase();
    if (!name || !email) throw new Error("Name and email are required.");
    if (data.id) {
      await sql`
        update staff set
          full_name = ${name}, email = ${email}, phone = ${data.phone.trim()},
          role = ${data.role}, department = ${data.department},
          salary_ngn = ${Math.round(data.salaryNgn)}, hire_date = ${data.hireDate}::date,
          status = ${data.status}, bank_name = ${data.bankName ?? null},
          account_number = ${data.accountNumber ?? null}
        where id = ${data.id} and user_id = ${access.ownerId}
      `;
      return { id: data.id };
    }
    const inserted = await sql<{ id: number }>`
      insert into staff (
        user_id, full_name, email, phone, role, department, salary_ngn, hire_date, status, bank_name, account_number
      ) values (
        ${access.ownerId}, ${name}, ${email}, ${data.phone.trim()}, ${data.role}, ${data.department},
        ${Math.round(data.salaryNgn)}, ${data.hireDate}::date, ${data.status},
        ${data.bankName ?? null}, ${data.accountNumber ?? null}
      ) returning id
    `;
    return { id: inserted[0]!.id };
  });

function mapAttendance(row: {
  id: number;
  staff_id: number;
  staff_name: string;
  work_date: unknown;
  clock_in: unknown;
  clock_out: unknown;
  status: string;
  notes: string | null;
}): AttendanceRow {
  return {
    id: row.id,
    staffId: row.staff_id,
    staffName: row.staff_name,
    workDate: dateStr(row.work_date),
    clockIn: tsStr(row.clock_in),
    clockOut: tsStr(row.clock_out),
    status: row.status,
    notes: row.notes,
  };
}

export const listAttendance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { from: string; to: string }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<Parameters<typeof mapAttendance>[0]>`
      select a.id, a.staff_id, s.full_name as staff_name, a.work_date, a.clock_in, a.clock_out, a.status, a.notes
      from attendance a
      join staff s on s.id = a.staff_id
      where a.user_id = ${access.ownerId}
        and a.work_date >= ${data.from}::date
        and a.work_date <= ${data.to}::date
      order by a.work_date desc, s.full_name
    `;
    return rows.map(mapAttendance);
  });

export const clockToday = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { action: "in" | "out"; staffId?: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const staffId = data.staffId ?? access.staffId;
    if (!staffId) throw new Error("No staff desk is linked to this account.");
    if (access.role !== "admin" && staffId !== access.staffId) {
      throw new Error("You can only clock for your own desk.");
    }
    const sql = await getSql();
    const owned = await sql<{ id: number }>`
      select id from staff where id = ${staffId} and user_id = ${access.ownerId}
    `;
    if (!owned[0]) throw new Error("Staff not found.");
    const today = todayWAT();
    const existing = await sql<{
      id: number;
      clock_in: unknown;
      clock_out: unknown;
      status: string;
    }>`select id, clock_in, clock_out, status from attendance
       where staff_id = ${staffId} and work_date = ${today}::date`;

    if (data.action === "in") {
      if (existing[0]?.clock_in) throw new Error("Already clocked in today.");
      const now = new Date();
      const lagosHour = Number(
        new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Africa/Lagos" }).format(now),
      );
      const status = !isWeekend(today) && lagosHour >= 9 ? "late" : "present";
      if (existing[0]) {
        await sql`
          update attendance set clock_in = now(), status = ${status}
          where id = ${existing[0].id} and user_id = ${access.ownerId}
        `;
      } else {
        await sql`
          insert into attendance (user_id, staff_id, work_date, clock_in, status)
          values (${access.ownerId}, ${staffId}, ${today}::date, now(), ${status})
        `;
      }
      return { ok: true, status };
    }

    if (!existing[0]?.clock_in) throw new Error("Clock in first.");
    if (existing[0].clock_out) throw new Error("Already clocked out.");
    await sql`
      update attendance set clock_out = now()
      where id = ${existing[0].id} and user_id = ${access.ownerId}
    `;
    return { ok: true, status: existing[0].status };
  });

export const setAttendance = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { staffId: number; workDate: string; status: string; notes?: string }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    await sql`
      insert into attendance (user_id, staff_id, work_date, status, notes)
      values (${access.ownerId}, ${data.staffId}, ${data.workDate}::date, ${data.status}, ${data.notes ?? null})
      on conflict (staff_id, work_date)
      do update set status = excluded.status, notes = excluded.notes
    `;
    return { ok: true };
  });

export const listLeave = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      staff_id: number;
      staff_name: string;
      leave_type: string;
      start_date: unknown;
      end_date: unknown;
      status: string;
      reason: string | null;
    }>`
      select l.id, l.staff_id, s.full_name as staff_name, l.leave_type, l.start_date, l.end_date, l.status, l.reason
      from leave_requests l
      join staff s on s.id = l.staff_id
      where l.user_id = ${access.ownerId}
        and (${access.role === "admin"} or l.staff_id = ${access.staffId ?? 0})
      order by l.created_at desc
    `;
    return rows.map(
      (r): LeaveRow => ({
        id: r.id,
        staffId: r.staff_id,
        staffName: r.staff_name,
        leaveType: r.leave_type,
        startDate: dateStr(r.start_date),
        endDate: dateStr(r.end_date),
        status: r.status,
        reason: r.reason,
      }),
    );
  });

export const requestLeave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { leaveType: string; startDate: string; endDate: string; reason: string }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (!access.staffId) throw new Error("No staff desk is linked to this account.");
    const sql = await getSql();
    await sql`
      insert into leave_requests (user_id, staff_id, leave_type, start_date, end_date, reason)
      values (${access.ownerId}, ${access.staffId}, ${data.leaveType}, ${data.startDate}::date, ${data.endDate}::date, ${data.reason.trim()})
    `;
    return { ok: true };
  });

export const reviewLeave = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: number; status: "approved" | "declined" }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    await sql`
      update leave_requests set status = ${data.status}
      where id = ${data.id} and user_id = ${access.ownerId}
    `;
    return { ok: true };
  });

export const listPayroll = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const runs = await sql<{
      id: number;
      period_year: number;
      period_month: number;
      status: string;
      processed_at: unknown;
    }>`select id, period_year, period_month, status, processed_at
       from payroll_runs where user_id = ${access.ownerId}
       order by period_year desc, period_month desc`;
    const slips = await sql<{
      id: number;
      run_id: number;
      staff_id: number;
      staff_name: string;
      department: string;
      basic_ngn: number;
      allowance_ngn: number;
      deduction_ngn: number;
      net_ngn: number;
      period_year: number;
      period_month: number;
      run_status: string;
    }>`
      select p.id, p.run_id, p.staff_id, s.full_name as staff_name, s.department,
             p.basic_ngn, p.allowance_ngn, p.deduction_ngn, p.net_ngn,
             r.period_year, r.period_month, r.status as run_status
      from payslips p
      join staff s on s.id = p.staff_id
      join payroll_runs r on r.id = p.run_id
      where p.user_id = ${access.ownerId}
        and (${access.role === "admin"} or p.staff_id = ${access.staffId ?? 0})
      order by r.period_year desc, r.period_month desc, s.full_name
    `;
    return {
      runs: runs.map(
        (r): PayrollRun => ({
          id: r.id,
          periodYear: r.period_year,
          periodMonth: r.period_month,
          status: r.status,
          processedAt: tsStr(r.processed_at),
        }),
      ),
      slips: slips.map(
        (s): Payslip => ({
          id: s.id,
          runId: s.run_id,
          staffId: s.staff_id,
          staffName: s.staff_name,
          department: s.department,
          basicNgn: num(s.basic_ngn),
          allowanceNgn: num(s.allowance_ngn),
          deductionNgn: num(s.deduction_ngn),
          netNgn: num(s.net_ngn),
          periodYear: s.period_year,
          periodMonth: s.period_month,
          runStatus: s.run_status,
        }),
      ),
    };
  });

export const processPayroll = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { year: number; month: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const sql = await getSql();
    const existing = await sql<{ id: number; status: string }>`
      select id, status from payroll_runs
      where user_id = ${access.ownerId} and period_year = ${data.year} and period_month = ${data.month}
    `;
    if (existing[0] && existing[0].status !== "draft") {
      throw new Error("That month is already processed.");
    }
    let runId = existing[0]?.id;
    if (!runId) {
      const inserted = await sql<{ id: number }>`
        insert into payroll_runs (user_id, period_year, period_month, status, processed_at)
        values (${access.ownerId}, ${data.year}, ${data.month}, ${"paid"}, now())
        returning id
      `;
      runId = inserted[0]!.id;
    } else {
      await sql`
        update payroll_runs set status = ${"paid"}, processed_at = now()
        where id = ${runId} and user_id = ${access.ownerId}
      `;
      await sql`delete from payslips where run_id = ${runId} and user_id = ${access.ownerId}`;
    }
    const staff = await sql<{ id: number; salary_ngn: number; status: string }>`
      select id, salary_ngn, status from staff where user_id = ${access.ownerId} and status <> ${"exited"}
    `;
    for (const s of staff) {
      const basic = num(s.salary_ngn);
      const allowance = Math.round(basic * 0.2);
      const deduction = Math.round(basic * 0.08);
      await sql`
        insert into payslips (user_id, run_id, staff_id, basic_ngn, allowance_ngn, deduction_ngn, net_ngn)
        values (${access.ownerId}, ${runId}, ${s.id}, ${basic}, ${allowance}, ${deduction}, ${basic + allowance - deduction})
      `;
    }
    return { id: runId };
  });

export const listTasks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      title: string;
      description: string | null;
      staff_id: number | null;
      staff_name: string | null;
      client_id: number | null;
      property_id: number | null;
      priority: string;
      status: string;
      due_date: unknown;
      created_at: unknown;
    }>`
      select t.id, t.title, t.description, t.staff_id, s.full_name as staff_name,
             t.client_id, t.property_id, t.priority, t.status, t.due_date, t.created_at
      from tasks t
      left join staff s on s.id = t.staff_id
      where t.user_id = ${access.ownerId}
        and (${access.role === "admin"} or t.staff_id = ${access.staffId ?? 0})
      order by case t.status when 'blocked' then 0 when 'doing' then 1 when 'todo' then 2 else 3 end,
               t.due_date nulls last
    `;
    return rows.map(
      (t): TaskRow => ({
        id: t.id,
        title: t.title,
        description: t.description,
        staffId: t.staff_id,
        staffName: t.staff_name,
        clientId: t.client_id,
        propertyId: t.property_id,
        priority: t.priority,
        status: t.status,
        dueDate: t.due_date ? dateStr(t.due_date) : null,
        createdAt: tsStr(t.created_at) ?? "",
      }),
    );
  });

export const upsertTask = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    title: string;
    description?: string;
    staffId?: number | null;
    priority: string;
    status: string;
    dueDate?: string | null;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const title = data.title.trim();
    if (!title) throw new Error("A task needs a title.");
    if (data.id) {
      if (access.role !== "admin") {
        await sql`
          update tasks set status = ${data.status}
          where id = ${data.id} and user_id = ${access.ownerId} and staff_id = ${access.staffId ?? 0}
        `;
        return { id: data.id };
      }
      await sql`
        update tasks set
          title = ${title}, description = ${data.description ?? null},
          staff_id = ${data.staffId ?? null}, priority = ${data.priority},
          status = ${data.status}, due_date = ${data.dueDate ?? null}
        where id = ${data.id} and user_id = ${access.ownerId}
      `;
      return { id: data.id };
    }
    assertAdmin(access);
    const inserted = await sql<{ id: number }>`
      insert into tasks (user_id, title, description, staff_id, priority, status, due_date)
      values (
        ${access.ownerId}, ${title}, ${data.description ?? null}, ${data.staffId ?? null},
        ${data.priority}, ${data.status}, ${data.dueDate ?? null}
      ) returning id
    `;
    return { id: inserted[0]!.id };
  });

export const listReviews = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      staff_id: number;
      staff_name: string;
      department: string;
      period_label: string;
      deals_closed: number;
      listings_won: number;
      attendance_score: number;
      client_score: number;
      overall_score: number;
      notes: string | null;
    }>`
      select r.id, r.staff_id, s.full_name as staff_name, s.department, r.period_label,
             r.deals_closed, r.listings_won, r.attendance_score, r.client_score, r.overall_score, r.notes
      from performance_reviews r
      join staff s on s.id = r.staff_id
      where r.user_id = ${access.ownerId}
        and (${access.role === "admin"} or r.staff_id = ${access.staffId ?? 0})
      order by s.full_name
    `;
    return rows.map(
      (r): Review => ({
        id: r.id,
        staffId: r.staff_id,
        staffName: r.staff_name,
        department: r.department,
        periodLabel: r.period_label,
        dealsClosed: num(r.deals_closed),
        listingsWon: num(r.listings_won),
        attendanceScore: num(r.attendance_score),
        clientScore: num(r.client_score),
        overallScore: num(r.overall_score),
        notes: r.notes,
      }),
    );
  });

export const upsertReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    staffId: number;
    periodLabel: string;
    dealsClosed: number;
    listingsWon: number;
    attendanceScore: number;
    clientScore: number;
    notes?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    assertAdmin(access);
    const overall = Math.round(
      data.attendanceScore * 0.3 + data.clientScore * 0.4 + Math.min(100, data.dealsClosed * 8 + data.listingsWon * 4) * 0.3,
    );
    const sql = await getSql();
    await sql`
      insert into performance_reviews (
        user_id, staff_id, period_label, deals_closed, listings_won, attendance_score, client_score, overall_score, notes
      ) values (
        ${access.ownerId}, ${data.staffId}, ${data.periodLabel.trim()}, ${data.dealsClosed}, ${data.listingsWon},
        ${data.attendanceScore}, ${data.clientScore}, ${overall}, ${data.notes ?? null}
      )
    `;
    return { overall };
  });

export type { Staff };
