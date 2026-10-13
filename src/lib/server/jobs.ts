import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { type Role } from "@/lib/constants";
import { getSql } from "@/lib/db";
import { supabaseAdmin } from "@/lib/supabase";
import type { JobApplication, JobPosting } from "@/lib/types";
import { resolveAccess, tsStr } from "./access";
import { logAuditEvent } from "./admin";

// ==================== PUBLIC CAREERS FUNCTIONS (NO AUTH) ====================

export const getPublicJobPostings = createServerFn({ method: "GET" }).handler(
  async (): Promise<JobPosting[]> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      title: string;
      department: string;
      employment_type: string;
      location: string;
      description: string;
      requirements: string;
      responsibilities: string;
      status: string;
      created_by: number | null;
      created_at: unknown;
    }>`
      select id, title, department, employment_type, location,
             description, requirements, responsibilities, status,
             created_by, created_at
      from job_postings
      where status = 'published'
      order by created_at desc
    `;

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      department: r.department,
      employmentType: r.employment_type,
      location: r.location || "Abuja, Nigeria",
      description: r.description || "",
      requirements: r.requirements || "",
      responsibilities: r.responsibilities || "",
      status: r.status as JobPosting["status"],
      createdBy: r.created_by,
      createdAt: tsStr(r.created_at) ?? new Date().toISOString(),
    }));
  },
);

export const getPublicJobPostingById = createServerFn({ method: "GET" })
  .validator((input: { id: string }) => input)
  .handler(async ({ data }): Promise<JobPosting | null> => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      title: string;
      department: string;
      employment_type: string;
      location: string;
      description: string;
      requirements: string;
      responsibilities: string;
      status: string;
      created_by: number | null;
      created_at: unknown;
    }>`
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
      status: r.status as JobPosting["status"],
      createdBy: r.created_by,
      createdAt: tsStr(r.created_at) ?? new Date().toISOString(),
    };
  });

export const submitPublicJobApplication = createServerFn({ method: "POST" })
  .validator((input: {
    jobPostingId: string;
    fullName: string;
    email: string;
    phone: string;
    yearsExperience: number;
    currentJobTitle: string;
    coverLetter: string;
    cvUrl: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    referralSource: string;
  }) => input)
  .handler(async ({ data }) => {
    const sql = await getSql();

    // Verify posting exists
    const posting = await sql<{ id: string; title: string }>`
      select id, title from job_postings where id = ${data.jobPostingId}::uuid limit 1
    `;
    if (!posting[0]) {
      throw new Error("Job posting not found or no longer open.");
    }

    const inserted = await sql<{ id: string }>`
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
      jobPostingId: data.jobPostingId,
    });

    return {
      ok: true,
      applicationId: inserted[0]!.id,
      message: "Application submitted! We'll be in touch within 5 working days.",
    };
  });

// ==================== PROTECTED JOB MANAGEMENT FUNCTIONS ====================

export const listJobPostings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }): Promise<JobPosting[]> => {
    const access = await resolveAccess(context.userId);
    if (!["super_admin", "hr_admin", "executive"].includes(access.role)) {
      throw new Error("Only HR and Admins can view job postings.");
    }

    const sql = await getSql();
    const rows = await sql<{
      id: string;
      title: string;
      department: string;
      employment_type: string;
      location: string;
      description: string;
      requirements: string;
      responsibilities: string;
      status: string;
      created_by: number | null;
      created_at: unknown;
      apps_count: number;
    }>`
      select p.id, p.title, p.department, p.employment_type, p.location,
             p.description, p.requirements, p.responsibilities, p.status,
             p.created_by, p.created_at,
             count(a.id)::int as apps_count
      from job_postings p
      left join job_applications a on a.job_posting_id = p.id
      group by p.id
      order by p.created_at desc
    `;

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      department: r.department,
      employmentType: r.employment_type,
      location: r.location || "Abuja, Nigeria",
      description: r.description || "",
      requirements: r.requirements || "",
      responsibilities: r.responsibilities || "",
      status: r.status as JobPosting["status"],
      createdBy: r.created_by,
      createdAt: tsStr(r.created_at) ?? new Date().toISOString(),
      applicationsCount: Number(r.apps_count || 0),
    }));
  });

