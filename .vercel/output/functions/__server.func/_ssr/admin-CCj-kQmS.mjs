import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Yj8VJyDF.mjs";
import { r as getSql } from "./db-BUKlVvsz.mjs";
import { u as todayWAT } from "./format-DRMnNg8r.mjs";
import { n as supabaseAdmin } from "./supabase-CCDJo-Xx.mjs";
import { l as resolveAccess, n as assertNotFounder, s as mapStaff, t as assertAdmin, u as tsStr } from "./access-DIVfVghL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CCj-kQmS.js
async function logAuditEvent(actorName, action, target, details = {}) {
	try {
		await (await getSql())`
      insert into audit_log (actor_name, action, target, timestamp, details)
      values (${actorName}, ${action}, ${target}, now(), ${JSON.stringify(details)}::jsonb)
    `;
	} catch (err) {
		console.error("[audit_log] failed to record event:", err);
	}
}
var getSuperAdminDashboard_createServerFn_handler = createServerRpc({
	id: "b9560c25616c29988c96cc9fa2d984adcd496a36fd9751c1cca10c77098a3347",
	name: "getSuperAdminDashboard",
	filename: "src/lib/server/admin.ts"
}, (opts) => getSuperAdminDashboard.__executeServer(opts));
var getSuperAdminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getSuperAdminDashboard_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	const sql = await getSql();
	const today = todayWAT();
	const activeStaff = await sql`
      select id, full_name, department
      from staff
      where user_id = ${access.ownerId} and status = 'active'
      order by department, full_name
    `;
	const todayAttendance = await sql`
      select id, staff_id, clock_in, clock_out, status
      from attendance
      where user_id = ${access.ownerId} and work_date = ${today}::date
    `;
	const activeLeaves = await sql`
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
	const attendanceRows = activeStaff.map((s) => {
		const att = attMap.get(s.id);
		const onLeave = leaveSet.has(s.id);
		let status = "Absent";
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
			status
		};
	});
	const auditLogs = (await sql`
      select id, actor_name, action, target, timestamp, details
      from audit_log
      order by timestamp desc
      limit 10
    `).map((l) => ({
		id: l.id,
		actorName: l.actor_name,
		action: l.action,
		target: l.target,
		timestamp: tsStr(l.timestamp) ?? (/* @__PURE__ */ new Date()).toISOString(),
		details: typeof l.details === "object" ? l.details : null
	}));
	const counts = (await sql`
      select
        count(*) filter (where status = 'active')::int as total_active,
        count(*) filter (where status = 'suspended')::int as suspended,
        count(*) filter (where created_at >= date_trunc('month', now()))::int as created_month
      from staff
      where user_id = ${access.ownerId}
    `)[0] ?? {
		total_active: 0,
		suspended: 0,
		created_month: 0
	};
	return {
		attendanceRows,
		summary: {
			totalPresent: completeCount + incompleteCount,
			totalAbsent: absentCount,
			incomplete: incompleteCount,
			onLeave: onLeaveCount
		},
		auditLogs,
		staffSummary: {
			totalActive: Number(counts.total_active || 0),
			suspended: Number(counts.suspended || 0),
			createdThisMonth: Number(counts.created_month || 0)
		}
	};
});
var listUsers_createServerFn_handler = createServerRpc({
	id: "8ff428842bb49781522d3045308fc4b9413c4565e4912c7391c8e5ad80c3b07b",
	name: "listUsers",
	filename: "src/lib/server/admin.ts"
}, (opts) => listUsers.__executeServer(opts));
var listUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listUsers_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	return (await (await getSql())`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password, bank_name, account_number, notes,
             employee_id, position
      from staff
      where user_id = ${access.ownerId}
      order by is_founder_account desc, is_owner desc, full_name
    `).map(mapStaff);
});
var createUser_createServerFn_handler = createServerRpc({
	id: "64ea221a9e5cb1d1cc13c71b854471ab66a2865bf645f4fa05ff165b84a8e841",
	name: "createUser",
	filename: "src/lib/server/admin.ts"
}, (opts) => createUser.__executeServer(opts));
var createUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createUser_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "super_admin") throw new Error("Only Super Admins can create new user accounts.");
	const sql = await getSql();
	const fullName = data.fullName.trim();
	const email = data.email.trim().toLowerCase();
	const phone = data.phone.trim();
	const employeeId = data.employeeId.trim();
	const position = data.position.trim();
	const password = data.temporaryPassword.trim();
	if (!fullName || !email || !password) throw new Error("Full name, email, and temporary password are required.");
	if ((await sql`
      select id from staff where lower(email) = ${email} limit 1
    `)[0]) throw new Error(`A staff member with email "${email}" already exists.`);
	let authUserId = "";
	const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: { full_name: fullName }
	});
	if (authError || !authData.user) {
		const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
		const match = existingUser?.users?.find((u) => u.email?.toLowerCase() === email);
		if (match) {
			authUserId = match.id;
			await supabaseAdmin.auth.admin.updateUserById(authUserId, { password });
		} else throw new Error(authError?.message || "Failed to create Supabase Auth user.");
	} else authUserId = authData.user.id;
	const staffId = (await sql`
      insert into staff (
        user_id, full_name, email, phone, role, department, employment_type,
        salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password,
        employee_id, position
      ) values (
        ${access.ownerId}, ${fullName}, ${email}, ${phone}, ${data.role}, ${data.department}, ${"Full-time"},
        ${5e5}, now()::date, ${data.status || "active"}, false, false, true,
        ${employeeId || `ES-${Date.now().toString().slice(-4)}`}, ${position || "Associate"}
      ) returning id
    `)[0].id;
	await sql`
      insert into memberships (user_id, company_owner_id, staff_id, role)
      values (${authUserId}, ${access.ownerId}, ${staffId}, ${data.role})
      on conflict (user_id) do update set staff_id = excluded.staff_id, role = excluded.role
    `;
	await logAuditEvent(access.displayName, "Create User", fullName, {
		staffId,
		email,
		role: data.role,
		department: data.department,
		employeeId
	});
	return {
		ok: true,
		staffId
	};
});
var editUser_createServerFn_handler = createServerRpc({
	id: "0c060563768423c0c20455891f0e8994b29b568a07660fc6243713ad323e34ce",
	name: "editUser",
	filename: "src/lib/server/admin.ts"
}, (opts) => editUser.__executeServer(opts));
var editUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(editUser_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "super_admin") throw new Error("Only Super Admins can edit users.");
	const sql = await getSql();
	const targetRows = await sql`
      select id, full_name, email, phone, role, department, employment_type,
             salary_ngn, hire_date, status, is_owner, is_founder_account, must_change_password, bank_name, account_number, notes,
             employee_id, position
      from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
	if (!targetRows[0]) throw new Error("User not found.");
	const target = mapStaff(targetRows[0]);
	if (target.isFounderAccount) {
		if (target.role !== data.role) assertNotFounder(target, "change the role of");
		if (target.status !== data.status && data.status !== "active") assertNotFounder(target, "suspend");
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
		old: {
			role: target.role,
			department: target.department,
			status: target.status,
			position: target.position
		},
		new: {
			role: data.role,
			department: data.department,
			status: data.status,
			position: data.position
		}
	});
	return { ok: true };
});
var suspendUser_createServerFn_handler = createServerRpc({
	id: "d5d56a865f6ffd5858b2087a1366d75d09971025d3a367eae997b5adab9ec704",
	name: "suspendUser",
	filename: "src/lib/server/admin.ts"
}, (opts) => suspendUser.__executeServer(opts));
var suspendUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(suspendUser_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "super_admin") throw new Error("Only Super Admins can suspend users.");
	const sql = await getSql();
	const targetRows = await sql`
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
var reactivateUser_createServerFn_handler = createServerRpc({
	id: "26b3bd94bbc1be973103ac16fc68cf889a08656eace8ac04ca0c9caaf62c781e",
	name: "reactivateUser",
	filename: "src/lib/server/admin.ts"
}, (opts) => reactivateUser.__executeServer(opts));
var reactivateUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(reactivateUser_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "super_admin") throw new Error("Only Super Admins can reactivate users.");
	const sql = await getSql();
	const targetRows = await sql`
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
var resetUserPassword_createServerFn_handler = createServerRpc({
	id: "dcbe79a1566b9bf039eea75f955c6727d3fdc8e144f84bf2b780aec4c1d6f02b",
	name: "resetUserPassword",
	filename: "src/lib/server/admin.ts"
}, (opts) => resetUserPassword.__executeServer(opts));
var resetUserPassword = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(resetUserPassword_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "super_admin") throw new Error("Only Super Admins can reset user passwords.");
	const sql = await getSql();
	const targetRows = await sql`
      select id, full_name, email from staff where id = ${data.id} and user_id = ${access.ownerId}
    `;
	if (!targetRows[0]) throw new Error("User not found.");
	const target = targetRows[0];
	const tempPassword = data.temporaryPassword?.trim() || `EdenPass#${Math.floor(1e3 + Math.random() * 9e3)}`;
	try {
		const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
		const match = usersData?.users?.find((u) => u.email?.toLowerCase() === target.email.toLowerCase());
		if (match) await supabaseAdmin.auth.admin.updateUserById(match.id, { password: tempPassword });
	} catch (e) {
		console.warn("Could not update auth user directly:", e);
	}
	await sql`
      update staff set must_change_password = true
      where id = ${data.id} and user_id = ${access.ownerId}
    `;
	await logAuditEvent(access.displayName, "Reset Password", target.full_name, { staffId: data.id });
	return {
		ok: true,
		temporaryPassword: tempPassword
	};
});
var promoteSuperAdmin_createServerFn_handler = createServerRpc({
	id: "9a69974c1232130ccbcfe37bf9e490456de619e98937fcac8bc3ed3e7bdaba37",
	name: "promoteSuperAdmin",
	filename: "src/lib/server/admin.ts"
}, (opts) => promoteSuperAdmin.__executeServer(opts));
var promoteSuperAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(promoteSuperAdmin_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "super_admin") throw new Error("Only Super Admins can promote users.");
	const sql = await getSql();
	const targetRows = await sql`
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
var listAuditLogs_createServerFn_handler = createServerRpc({
	id: "cefd777af2826db44231a01cba14377bee9dded3bb723f6de53499bba419454e",
	name: "listAuditLogs",
	filename: "src/lib/server/admin.ts"
}, (opts) => listAuditLogs.__executeServer(opts));
var listAuditLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(listAuditLogs_createServerFn_handler, async ({ context, data }) => {
	if ((await resolveAccess(context.userId)).role !== "super_admin") throw new Error("Only Super Admins can view audit logs.");
	const sql = await getSql();
	const page = Math.max(1, data.page || 1);
	const limit = Math.min(100, Math.max(1, data.limit || 20));
	const offset = (page - 1) * limit;
	const actionFilter = data.actionType?.trim();
	const startFilter = data.startDate?.trim();
	const endFilter = data.endDate?.trim();
	const rows = await sql`
      select id, actor_name, action, target, timestamp, details
      from audit_log
      where (${!actionFilter} or action = ${actionFilter || ""})
        and (${!startFilter} or timestamp >= ${startFilter || "1970-01-01"}::timestamptz)
        and (${!endFilter} or timestamp <= ${endFilter ? `${endFilter}T23:59:59Z` : "9999-12-31"}::timestamptz)
      order by timestamp desc
      limit ${limit} offset ${offset}
    `;
	const countRes = await sql`
      select count(*)::int as count
      from audit_log
      where (${!actionFilter} or action = ${actionFilter || ""})
        and (${!startFilter} or timestamp >= ${startFilter || "1970-01-01"}::timestamptz)
        and (${!endFilter} or timestamp <= ${endFilter ? `${endFilter}T23:59:59Z` : "9999-12-31"}::timestamptz)
    `;
	const totalCount = Number(countRes[0]?.count || 0);
	return {
		rows: rows.map((r) => ({
			id: r.id,
			actorName: r.actor_name,
			action: r.action,
			target: r.target,
			timestamp: tsStr(r.timestamp) ?? (/* @__PURE__ */ new Date()).toISOString(),
			details: typeof r.details === "object" ? r.details : null
		})),
		totalCount,
		page,
		totalPages: Math.max(1, Math.ceil(totalCount / limit))
	};
});
//#endregion
export { createUser_createServerFn_handler, editUser_createServerFn_handler, getSuperAdminDashboard_createServerFn_handler, listAuditLogs_createServerFn_handler, listUsers_createServerFn_handler, promoteSuperAdmin_createServerFn_handler, reactivateUser_createServerFn_handler, resetUserPassword_createServerFn_handler, suspendUser_createServerFn_handler };
