export type MemberRole = "admin" | "staff";

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
  role: MemberRole;
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
  role: string;
  department: string;
  employmentType: string;
  salaryNgn: number;
  hireDate: string;
  status: string;
  isOwner: boolean;
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
  inOffice: { id: number; name: string; role: string; status: string; clockIn: string | null }[];
  collections: { month: string; amount: number }[];
  recentPayments: Payment[];
  attention: { kind: string; title: string; href: string }[];
};
