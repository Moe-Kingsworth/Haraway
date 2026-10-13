import type { Role } from "./constants";

export type MemberRole = Role;

export type Workspace = {
  userId: string;
  companyName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  rcNumber: string;
};

export type Access = {
  userId: string;
  ownerId: string;
  role: Role;
  isAdmin: boolean;
  isFounderAccount: boolean;
  staffId: number | null;
  displayName: string;
  email: string;
  workspace: Workspace;
};

export type Staff = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  department: string;
  employmentType: string;
  salaryNgn: number;
  hireDate: string;
  status: string;
  isOwner: boolean;
  isFounderAccount: boolean;
  is_founder_account: boolean;
  mustChangePassword: boolean;
  must_change_password: boolean;
  employeeId?: string | null;
  position?: string | null;
  bankName: string | null;
  accountNumber: string | null;
  notes: string | null;
};

export type AttendanceRow = {
  id: number;
  staffId: number;
  staffName: string;
  workDate: string;
  clockIn: string | null;
  clockOut: string | null;
  status: string;
  notes: string | null;
};

export type LeaveRow = {
  id: number;
  staffId: number;
  staffName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: string;
  reason: string | null;
};

export type PayrollRun = {
  id: number;
  periodYear: number;
  periodMonth: number;
  status: string;
  processedAt: string | null;
};

export type Payslip = {
  id: number;
  runId: number;
  staffId: number;
  staffName: string;
  department: string;
  basicNgn: number;
  allowanceNgn: number;
  deductionNgn: number;
  netNgn: number;
  periodYear: number;
  periodMonth: number;
  runStatus: string;
};

export type TaskRow = {
  id: number;
  title: string;
  description: string | null;
  staffId: number | null;
  staffName: string | null;
  clientId: number | null;
  propertyId: number | null;
  priority: string;
  status: string;
  dueDate: string | null;
  createdAt: string;
};

export type Review = {
  id: number;
  staffId: number;
  staffName: string;
  department: string;
  periodLabel: string;
  dealsClosed: number;
  listingsWon: number;
  attendanceScore: number;
  clientScore: number;
  overallScore: number;
  notes: string | null;
};

export type Client = {
  id: number;
  fullName: string;
  email: string | null;
  phone: string;
  type: string;
  stage: string;
  source: string | null;
  assignedStaffId: number | null;
  assignedStaffName: string | null;
  notes: string | null;
  createdAt: string;
};

export type Property = {
  id: number;
  title: string;
  district: string;
  address: string;
  type: string;
  status: string;
  bedrooms: number | null;
  bathrooms: number | null;
  sizeSqm: number | null;
  priceNgn: number;
  description: string | null;
};

export type Deal = {
  id: number;
  reference: string;
  clientId: number;
  clientName: string;
  propertyId: number;
  propertyTitle: string;
  propertyAddress: string;
  staffId: number | null;
  staffName: string | null;
  kind: string;
  offerNgn: number;
  status: string;
  paymentPlan: string | null;
  issuedAt: string | null;
  notes: string | null;
  paidNgn: number;
};

export type Payment = {
  id: number;
  receiptNo: string;
  dealId: number | null;
  dealReference: string | null;
  clientId: number;
  clientName: string;
  amountNgn: number;
  method: string;
  paidAt: string;
  narration: string | null;
};

export type DashboardData = {
  presentToday: number;
  staffCount: number;
  openTasks: number;
  overdueTasks: number;
  pipelineNgn: number;
  monthReceiptsNgn: number;
  pendingLeave: number;
  reservedProperties: number;
  inOffice: { id: number; name: string; role: Role; status: string; clockIn: string | null }[];
  collections: { month: string; amount: number }[];
  recentPayments: Payment[];
  attention: { kind: string; title: string; href: string }[];
};

export type AuditLogEntry = {
  id: number;
  actorName: string;
  action: string;
  target: string;
  timestamp: string;
  details?: Record<string, string | number | boolean | null> | null;
};

export type SuperAdminAttendanceRow = {
  id?: number | null;
  staffId: number;
  name: string;
  department: string;
  clockIn: string | null;
  clockOut: string | null;
  status: "Complete" | "Incomplete" | "Absent" | "On Leave";
};

export type SuperAdminDashboardData = {
  attendanceRows: SuperAdminAttendanceRow[];
  summary: {
    totalPresent: number;
    totalAbsent: number;
    incomplete: number;
    onLeave: number;
  };
  auditLogs: AuditLogEntry[];
  staffSummary: {
    totalActive: number;
    suspended: number;
    createdThisMonth: number;
  };
};

export type JobPosting = {
  id: string;
  title: string;
  department: string;
  employmentType: string;
  location: string;
  description: string;
  requirements: string;
  responsibilities: string;
  status: "draft" | "published" | "unpublished";
  createdBy?: number | null;
  createdAt: string;
  applicationsCount?: number;
};

export type JobApplication = {
  id: string;
  jobPostingId: string;
  jobTitle?: string;
  jobDepartment?: string;
  fullName: string;
  email: string;
  phone: string;
  yearsExperience: number;
  currentJobTitle: string;
  coverLetter: string;
  cvUrl: string;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  referralSource: string;
  status:
    | "applied"
    | "under_review"
    | "shortlisted"
    | "interview_scheduled"
    | "interview_done"
    | "selected"
    | "rejected"
    | "onboarded";
  internalNotes?: string | null;
  interviewDate?: string | null;
  interviewFormat?: string | null;
  rejectionReason?: string | null;
  convertedToStaffId?: number | null;
  createdAt: string;
};
