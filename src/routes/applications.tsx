import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Mail,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { DEPARTMENTS, ROLES, roleLabel, type Role } from "@/lib/constants";
import { getBootstrap } from "@/lib/server/access";
import {
  convertApplicationToStaff,
  listJobApplications,
  updateApplicationStatus,
} from "@/lib/server/jobs";
import type { JobApplication } from "@/lib/types";

export const Route = createFileRoute("/applications")({ component: ApplicationsPage });

const STATUS_STAGES: Array<{ status: JobApplication["status"]; label: string }> = [
  { status: "applied", label: "Applied" },
  { status: "under_review", label: "Under Review" },
  { status: "shortlisted", label: "Shortlisted" },
  { status: "interview_scheduled", label: "Interview Scheduled" },
  { status: "interview_done", label: "Interview Done" },
  { status: "selected", label: "Selected" },
  { status: "rejected", label: "Rejected" },
  { status: "onboarded", label: "Onboarded" },
];

function StatusBadge({ status }: { status: JobApplication["status"] }) {
  switch (status) {
    case "applied":
      return <Badge variant="outline" className="border-border">Applied</Badge>;
    case "under_review":
      return <Badge className="bg-sky-500/15 text-sky-700 border-sky-500/30">Under Review</Badge>;
    case "shortlisted":
      return <Badge className="bg-indigo-500/15 text-indigo-700 border-indigo-500/30">Shortlisted</Badge>;
    case "interview_scheduled":
      return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30">Interview Scheduled</Badge>;
    case "interview_done":
      return <Badge className="bg-purple-500/15 text-purple-700 border-purple-500/30">Interview Done</Badge>;
    case "selected":
      return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-semibold">Selected</Badge>;
    case "onboarded":
      return <Badge className="bg-primary/20 text-primary border-primary/40 font-semibold">Onboarded</Badge>;
    case "rejected":
    default:
      return <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30">Rejected</Badge>;
  }
}

function ApplicationsPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const isAllowed = ["super_admin", "hr_admin", "executive"].includes(boot.data?.access.role ?? "");

  const [search, setSearch] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);

  // Application detail action states
  const [internalNotes, setInternalNotes] = useState("");
  const [interviewDate, setInterviewDate] = useState("");
  const [interviewFormat, setInterviewFormat] = useState("In-person");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showSchedule, setShowSchedule] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  // Convert to staff modal
  const [convertOpen, setConvertOpen] = useState(false);
  const [convertName, setConvertName] = useState("");
  const [convertEmail, setConvertEmail] = useState("");
  const [convertPhone, setConvertPhone] = useState("");
  const [convertDept, setConvertDept] = useState<(typeof DEPARTMENTS)[number]>("Sales");
  const [convertPosition, setConvertPosition] = useState("");
  const [convertRole, setConvertRole] = useState<Role>("staff");
  const [convertPassword, setConvertPassword] = useState("");
  const [convertEmpId, setConvertEmpId] = useState("");

  const appsQuery = useQuery({
    queryKey: ["admin-applications", posFilter, statusFilter, startDate, endDate, search],
    queryFn: () =>
      listJobApplications({
        data: {
          position: posFilter === "all" ? undefined : posFilter,
          status: statusFilter === "all" ? undefined : statusFilter,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          search: search || undefined,
        },
      }),
    enabled: isAllowed,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (args: {
      id: string;
      status: JobApplication["status"];
      internalNotes?: string;
      interviewDate?: string;
      interviewFormat?: string;
      rejectionReason?: string;
    }) => updateApplicationStatus({ data: args }),
    onSuccess: () => {
      toast.success("Application status updated");
      void qc.invalidateQueries({ queryKey: ["admin-applications"] });
      setDetailOpen(false);
      setShowRejectDialog(false);
      setShowSchedule(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const convertMutation = useMutation({
    mutationFn: () => {
      if (!selectedApp) throw new Error("No application selected.");
      return convertApplicationToStaff({
        data: {
          applicationId: selectedApp.id,
          fullName: convertName,
          email: convertEmail,
          phone: convertPhone,
          department: convertDept,
          position: convertPosition,
          role: convertRole,
          temporaryPassword: convertPassword,
          employeeId: convertEmpId,
        },
      });
    },
    onSuccess: (res) => {
      toast.success(`${res.fullName} has been added as a staff member.`);
      void qc.invalidateQueries({ queryKey: ["admin-applications"] });
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
      setConvertOpen(false);
      setDetailOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function openDetail(app: JobApplication) {
    setSelectedApp(app);
    setInternalNotes(app.internalNotes ?? "");
    setInterviewDate(app.interviewDate ? app.interviewDate.slice(0, 16) : "");
    setInterviewFormat(app.interviewFormat ?? "In-person");
    setRejectionReason(app.rejectionReason ?? "");
    setShowSchedule(false);
    setShowRejectDialog(false);
    setDetailOpen(true);
  }

  function openConvert(app: JobApplication) {
    setSelectedApp(app);
    setConvertName(app.fullName);
    setConvertEmail(app.email);
    setConvertPhone(app.phone);
    setConvertDept(
      (DEPARTMENTS.find((d) => d === app.jobDepartment) as (typeof DEPARTMENTS)[number]) ?? "Sales",
    );
    setConvertPosition(app.jobTitle ?? "Associate");
    setConvertRole("staff");
    setConvertEmpId(`ES-${Math.floor(1000 + Math.random() * 9000)}`);
    setConvertPassword(`EdenStaff#${Math.floor(1000 + Math.random() * 9000)}`);
    setConvertOpen(true);
  }

  const applications = appsQuery.data ?? [];

  const uniquePositions = useMemo(() => {
    const set = new Set<string>();
    for (const a of applications) {
      if (a.jobTitle) set.add(a.jobTitle);
    }
    return Array.from(set);
  }, [applications]);

  if (!isAllowed && !boot.isLoading) {
    return (
      <AppShell>
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <ShieldAlert className="mx-auto size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The candidate applications system is accessible to HR/Admin, Executive, and Super Admin roles.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        kicker="Talent & Recruitment"
        title="Candidate Applications"
        description="Review candidate credentials, progress stages through interviewing, and directly onboard hires into staff accounts."
      />

      <Card className="rounded-xl border border-border">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search applicant name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={posFilter} onValueChange={setPosFilter}>
                <SelectTrigger className="h-9 w-40 text-xs">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-40 text-xs">
                  <SelectValue placeholder="Status Stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_STAGES.map((s) => (
                    <SelectItem key={s.status} value={s.status}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {(posFilter !== "all" || statusFilter !== "all" || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPosFilter("all");
                    setStatusFilter("all");
                    setSearch("");
                  }}
                  className="text-xs h-9"
                >
                  <RotateCcw className="mr-1 size-3.5" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Applications Table */}
          {appsQuery.isLoading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Applicant Name</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Date Applied</th>
                    <th className="px-4 py-3">Experience</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {applications.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                        No applications match your filter settings.
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => openDetail(app)}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3 font-medium">
                          <div className="text-foreground">{app.fullName}</div>
                          <div className="text-xs text-muted-foreground">{app.email}</div>
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">
                          <div>{app.jobTitle}</div>
                          <div className="text-[11px] text-muted-foreground">{app.jobDepartment}</div>
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground">
                          {new Date(app.createdAt).toLocaleDateString("en-GB", {
                            dateStyle: "medium",
                          })}
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums text-foreground">
                          {app.yearsExperience} {app.yearsExperience === 1 ? "year" : "years"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(app);
                            }}
                            className="text-xs h-8"
                          >
                            Review
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* APPLICATION DETAIL MODAL */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedApp ? (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <DialogTitle className="text-lg">{selectedApp.fullName}</DialogTitle>
                    <DialogDescription className="text-xs mt-0.5">
                      Applied for <span className="font-medium text-foreground">{selectedApp.jobTitle}</span> ({selectedApp.jobDepartment})
                    </DialogDescription>
                  </div>
                  <StatusBadge status={selectedApp.status} />
                </div>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                {/* Contact & Professional Info Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-muted/50 p-3 border border-border">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Email</span>
                    <a href={`mailto:${selectedApp.email}`} className="text-primary hover:underline break-all">
                      {selectedApp.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Phone</span>
                    <a href={`tel:${selectedApp.phone}`} className="text-foreground">
                      {selectedApp.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Experience</span>
                    <span className="text-foreground">{selectedApp.yearsExperience} yrs ({selectedApp.currentJobTitle || "N/A"})</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block">Source</span>
                    <span className="text-foreground">{selectedApp.referralSource}</span>
                  </div>
                </div>

                {/* CV and Links */}
                <div className="flex flex-wrap items-center gap-2">
                  {selectedApp.cvUrl ? (
                    <a
                      href={selectedApp.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-medium text-xs border border-primary/20"
                    >
                      <FileCheck className="size-3.5" />
                      View / Download CV (PDF)
                      <ExternalLink className="size-3 ml-0.5" />
                    </a>
                  ) : (
                    <span className="text-muted-foreground">No CV uploaded.</span>
                  )}

                  {selectedApp.linkedinUrl ? (
                    <a
                      href={selectedApp.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border text-foreground hover:bg-muted"
                    >
                      LinkedIn
                      <ExternalLink className="size-3" />
                    </a>
                  ) : null}

                  {selectedApp.portfolioUrl ? (
                    <a
                      href={selectedApp.portfolioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border text-foreground hover:bg-muted"
                    >
                      Portfolio / Work
                      <ExternalLink className="size-3" />
                    </a>
                  ) : null}
                </div>

                {/* Cover Letter */}
                {selectedApp.coverLetter ? (
                  <div className="space-y-1">
                    <Label className="text-[11px] font-semibold text-muted-foreground uppercase">Cover Letter</Label>
                    <div className="rounded-lg border border-border bg-muted/30 p-3 leading-relaxed text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto">
                      {selectedApp.coverLetter}
                    </div>
                  </div>
                ) : null}

                {/* Interview Information if scheduled */}
                {selectedApp.interviewDate ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-amber-800 dark:text-amber-300 block">
                      Scheduled Interview
                    </span>
                    <p className="text-foreground font-medium">
                      {new Date(selectedApp.interviewDate).toLocaleString("en-GB", {
                        dateStyle: "full",
                        timeStyle: "short",
                        timeZone: "Africa/Lagos",
                      })}{" "}
                      · <span className="font-semibold">{selectedApp.interviewFormat}</span>
                    </p>
                  </div>
                ) : null}

                {/* Rejection Reason if rejected */}
                {selectedApp.status === "rejected" && selectedApp.rejectionReason ? (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 space-y-1">
                    <span className="text-[10px] font-semibold uppercase text-rose-800 dark:text-rose-300 block">
                      Rejection Reason
                    </span>
                    <p className="text-foreground">{selectedApp.rejectionReason}</p>
                  </div>
                ) : null}

                {/* Internal HR Notes */}
                <div className="space-y-1.5 pt-2 border-t border-border">
                  <Label className="text-[11px] font-semibold text-muted-foreground uppercase">
                    Internal Notes (HR/Admin only)
                  </Label>
                  <Textarea
                    rows={2}
                    placeholder="Candidate feedback, interview scores, observations..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatusMutation.mutate({
                          id: selectedApp.id,
                          status: selectedApp.status,
                          internalNotes,
                        })
                      }
                      disabled={updateStatusMutation.isPending}
                      className="text-xs h-7"
                    >
                      Save Notes
                    </Button>
                  </div>
                </div>

                {/* Status Advancement & Next Stage Buttons */}
                <div className="pt-2 border-t border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Move Status Stage:</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {selectedApp.status === "applied" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedApp.id,
                              status: "under_review",
                              internalNotes,
                            })
                          }
                          className="text-xs h-8 bg-sky-600 text-white"
                        >
                          Mark Under Review
                        </Button>
                      )}

                      {selectedApp.status === "under_review" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedApp.id,
                              status: "shortlisted",
                              internalNotes,
                            })
                          }
                          className="text-xs h-8 bg-indigo-600 text-white"
                        >
                          Shortlist Candidate
                        </Button>
                      )}

                      {selectedApp.status === "shortlisted" && (
                        <Button
                          size="sm"
                          onClick={() => setShowSchedule(true)}
                          className="text-xs h-8 bg-amber-600 text-white"
                        >
                          <Calendar className="mr-1.5 size-3.5" />
                          Schedule Interview
                        </Button>
                      )}

                      {selectedApp.status === "interview_scheduled" && (
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedApp.id,
                              status: "interview_done",
                              internalNotes,
                            })
                          }
                          className="text-xs h-8 bg-purple-600 text-white"
                        >
                          Mark Interview Done
                        </Button>
                      )}

                      {selectedApp.status === "interview_done" && (
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: selectedApp.id,
                                status: "selected",
                                internalNotes,
                              })
                            }
                            className="text-xs h-8 bg-emerald-600 text-white"
                          >
                            <CheckCircle2 className="mr-1.5 size-3.5" />
                            Select Candidate
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setShowRejectDialog(true)}
                            className="text-xs h-8"
                          >
                            <XCircle className="mr-1.5 size-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {/* Convert to Staff button if Selected */}
                      {selectedApp.status === "selected" && (
                        <Button
                          size="sm"
                          onClick={() => openConvert(selectedApp)}
                          className="text-xs h-8 bg-accent text-accent-foreground font-semibold"
                        >
                          <UserPlus className="mr-1.5 size-3.5" />
                          Convert to Staff
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Schedule Interview Form dropdown/section */}
                  {showSchedule && (
                    <div className="rounded-lg border border-border bg-muted/40 p-3 space-y-3">
                      <p className="font-semibold text-foreground">Schedule Interview Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[11px]">Date & Time (WAT) *</Label>
                          <Input
                            type="datetime-local"
                            value={interviewDate}
                            onChange={(e) => setInterviewDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[11px]">Format *</Label>
                          <Select value={interviewFormat} onValueChange={setInterviewFormat}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In-person">In-person</SelectItem>
                              <SelectItem value="Video call">Video call</SelectItem>
                              <SelectItem value="Phone">Phone</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowSchedule(false)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedApp.id,
                              status: "interview_scheduled",
                              interviewDate,
                              interviewFormat,
                              internalNotes,
                            })
                          }
                          disabled={!interviewDate || updateStatusMutation.isPending}
                          className="bg-amber-600 text-white"
                        >
                          Confirm Schedule
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Reject Form */}
                  {showRejectDialog && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 space-y-3">
                      <p className="font-semibold text-rose-800 dark:text-rose-300">Mandatory Rejection Reason</p>
                      <Textarea
                        rows={2}
                        placeholder="State feedback or reason for non-selection..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setShowRejectDialog(false)}>
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: selectedApp.id,
                              status: "rejected",
                              rejectionReason,
                              internalNotes,
                            })
                          }
                          disabled={!rejectionReason.trim() || updateStatusMutation.isPending}
                        >
                          Confirm Rejection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* CONVERT TO STAFF MODAL */}
      <Dialog open={convertOpen} onOpenChange={setConvertOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convert Candidate to Staff</DialogTitle>
            <DialogDescription>
              Create an official Eden Shelters staff profile and Supabase Auth credentials for this hired candidate.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input value={convertName} onChange={(e) => setConvertName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Email</Label>
                <Input value={convertEmail} onChange={(e) => setConvertEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone</Label>
                <Input value={convertPhone} onChange={(e) => setConvertPhone(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Select
                  value={convertDept}
                  onValueChange={(v) => setConvertDept(v as (typeof DEPARTMENTS)[number])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Position</Label>
                <Input value={convertPosition} onChange={(e) => setConvertPosition(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Role</Label>
                <Select value={convertRole} onValueChange={(v) => setConvertRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Employee ID</Label>
                <Input value={convertEmpId} onChange={(e) => setConvertEmpId(e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Temporary Password *</Label>
              <Input
                type="text"
                value={convertPassword}
                onChange={(e) => setConvertPassword(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground">
                The new staff member will be required to change this upon first login.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => convertMutation.mutate()}
              disabled={convertMutation.isPending || !convertName || !convertEmail || !convertPassword}
              className="bg-accent text-accent-foreground font-semibold"
            >
              {convertMutation.isPending ? "Creating Staff..." : "Confirm & Onboard"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
