import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as authMiddleware } from "./middleware-Yj8VJyDF.mjs";
import { r as getSql } from "./db-BUKlVvsz.mjs";
import { n as supabaseAdmin } from "./supabase-CCDJo-Xx.mjs";
import { l as resolveAccess, u as tsStr } from "./access-DIVfVghL.mjs";
import { o as logAuditEvent } from "./admin-DtxWFnV4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs-CfbJ2nDo.js
var getPublicJobPostings_createServerFn_handler = createServerRpc({
	id: "c4b8b0e5b5b990f6fc6cda2ba57a3fa8ecb713c6e043a66708bb68e70e444ffb",
	name: "getPublicJobPostings",
	filename: "src/lib/server/jobs.ts"
}, (opts) => getPublicJobPostings.__executeServer(opts));
var getPublicJobPostings = createServerFn({ method: "GET" }).handler(getPublicJobPostings_createServerFn_handler, async () => {
	return (await (await getSql())`
      select id, title, department, employment_type, location,
             description, requirements, responsibilities, status,
             created_by, created_at
      from job_postings
      where status = 'published'
      order by created_at desc
    `).map((r) => ({
		id: r.id,
		title: r.title,
		department: r.department,
		employmentType: r.employment_type,
		location: r.location || "Abuja, Nigeria",
		description: r.description || "",
		requirements: r.requirements || "",
		responsibilities: r.responsibilities || "",
		status: r.status,
		createdBy: r.created_by,
		createdAt: tsStr(r.created_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	}));
});
var getPublicJobPostingById_createServerFn_handler = createServerRpc({
	id: "f16cc6c9cd451a8e6328490c99401dbdf485641809de12c097a489753974dce2",
	name: "getPublicJobPostingById",
	filename: "src/lib/server/jobs.ts"
}, (opts) => getPublicJobPostingById.__executeServer(opts));
var getPublicJobPostingById = createServerFn({ method: "GET" }).validator((input) => input).handler(getPublicJobPostingById_createServerFn_handler, async ({ data }) => {
	const rows = await (await getSql())`
      select id, title, department, employment_type, location,
             description, requirements, responsibilities, status,
             created_by, created_at
      from job_postings
      where id = ${data.id}::uuid and status = 'published'
      limit 1
    `;
	if (!rows[0]) return null;
	const r = rows[0];
	return {
		id: r.id,
		title: r.title,
		department: r.department,
		employmentType: r.employment_type,
		location: r.location || "Abuja, Nigeria",
		description: r.description || "",
		requirements: r.requirements || "",
		responsibilities: r.responsibilities || "",
		status: r.status,
		createdBy: r.created_by,
		createdAt: tsStr(r.created_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	};
});
var submitPublicJobApplication_createServerFn_handler = createServerRpc({
	id: "819bdd40f71dfd9f5459f2717a35ab8271f2496be8508dbe95c77e361feef0cf",
	name: "submitPublicJobApplication",
	filename: "src/lib/server/jobs.ts"
}, (opts) => submitPublicJobApplication.__executeServer(opts));
var submitPublicJobApplication = createServerFn({ method: "POST" }).validator((input) => input).handler(submitPublicJobApplication_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const posting = await sql`
      select id, title from job_postings where id = ${data.jobPostingId}::uuid limit 1
    `;
	if (!posting[0]) throw new Error("Job posting not found or no longer open.");
	const inserted = await sql`
      insert into job_applications (
        job_posting_id, full_name, email, phone, years_experience,
        current_job_title, cover_letter, cv_url, linkedin_url, portfolio_url,
        referral_source, status, created_at
      ) values (
        ${data.jobPostingId}::uuid, ${data.fullName.trim()}, ${data.email.trim().toLowerCase()},
        ${data.phone.trim()}, ${Number(data.yearsExperience) || 0}, ${data.currentJobTitle.trim()},
        ${data.coverLetter.trim()}, ${data.cvUrl.trim()}, ${data.linkedinUrl?.trim() || null},
        ${data.portfolioUrl?.trim() || null}, ${data.referralSource || "Website"}, 'applied', now()
      )
      returning id
    `;
	await logAuditEvent("Candidate Portal", "Submit Application", `${data.fullName} (${posting[0].title})`, {
		email: data.email,
		jobPostingId: data.jobPostingId
	});
	return {
		ok: true,
		applicationId: inserted[0].id,
		message: "Application submitted! We'll be in touch within 5 working days."
	};
});
var listJobPostings_createServerFn_handler = createServerRpc({
	id: "f68a4c4a5abb78ab3df508212b6f2ca31027da7ebf060d2621d39377bff00acb",
	name: "listJobPostings",
	filename: "src/lib/server/jobs.ts"
}, (opts) => listJobPostings.__executeServer(opts));
var listJobPostings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listJobPostings_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	if (![
		"super_admin",
		"hr_admin",
		"executive"
	].includes(access.role)) throw new Error("Only HR and Admins can view job postings.");
	return (await (await getSql())`
      select p.id, p.title, p.department, p.employment_type, p.location,
             p.description, p.requirements, p.responsibilities, p.status,
             p.created_by, p.created_at,
             count(a.id)::int as apps_count
      from job_postings p
      left join job_applications a on a.job_posting_id = p.id
      group by p.id
      order by p.created_at desc
    `).map((r) => ({
		id: r.id,
		title: r.title,
		department: r.department,
		employmentType: r.employment_type,
		location: r.location || "Abuja, Nigeria",
		description: r.description || "",
		requirements: r.requirements || "",
		responsibilities: r.responsibilities || "",
		status: r.status,
		createdBy: r.created_by,
		createdAt: tsStr(r.created_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
		applicationsCount: Number(r.apps_count || 0)
	}));
});
var upsertJobPosting_createServerFn_handler = createServerRpc({
	id: "d4c6ec975cfeeec9fbc8896155661a5a5e3a8d1280150b2bcf6c9a1cbd1f8446",
	name: "upsertJobPosting",
	filename: "src/lib/server/jobs.ts"
}, (opts) => upsertJobPosting.__executeServer(opts));
var upsertJobPosting = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertJobPosting_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (!["super_admin", "hr_admin"].includes(access.role)) throw new Error("Only HR/Admin and Super Admin can manage job postings.");
	const sql = await getSql();
	const location = data.location?.trim() || "Abuja, Nigeria";
	if (data.id) {
		await sql`
        update job_postings set
          title = ${data.title.trim()},
          department = ${data.department},
          employment_type = ${data.employmentType},
          location = ${location},
          description = ${data.description.trim()},
          requirements = ${data.requirements.trim()},
          responsibilities = ${data.responsibilities.trim()},
          status = ${data.status}
        where id = ${data.id}::uuid
      `;
		await logAuditEvent(access.displayName, "Update Job Posting", data.title, {
			postingId: data.id,
			status: data.status
		});
		return { id: data.id };
	}
	const inserted = await sql`
      insert into job_postings (
        title, department, employment_type, location,
        description, requirements, responsibilities, status,
        created_by, created_at
      ) values (
        ${data.title.trim()}, ${data.department}, ${data.employmentType}, ${location},
        ${data.description.trim()}, ${data.requirements.trim()}, ${data.responsibilities.trim()},
        ${data.status}, ${access.staffId}, now()
      )
      returning id
    `;
	await logAuditEvent(access.displayName, "Create Job Posting", data.title, {
		postingId: inserted[0].id,
		status: data.status
	});
	return { id: inserted[0].id };
});
var deleteJobPosting_createServerFn_handler = createServerRpc({
	id: "ddc0e15c8fa3da28ed90c8f7e30dbb4bf6d0ccc9f46f81f1a9af714a464d1021",
	name: "deleteJobPosting",
	filename: "src/lib/server/jobs.ts"
}, (opts) => deleteJobPosting.__executeServer(opts));
var deleteJobPosting = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(deleteJobPosting_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (!["super_admin", "hr_admin"].includes(access.role)) throw new Error("Only HR/Admin and Super Admin can delete job postings.");
	const sql = await getSql();
	const existing = await sql`
      select title from job_postings where id = ${data.id}::uuid limit 1
    `;
	await sql`delete from job_postings where id = ${data.id}::uuid`;
	await logAuditEvent(access.displayName, "Delete Job Posting", existing[0]?.title || data.id, { postingId: data.id });
	return { ok: true };
});
var listJobApplications_createServerFn_handler = createServerRpc({
	id: "2f058fec73a45b26298be15d26fd140a02f91ace744e4e9a9a700a9539f84e7b",
	name: "listJobApplications",
	filename: "src/lib/server/jobs.ts"
}, (opts) => listJobApplications.__executeServer(opts));
var listJobApplications = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(listJobApplications_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (![
		"super_admin",
		"hr_admin",
		"executive"
	].includes(access.role)) throw new Error("Access denied to job applications.");
	const sql = await getSql();
	const posFilter = data.position?.trim();
	const statusFilter = data.status?.trim();
	const startFilter = data.startDate?.trim();
	const endFilter = data.endDate?.trim();
	const searchFilter = data.search?.trim().toLowerCase();
	return (await sql`
      select a.id, a.job_posting_id, p.title as job_title, p.department as job_department,
             a.full_name, a.email, a.phone, a.years_experience, a.current_job_title,
             a.cover_letter, a.cv_url, a.linkedin_url, a.portfolio_url, a.referral_source,
             a.status, a.internal_notes, a.interview_date, a.interview_format,
             a.rejection_reason, a.converted_to_staff_id, a.created_at
      from job_applications a
      left join job_postings p on p.id = a.job_posting_id
      where (${!posFilter} or p.title = ${posFilter || ""})
        and (${!statusFilter} or a.status = ${statusFilter || ""})
        and (${!startFilter} or a.created_at >= ${startFilter || "1970-01-01"}::timestamptz)
        and (${!endFilter} or a.created_at <= ${endFilter ? `${endFilter}T23:59:59Z` : "9999-12-31"}::timestamptz)
        and (${!searchFilter} or lower(a.full_name) like ${`%${searchFilter || ""}%`} or lower(a.email) like ${`%${searchFilter || ""}%`})
      order by a.created_at desc
    `).map((r) => ({
		id: r.id,
		jobPostingId: r.job_posting_id,
		jobTitle: r.job_title ?? "General Application",
		jobDepartment: r.job_department ?? "Operations",
		fullName: r.full_name,
		email: r.email,
		phone: r.phone,
		yearsExperience: Number(r.years_experience || 0),
		currentJobTitle: r.current_job_title || "",
		coverLetter: r.cover_letter || "",
		cvUrl: r.cv_url,
		linkedinUrl: r.linkedin_url,
		portfolioUrl: r.portfolio_url,
		referralSource: r.referral_source,
		status: r.status,
		internalNotes: r.internal_notes,
		interviewDate: tsStr(r.interview_date),
		interviewFormat: r.interview_format,
		rejectionReason: r.rejection_reason,
		convertedToStaffId: r.converted_to_staff_id,
		createdAt: tsStr(r.created_at) ?? (/* @__PURE__ */ new Date()).toISOString()
	}));
});
var updateApplicationStatus_createServerFn_handler = createServerRpc({
	id: "a69f0fe4e480becee71d673c966c34f27d213ca89bff661d89a2428f30dfebe0",
	name: "updateApplicationStatus",
	filename: "src/lib/server/jobs.ts"
}, (opts) => updateApplicationStatus.__executeServer(opts));
var updateApplicationStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(updateApplicationStatus_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (![
		"super_admin",
		"hr_admin",
		"executive"
	].includes(access.role)) throw new Error("Access denied.");
	const sql = await getSql();
	const existing = await sql`
      select full_name, status from job_applications where id = ${data.id}::uuid limit 1
    `;
	if (!existing[0]) throw new Error("Application not found.");
	if (data.status === "rejected" && !data.rejectionReason?.trim()) throw new Error("A rejection reason is mandatory when marking as rejected.");
	await sql`
      update job_applications set
        status = ${data.status},
        internal_notes = ${data.internalNotes?.trim() ?? null},
        interview_date = ${data.interviewDate ? `${data.interviewDate}::timestamptz` : null},
        interview_format = ${data.interviewFormat?.trim() ?? null},
        rejection_reason = ${data.rejectionReason?.trim() ?? null}
      where id = ${data.id}::uuid
    `;
	await logAuditEvent(access.displayName, "Update Application Status", existing[0].full_name, {
		applicationId: data.id,
		fromStatus: existing[0].status,
		toStatus: data.status,
		interviewFormat: data.interviewFormat,
		rejectionReason: data.rejectionReason
	});
	return { ok: true };
});
var convertApplicationToStaff_createServerFn_handler = createServerRpc({
	id: "69fa6ce9ae19fc55a5745705209d45bac5d7117309a0a1e07e7064eeecfc920a",
	name: "convertApplicationToStaff",
	filename: "src/lib/server/jobs.ts"
}, (opts) => convertApplicationToStaff.__executeServer(opts));
var convertApplicationToStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(convertApplicationToStaff_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (!["super_admin", "hr_admin"].includes(access.role)) throw new Error("Only HR/Admin and Super Admin can convert candidates to staff.");
	const sql = await getSql();
	const email = data.email.trim().toLowerCase();
	const fullName = data.fullName.trim();
	const phone = data.phone.trim();
	const password = data.temporaryPassword.trim();
	const employeeId = data.employeeId?.trim() || `ES-${Date.now().toString().slice(-4)}`;
	if (!fullName || !email || !password) throw new Error("Full name, email, and temporary password are required.");
	let authUserId = "";
	const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: { full_name: fullName }
	});
	if (authError || !authData.user) {
		const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
		const match = usersData?.users?.find((u) => u.email?.toLowerCase() === email);
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
        ${access.ownerId}, ${fullName}, ${email}, ${phone}, ${data.role || "staff"}, ${data.department}, ${"Full-time"},
        ${5e5}, now()::date, 'active', false, false, true,
        ${employeeId}, ${data.position.trim()}
      ) returning id
    `)[0].id;
	await sql`
      insert into memberships (user_id, company_owner_id, staff_id, role)
      values (${authUserId}, ${access.ownerId}, ${staffId}, ${data.role || "staff"})
      on conflict (user_id) do update set staff_id = excluded.staff_id, role = excluded.role
    `;
	await sql`
      update job_applications set
        status = 'onboarded',
        converted_to_staff_id = ${staffId}
      where id = ${data.applicationId}::uuid
    `;
	await logAuditEvent(access.displayName, "Convert to Staff", fullName, {
		applicationId: data.applicationId,
		staffId,
		department: data.department,
		position: data.position,
		role: data.role
	});
	return {
		ok: true,
		staffId,
		fullName
	};
});
//#endregion
export { convertApplicationToStaff_createServerFn_handler, deleteJobPosting_createServerFn_handler, getPublicJobPostingById_createServerFn_handler, getPublicJobPostings_createServerFn_handler, listJobApplications_createServerFn_handler, listJobPostings_createServerFn_handler, submitPublicJobApplication_createServerFn_handler, updateApplicationStatus_createServerFn_handler, upsertJobPosting_createServerFn_handler };
