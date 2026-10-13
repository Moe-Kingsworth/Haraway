import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Building,
  CheckCircle,
  Clock,
  Eye,
  FileText,
  MapPin,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { DEPARTMENTS } from "@/lib/constants";
import { getBootstrap } from "@/lib/server/access";
import { deleteJobPosting, listJobPostings, upsertJobPosting } from "@/lib/server/jobs";
import type { JobPosting } from "@/lib/types";

export const Route = createFileRoute("/jobs")({ component: JobsPage });

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract"] as const;

function StatusBadge({ status }: { status: JobPosting["status"] }) {
  if (status === "published") {
    return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Published</Badge>;
  }
  if (status === "draft") {
    return <Badge className="bg-amber-500/15 text-amber-700 border-amber-500/30">Draft</Badge>;
  }
  return <Badge variant="secondary">Unpublished</Badge>;
}

function JobsPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const isAllowed = ["super_admin", "hr_admin"].includes(boot.data?.access.role ?? "");

  const jobsQuery = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: () => listJobPostings(),
    enabled: isAllowed,
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState("");
  const [dept, setDept] = useState<(typeof DEPARTMENTS)[number]>("Sales");
  const [type, setType] = useState<(typeof EMPLOYMENT_TYPES)[number]>("Full-time");
  const [location, setLocation] = useState("Abuja, Nigeria");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [status, setStatus] = useState<JobPosting["status"]>("draft");

  const upsertMutation = useMutation({
    mutationFn: () =>
      upsertJobPosting({
        data: {
          id: editingId || undefined,
          title,
          department: dept,
          employmentType: type,
          location,
          description,
          requirements,
          responsibilities,
          status,
        },
      }),
    onSuccess: () => {
      toast.success(editingId ? "Job posting updated" : "Job posting created");
      void qc.invalidateQueries({ queryKey: ["admin-jobs"] });
      setDialogOpen(false);
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublishMutation = useMutation({
    mutationFn: (posting: JobPosting) =>
      upsertJobPosting({
        data: {
          id: posting.id,
          title: posting.title,
          department: posting.department,
          employmentType: posting.employmentType,
          location: posting.location,
          description: posting.description,
          requirements: posting.requirements,
          responsibilities: posting.responsibilities,
          status: posting.status === "published" ? "unpublished" : "published",
        },
      }),
    onSuccess: () => {
      toast.success("Job status updated");
      void qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteJobPosting({ data: { id } }),
    onSuccess: () => {
      toast.success("Job posting removed");
      void qc.invalidateQueries({ queryKey: ["admin-jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDept("Sales");
    setType("Full-time");
    setLocation("Abuja, Nigeria");
    setDescription("");
    setRequirements("");
    setResponsibilities("");
    setStatus("draft");
  }

  function openEdit(posting: JobPosting) {
    setEditingId(posting.id);
    setTitle(posting.title);
    setDept((posting.department as (typeof DEPARTMENTS)[number]) || "Sales");
    setType((posting.employmentType as (typeof EMPLOYMENT_TYPES)[number]) || "Full-time");
    setLocation(posting.location || "Abuja, Nigeria");
    setDescription(posting.description);
    setRequirements(posting.requirements);
    setResponsibilities(posting.responsibilities);
    setStatus(posting.status);
    setDialogOpen(true);
  }

  if (!isAllowed && !boot.isLoading) {
    return (
      <AppShell>
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <ShieldAlert className="mx-auto size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Job posting management is available to HR/Admin and Super Admin roles.
          </p>
        </div>
      </AppShell>
    );
  }

  const jobs = jobsQuery.data ?? [];

  return (
    <AppShell>
      <PageHeader
        kicker="Talent & Recruitment"
        title="Job Postings"
        description="Publish career openings to the public careers portal, manage vacancies, and track incoming candidates."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/careers" target="_blank">
              <Button variant="outline">
                <Eye className="mr-2 size-4" />
                View Careers Page
              </Button>
            </Link>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 size-4" />
              Create Job
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {jobsQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        ) : jobs.length === 0 ? (
          <Card className="rounded-xl border border-dashed p-12 text-center">
            <Briefcase className="mx-auto size-12 text-muted-foreground/60" />
            <h3 className="mt-4 text-base font-medium">No job postings created</h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              Create your first opening to attract candidates on the public Eden Shelters Careers page.
            </p>
            <Button
              onClick={() => {
                resetForm();
                setDialogOpen(true);
              }}
              className="mt-4 bg-primary text-primary-foreground"
            >
              <Plus className="mr-2 size-4" />
              Post a Position
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <Card key={job.id} className="rounded-xl border border-border flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base line-clamp-1">{job.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{job.department}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pb-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      {job.employmentType}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/80 line-clamp-2">
                    {job.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <Link
                      to="/applications"
                      className="flex items-center gap-1.5 font-medium text-primary hover:underline"
                    >
                      <Users className="size-3.5" />
                      <span>{job.applicationsCount || 0} applications</span>
                    </Link>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-7">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEdit(job)}>
                          <Pencil className="mr-2 size-3.5" />
                          Edit Posting
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => togglePublishMutation.mutate(job)}
                          disabled={togglePublishMutation.isPending}
                        >
                          <CheckCircle className="mr-2 size-3.5" />
                          {job.status === "published" ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(job.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 size-3.5" />
                          Delete Posting
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CREATE / EDIT JOB DIALOG */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Job Posting" : "Create Job Posting"}</DialogTitle>
            <DialogDescription>
              Configure the vacancy details. Published positions will appear on the public careers portal.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Job Title *</Label>
              <Input
                placeholder="e.g. Senior Real Estate Consultant"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Department *</Label>
                <Select
                  value={dept}
                  onValueChange={(v) => setDept(v as (typeof DEPARTMENTS)[number])}
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
                <Label className="text-xs">Employment Type *</Label>
                <Select
                  value={type}
                  onValueChange={(v) => setType(v as (typeof EMPLOYMENT_TYPES)[number])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EMPLOYMENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Location</Label>
                <Input value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as JobPosting["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft (Hidden)</SelectItem>
                    <SelectItem value="published">Published (Live)</SelectItem>
                    <SelectItem value="unpublished">Unpublished (Archived)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Job Description *</Label>
              <Textarea
                rows={3}
                placeholder="Describe the opportunity, team environment, and core mandate..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Requirements (one per line)</Label>
              <Textarea
                rows={3}
                placeholder="5+ years property sales experience in Abuja&#10;Proven portfolio in Maitama / Guzape&#10;B.Sc in Estate Management or relevant discipline"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Responsibilities (one per line)</Label>
              <Textarea
                rows={3}
                placeholder="Originate high-value buyer transactions&#10;Conduct private viewings with HNIs&#10;Prepare documentation and closing packets"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => upsertMutation.mutate()}
              disabled={upsertMutation.isPending || !title.trim()}
              className="bg-primary text-primary-foreground"
            >
              {upsertMutation.isPending ? "Saving..." : editingId ? "Update Job" : "Create Job"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