export const upsertJobPosting = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: string;
    title: string;
    department: string;
    employmentType: string;
    location?: string;
    description: string;
    requirements: string;
    responsibilities: string;
    status: "draft" | "published" | "unpublished";
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (!["super_admin", "hr_admin"].includes(access.role)) {
      throw new Error("Only HR/Admin and Super Admin can manage job postings.");
    }

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
        status: data.status,
      });

      return { id: data.id };
    }

    const inserted = await sql<{ id: string }>`
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
      postingId: inserted[0]!.id,
      status: data.status,
    });

    return { id: inserted[0]!.id };
  });

export const deleteJobPosting = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { id: string }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (!["super_admin", "hr_admin"].includes(access.role)) {
      throw new Error("Only HR/Admin and Super Admin can delete job postings.");
    }

    const sql = await getSql();
    const existing = await sql<{ title: string }>`
      select title from job_postings where id = ${data.id}::uuid limit 1
    `;

    await sql`delete from job_postings where id = ${data.id}::uuid`;

    await logAuditEvent(access.displayName, "Delete Job Posting", existing[0]?.title || data.id, {
      postingId: data.id,
    });

    return { ok: true };
  });

// ==================== APPLICATIONS DASHBOARD FUNCTIONS ====================

export const listJobApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: {
    position?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => input)
  .handler(async ({ context, data }): Promise<JobApplication[]> => {
    const access = await resolveAccess(context.userId);
    if (!["super_admin", "hr_admin", "executive"].includes(access.role)) {
      throw new Error("Access denied to job applications.");
    }

    const sql = await getSql();
    const posFilter = data.position?.trim();
    const statusFilter = data.status?.trim();
    const startFilter = data.startDate?.trim();
    const endFilter = data.endDate?.trim();
    const searchFilter = data.search?.trim().toLowerCase();

    const rows = await sql<{
      id: string;
      job_posting_id: string;
      job_title: string | null;
      job_department: string | null;
      full_name: string;
      email: string;
      phone: string;
      years_experience: number;
      current_job_title: string;
      cover_letter: string;
      cv_url: string;
      linkedin_url: string | null;
      portfolio_url: string | null;
      referral_source: string;
      status: string;
      internal_notes: string | null;
      interview_date: unknown;
      interview_format: string | null;
      rejection_reason: string | null;
      converted_to_staff_id: number | null;
      created_at: unknown;
    }>`
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
    `;

    return rows.map((r) => ({
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
      status: r.status as JobApplication["status"],
      internalNotes: r.internal_notes,
      interviewDate: tsStr(r.interview_date),
      interviewFormat: r.interview_format,
      rejectionReason: r.rejection_reason,
      convertedToStaffId: r.converted_to_staff_id,
      createdAt: tsStr(r.created_at) ?? new Date().toISOString(),
    }));
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id: string;
    status: JobApplication["status"];
    internalNotes?: string;
    interviewDate?: string;
    interviewFormat?: string;
    rejectionReason?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (!["super_admin", "hr_admin", "executive"].includes(access.role)) {
      throw new Error("Access denied.");
    }

    const sql = await getSql();
    const existing = await sql<{ full_name: string; status: string }>`
      select full_name, status from job_applications where id = ${data.id}::uuid limit 1
    `;
    if (!existing[0]) throw new Error("Application not found.");

    if (data.status === "rejected" && !data.rejectionReason?.trim()) {
      throw new Error("A rejection reason is mandatory when marking as rejected.");
    }

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
      rejectionReason: data.rejectionReason,
    });

    return { ok: true };
  });

export const convertApplicationToStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    applicationId: string;
    fullName: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    role: Role;
    temporaryPassword: string;
    employeeId?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (!["super_admin", "hr_admin"].includes(access.role)) {
      throw new Error("Only HR/Admin and Super Admin can convert candidates to staff.");
    }

    const sql = await getSql();
    const email = data.email.trim().toLowerCase();
    const fullName = data.fullName.trim();
    const phone = data.phone.trim();
    const password = data.temporaryPassword.trim();
    const employeeId = data.employeeId?.trim() || `ES-${Date.now().toString().slice(-4)}`;

    if (!fullName || !email || !password) {
      throw new Error("Full name, email, and temporary password are required.");
    }

    // 1. Create auth account in Supabase Auth
    let authUserId = "";
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (authError || !authData.user) {
      // Find existing
      const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
      const match = usersData?.users?.find((u) => u.email?.toLowerCase() === email);
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
        ${access.ownerId}, ${fullName}, ${email}, ${phone}, ${data.role || "staff"}, ${data.department}, ${"Full-time"},
        ${500000}, now()::date, 'active', false, false, true,
        ${employeeId}, ${data.position.trim()}
      ) returning id
    `;
    const staffId = inserted[0]!.id;

    // 3. Insert membership
    await sql`
      insert into memberships (user_id, company_owner_id, staff_id, role)
      values (${authUserId}, ${access.ownerId}, ${staffId}, ${data.role || "staff"})
      on conflict (user_id) do update set staff_id = excluded.staff_id, role = excluded.role
    `;

    // 4. Update application record to onboarded and link staff id
    await sql`
      update job_applications set
        status = 'onboarded',
        converted_to_staff_id = ${staffId}
      where id = ${data.applicationId}::uuid
    `;

    // 5. Log audit event
    await logAuditEvent(access.displayName, "Convert to Staff", fullName, {
      applicationId: data.applicationId,
      staffId,
      department: data.department,
      position: data.position,
      role: data.role,
    });

    return { ok: true, staffId, fullName };
  });
