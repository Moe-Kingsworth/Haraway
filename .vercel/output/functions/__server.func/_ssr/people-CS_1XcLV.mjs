import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-DamQGqw7.mjs";
import { c as isWeekend, d as todayWAT, n as authMiddleware } from "./format-Tz25-cit.mjs";
import { a as num, i as mapStaff, n as dateStr, o as resolveAccess, s as tsStr, t as assertAdmin } from "./access-BBPyLmQY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/people-CS_1XcLV.js
var listStaff_createServerFn_handler = createServerRpc({
	id: "63f578b0001a0076ae4ad6802503147e33eb149b3792a3c64021fd5217c0bf9b",
	name: "listStaff",
	filename: "src/lib/server/people.ts"
}, (opts) => listStaff.__executeServer(opts));
var listStaff = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStaff_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	const mapped = (await (await getSql())`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, bank_name, account_number, notes
      from staff where user_id = ${access.ownerId} order by is_owner desc, full_name
    `).map(mapStaff);
	if (access.role === "staff") return mapped.map((s) => s.id === access.staffId ? s : {
		...s,
		salaryNgn: 0,
		bankName: null,
		accountNumber: null
	});
	return mapped;
});
var upsertStaff_createServerFn_handler = createServerRpc({
	id: "3cd65b1299964a539175fc797d57cf4b1a1ae4454a82ce2be0170735e01eacec",
	name: "upsertStaff",
	filename: "src/lib/server/people.ts"
}, (opts) => upsertStaff.__executeServer(opts));
var upsertStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertStaff_createServerFn_handler, async ({ context, data }) => {
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
	return { id: (await sql`
      insert into staff (
        user_id, full_name, email, phone, role, department, salary_ngn, hire_date, status, bank_name, account_number
      ) values (
        ${access.ownerId}, ${name}, ${email}, ${data.phone.trim()}, ${data.role}, ${data.department},
        ${Math.round(data.salaryNgn)}, ${data.hireDate}::date, ${data.status},
        ${data.bankName ?? null}, ${data.accountNumber ?? null}
      ) returning id
    `)[0].id };
});
function mapAttendance(row) {
	return {
		id: row.id,
		staffId: row.staff_id,
		staffName: row.staff_name,
		workDate: dateStr(row.work_date),
		clockIn: tsStr(row.clock_in),
		clockOut: tsStr(row.clock_out),
		status: row.status,
		notes: row.notes
	};
}
var listAttendance_createServerFn_handler = createServerRpc({
	id: "c3cb4cf8fb5d688d0766adebc89152d72e18b78ae115d9d2629ce4c187253ca6",
	name: "listAttendance",
	filename: "src/lib/server/people.ts"
}, (opts) => listAttendance.__executeServer(opts));
var listAttendance = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(listAttendance_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select a.id, a.staff_id, s.full_name as staff_name, a.work_date, a.clock_in, a.clock_out, a.status, a.notes
      from attendance a
      join staff s on s.id = a.staff_id
      where a.user_id = ${access.ownerId}
        and a.work_date >= ${data.from}::date
        and a.work_date <= ${data.to}::date
      order by a.work_date desc, s.full_name
    `).map(mapAttendance);
});
var clockToday_createServerFn_handler = createServerRpc({
	id: "0d203d19e74912dc40cc9c6182e6bd6906f6e6236dc4c6ec75ce809186c5b794",
	name: "clockToday",
	filename: "src/lib/server/people.ts"
}, (opts) => clockToday.__executeServer(opts));
var clockToday = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(clockToday_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	const staffId = data.staffId ?? access.staffId;
	if (!staffId) throw new Error("No staff desk is linked to this account.");
	if (access.role !== "admin" && staffId !== access.staffId) throw new Error("You can only clock for your own desk.");
	const sql = await getSql();
	if (!(await sql`
      select id from staff where id = ${staffId} and user_id = ${access.ownerId}
    `)[0]) throw new Error("Staff not found.");
	const today = todayWAT();
	const existing = await sql`select id, clock_in, clock_out, status from attendance
       where staff_id = ${staffId} and work_date = ${today}::date`;
	if (data.action === "in") {
		if (existing[0]?.clock_in) throw new Error("Already clocked in today.");
		const now = /* @__PURE__ */ new Date();
		const lagosHour = Number(new Intl.DateTimeFormat("en-GB", {
			hour: "2-digit",
			hour12: false,
			timeZone: "Africa/Lagos"
		}).format(now));
		const status = !isWeekend(today) && lagosHour >= 9 ? "late" : "present";
		if (existing[0]) await sql`
          update attendance set clock_in = now(), status = ${status}
          where id = ${existing[0].id} and user_id = ${access.ownerId}
        `;
		else await sql`
          insert into attendance (user_id, staff_id, work_date, clock_in, status)
          values (${access.ownerId}, ${staffId}, ${today}::date, now(), ${status})
        `;
		return {
			ok: true,
			status
		};
	}
	if (!existing[0]?.clock_in) throw new Error("Clock in first.");
	if (existing[0].clock_out) throw new Error("Already clocked out.");
	await sql`
      update attendance set clock_out = now()
      where id = ${existing[0].id} and user_id = ${access.ownerId}
    `;
	return {
		ok: true,
		status: existing[0].status
	};
});
var setAttendance_createServerFn_handler = createServerRpc({
	id: "181472c3e29145e1c187199f74d151cb7b9fa360e0be5338885002ebd1415f58",
	name: "setAttendance",
	filename: "src/lib/server/people.ts"
}, (opts) => setAttendance.__executeServer(opts));
var setAttendance = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(setAttendance_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	await (await getSql())`
      insert into attendance (user_id, staff_id, work_date, status, notes)
      values (${access.ownerId}, ${data.staffId}, ${data.workDate}::date, ${data.status}, ${data.notes ?? null})
      on conflict (staff_id, work_date)
      do update set status = excluded.status, notes = excluded.notes
    `;
	return { ok: true };
});
var listLeave_createServerFn_handler = createServerRpc({
	id: "6cfdf2c29e1518d88d993eb7acb638dec5382a1f5974ce0913e578ae83b8177d",
	name: "listLeave",
	filename: "src/lib/server/people.ts"
}, (opts) => listLeave.__executeServer(opts));
var listLeave = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listLeave_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select l.id, l.staff_id, s.full_name as staff_name, l.leave_type, l.start_date, l.end_date, l.status, l.reason
      from leave_requests l
      join staff s on s.id = l.staff_id
      where l.user_id = ${access.ownerId}
        and (${access.role === "admin"} or l.staff_id = ${access.staffId ?? 0})
      order by l.created_at desc
    `).map((r) => ({
		id: r.id,
		staffId: r.staff_id,
		staffName: r.staff_name,
		leaveType: r.leave_type,
		startDate: dateStr(r.start_date),
		endDate: dateStr(r.end_date),
		status: r.status,
		reason: r.reason
	}));
});
var requestLeave_createServerFn_handler = createServerRpc({
	id: "0c7dd88c03051607a5a681452d1d7990d5b8fd2d78ab70c86a99d2f45c38ce59",
	name: "requestLeave",
	filename: "src/lib/server/people.ts"
}, (opts) => requestLeave.__executeServer(opts));
var requestLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(requestLeave_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (!access.staffId) throw new Error("No staff desk is linked to this account.");
	await (await getSql())`
      insert into leave_requests (user_id, staff_id, leave_type, start_date, end_date, reason)
      values (${access.ownerId}, ${access.staffId}, ${data.leaveType}, ${data.startDate}::date, ${data.endDate}::date, ${data.reason.trim()})
    `;
	return { ok: true };
});
var reviewLeave_createServerFn_handler = createServerRpc({
	id: "077ce5117434f40a76369690e4f0903078bf83d15c784801ee32deffb82a70d0",
	name: "reviewLeave",
	filename: "src/lib/server/people.ts"
}, (opts) => reviewLeave.__executeServer(opts));
var reviewLeave = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(reviewLeave_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	await (await getSql())`
      update leave_requests set status = ${data.status}
      where id = ${data.id} and user_id = ${access.ownerId}
    `;
	return { ok: true };
});
var listPayroll_createServerFn_handler = createServerRpc({
	id: "805a7ec6e9cbb8246a98c23854c430b8bff59b3058ebe2b6d45b09ab6054ebb7",
	name: "listPayroll",
	filename: "src/lib/server/people.ts"
}, (opts) => listPayroll.__executeServer(opts));
var listPayroll = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPayroll_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	const sql = await getSql();
	const runs = await sql`select id, period_year, period_month, status, processed_at
       from payroll_runs where user_id = ${access.ownerId}
       order by period_year desc, period_month desc`;
	const slips = await sql`
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
		runs: runs.map((r) => ({
			id: r.id,
			periodYear: r.period_year,
			periodMonth: r.period_month,
			status: r.status,
			processedAt: tsStr(r.processed_at)
		})),
		slips: slips.map((s) => ({
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
			runStatus: s.run_status
		}))
	};
});
var processPayroll_createServerFn_handler = createServerRpc({
	id: "99136bff47d0ec90e470b6766cccfebded93cf5c443e0e08de08f81b74d22347",
	name: "processPayroll",
	filename: "src/lib/server/people.ts"
}, (opts) => processPayroll.__executeServer(opts));
var processPayroll = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(processPayroll_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	const sql = await getSql();
	const existing = await sql`
      select id, status from payroll_runs
      where user_id = ${access.ownerId} and period_year = ${data.year} and period_month = ${data.month}
    `;
	if (existing[0] && existing[0].status !== "draft") throw new Error("That month is already processed.");
	let runId = existing[0]?.id;
	if (!runId) runId = (await sql`
        insert into payroll_runs (user_id, period_year, period_month, status, processed_at)
        values (${access.ownerId}, ${data.year}, ${data.month}, ${"paid"}, now())
        returning id
      `)[0].id;
	else {
		await sql`
        update payroll_runs set status = ${"paid"}, processed_at = now()
        where id = ${runId} and user_id = ${access.ownerId}
      `;
		await sql`delete from payslips where run_id = ${runId} and user_id = ${access.ownerId}`;
	}
	const staff = await sql`
      select id, salary_ngn, status from staff where user_id = ${access.ownerId} and status <> ${"exited"}
    `;
	for (const s of staff) {
		const basic = num(s.salary_ngn);
		const allowance = Math.round(basic * .2);
		const deduction = Math.round(basic * .08);
		await sql`
        insert into payslips (user_id, run_id, staff_id, basic_ngn, allowance_ngn, deduction_ngn, net_ngn)
        values (${access.ownerId}, ${runId}, ${s.id}, ${basic}, ${allowance}, ${deduction}, ${basic + allowance - deduction})
      `;
	}
	return { id: runId };
});
var listTasks_createServerFn_handler = createServerRpc({
	id: "e5e17cb4b7700162469edb9e725b220cb72dea7869806246b50e5c159c84c1e4",
	name: "listTasks",
	filename: "src/lib/server/people.ts"
}, (opts) => listTasks.__executeServer(opts));
var listTasks = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTasks_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select t.id, t.title, t.description, t.staff_id, s.full_name as staff_name,
             t.client_id, t.property_id, t.priority, t.status, t.due_date, t.created_at
      from tasks t
      left join staff s on s.id = t.staff_id
      where t.user_id = ${access.ownerId}
        and (${access.role === "admin"} or t.staff_id = ${access.staffId ?? 0})
      order by case t.status when 'blocked' then 0 when 'doing' then 1 when 'todo' then 2 else 3 end,
               t.due_date nulls last
    `).map((t) => ({
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
		createdAt: tsStr(t.created_at) ?? ""
	}));
});
var upsertTask_createServerFn_handler = createServerRpc({
	id: "fe154cb5e78d6438eeaf2df2306295ccb0373d3d6fcf54cdc9c2d2d32c41965d",
	name: "upsertTask",
	filename: "src/lib/server/people.ts"
}, (opts) => upsertTask.__executeServer(opts));
var upsertTask = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertTask_createServerFn_handler, async ({ context, data }) => {
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
	return { id: (await sql`
      insert into tasks (user_id, title, description, staff_id, priority, status, due_date)
      values (
        ${access.ownerId}, ${title}, ${data.description ?? null}, ${data.staffId ?? null},
        ${data.priority}, ${data.status}, ${data.dueDate ?? null}
      ) returning id
    `)[0].id };
});
var listReviews_createServerFn_handler = createServerRpc({
	id: "7e7488ad3a89e002aadc4376594be764dfd3000b1d9a73089689b43408b4608b",
	name: "listReviews",
	filename: "src/lib/server/people.ts"
}, (opts) => listReviews.__executeServer(opts));
var listReviews = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listReviews_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select r.id, r.staff_id, s.full_name as staff_name, s.department, r.period_label,
             r.deals_closed, r.listings_won, r.attendance_score, r.client_score, r.overall_score, r.notes
      from performance_reviews r
      join staff s on s.id = r.staff_id
      where r.user_id = ${access.ownerId}
        and (${access.role === "admin"} or r.staff_id = ${access.staffId ?? 0})
      order by s.full_name
    `).map((r) => ({
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
		notes: r.notes
	}));
});
var upsertReview_createServerFn_handler = createServerRpc({
	id: "b116b3a6538dda78c590771d4d7c3baad2ff09e555e26cc9a566f49463311ed2",
	name: "upsertReview",
	filename: "src/lib/server/people.ts"
}, (opts) => upsertReview.__executeServer(opts));
var upsertReview = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertReview_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	const overall = Math.round(data.attendanceScore * .3 + data.clientScore * .4 + Math.min(100, data.dealsClosed * 8 + data.listingsWon * 4) * .3);
	await (await getSql())`
      insert into performance_reviews (
        user_id, staff_id, period_label, deals_closed, listings_won, attendance_score, client_score, overall_score, notes
      ) values (
        ${access.ownerId}, ${data.staffId}, ${data.periodLabel.trim()}, ${data.dealsClosed}, ${data.listingsWon},
        ${data.attendanceScore}, ${data.clientScore}, ${overall}, ${data.notes ?? null}
      )
    `;
	return { overall };
});
//#endregion
export { clockToday_createServerFn_handler, listAttendance_createServerFn_handler, listLeave_createServerFn_handler, listPayroll_createServerFn_handler, listReviews_createServerFn_handler, listStaff_createServerFn_handler, listTasks_createServerFn_handler, processPayroll_createServerFn_handler, requestLeave_createServerFn_handler, reviewLeave_createServerFn_handler, setAttendance_createServerFn_handler, upsertReview_createServerFn_handler, upsertStaff_createServerFn_handler, upsertTask_createServerFn_handler };
