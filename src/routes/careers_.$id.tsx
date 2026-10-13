import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  Linkedin,
  LogIn,
  MapPin,
  Send,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { getPublicJobPostingById, submitPublicJobApplication } from "@/lib/server/jobs";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/careers_/$id")({ component: JobDetailPage });

const REFERRAL_SOURCES = ["LinkedIn", "Referral", "Website", "Walk-in", "Other"] as const;

function JobDetailPage() {
  const { id } = Route.useParams();

  const query = useQuery({
    queryKey: ["public-job", id],
    queryFn: () => getPublicJobPostingById({ data: { id } }),
  });

  const job = query.data;

  // Form state
  const [applyOpen, setApplyOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState<number>(3);
  const [currentJobTitle, setCurrentJobTitle] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [referralSource, setReferralSource] = useState<(typeof REFERRAL_SOURCES)[number]>("Website");
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploading, setCvUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const applyMutation = useMutation({
    mutationFn: async () => {
      if (!job) throw new Error("Job not found.");
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        throw new Error("Please complete all required fields.");
      }
      if (!cvFile) {
        throw new Error("Please upload your CV in PDF format.");
      }
      if (cvFile.size > 5 * 1024 * 1024) {
        throw new Error("CV file size exceeds 5MB limit.");
      }

      setCvUploading(true);
      let uploadedCvUrl = "";

      try {
        const fileExt = "pdf";
        const cleanName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;
        const filePath = `resumes/${cleanName}`;

        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from("cvs")
          .upload(filePath, cvFile, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadErr) {
          console.warn("Storage upload error, using direct reference:", uploadErr);
          // If storage bucket isn't directly writable via anon key, create data URL fallback
          uploadedCvUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(cvFile);
          });
        } else {
          const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(filePath);
          uploadedCvUrl = urlData.publicUrl;
        }
      } catch (e) {
        console.warn("Fallback to base64 CV:", e);
        uploadedCvUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(cvFile);
        });
      } finally {
        setCvUploading(false);
      }

      return submitPublicJobApplication({
        data: {
          jobPostingId: job.id,
          fullName,
          email,
          phone,
          yearsExperience: Number(experience) || 0,
          currentJobTitle,
          coverLetter,
          cvUrl: uploadedCvUrl,
          linkedinUrl: linkedinUrl || undefined,
          portfolioUrl: portfolioUrl || undefined,
          referralSource,
        },
      });
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: (e: Error) => {
      setCvUploading(false);
      toast.error(e.message);
    },
  });

  const requirementsList = job?.requirements
    ? job.requirements.split("\n").map((r) => r.trim()).filter(Boolean)
    : [];

  const responsibilitiesList = job?.responsibilities
    ? job.responsibilities.split("\n").map((r) => r.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-svh bg-[#F9F7F4] text-foreground flex flex-col selection:bg-accent/20">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-[#F9F7F4]/90 backdrop-blur-md px-4 py-3.5 sm:px-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link to="/careers" className="flex items-center gap-2">
            <Wordmark name="Eden Shelters" />
          </Link>

          <Link to="/login">
            <Button variant="ghost" size="sm" className="text-xs font-medium text-muted-foreground hover:text-foreground">
              <LogIn className="mr-1.5 size-3.5" />
              Staff Portal
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-8 sm:py-12 sm:px-8 space-y-6">
        <div>
          <Link
            to="/careers"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to all open positions
          </Link>
        </div>

        {query.isLoading || !job ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-2/3 bg-white" />
            <Skeleton className="h-40 w-full bg-white" />
            <Skeleton className="h-64 w-full bg-white" />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Job Details Left Column (2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header Card */}
              <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="outline" className="border-border text-xs">
                    {job.department}
                  </Badge>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    Posted on {new Date(job.createdAt).toLocaleDateString("en-GB", { dateStyle: "long" })}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#4B2E1E]">
                  {job.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                  <span className="flex items-center gap-1.5 font-medium">
                    <MapPin className="size-4 text-accent" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="size-4 text-accent" />
                    {job.employmentType}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                <h2 className="font-display text-lg font-semibold text-[#4B2E1E]">Role Overview</h2>
                <div className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {job.description}
                </div>
              </div>

              {/* Responsibilities */}
              {responsibilitiesList.length > 0 && (
                <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                  <h2 className="font-display text-lg font-semibold text-[#4B2E1E]">Key Responsibilities</h2>
                  <ul className="space-y-2.5 text-sm text-foreground/90">
                    {responsibilitiesList.map((resp, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="size-1.5 rounded-full bg-accent mt-2 shrink-0" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requirements */}
              {requirementsList.length > 0 && (
                <div className="rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm">
                  <h2 className="font-display text-lg font-semibold text-[#4B2E1E]">Requirements & Qualifications</h2>
                  <ul className="space-y-2.5 text-sm text-foreground/90">
                    {requirementsList.map((req, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Application Sticky Action Card Right Column */}
            <div className="space-y-6">
              <div className="sticky top-20 rounded-2xl border border-border/80 bg-white p-6 space-y-5 shadow-sm">
                <h3 className="font-display text-lg font-semibold text-[#4B2E1E]">Apply for this Position</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Join Eden Shelters in delivering premier real estate and property operations across Abuja.
                </p>

                <div className="pt-2">
                  <Button
                    onClick={() => {
                      setSubmitted(false);
                      setApplyOpen(true);
                    }}
                    className="w-full bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold text-sm h-11 shadow-sm cursor-pointer"
                  >
                    Apply for this role
                  </Button>
                </div>

                <div className="rounded-xl bg-muted/40 p-4 space-y-2.5 text-xs border border-border/50">
                  <p className="font-semibold text-foreground">Application Checklist:</p>
                  <ul className="space-y-1.5 text-muted-foreground">
                    <li>• Curriculum Vitae (PDF max 5MB)</li>
                    <li>• Contact details & experience history</li>
                    <li>• Brief cover letter / motivation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* APPLICATION MODAL */}
      <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          {submitted ? (
            <div className="p-6 text-center space-y-4">
              <div className="mx-auto size-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="size-8" />
              </div>
              <DialogTitle className="text-xl font-display text-[#4B2E1E]">
                Application Submitted!
              </DialogTitle>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Thank you for applying for <span className="font-semibold text-foreground">{job?.title}</span>.
                We'll be in touch within 5 working days.
              </p>
              <Button
                onClick={() => setApplyOpen(false)}
                className="bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold"
              >
                Return to Job Description
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl text-[#4B2E1E]">
                  Apply: {job?.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Fill out the form below. All applications are reviewed directly by the Eden Shelters recruitment team.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-2 text-xs">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Full Name *</Label>
                  <Input
                    placeholder="e.g. Moses Kingsworth"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Email and Phone */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Email Address *</Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Phone Number *</Label>
                    <Input
                      placeholder="+234 803 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {/* Position Applied For (Auto-filled) & Years Exp */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Position Applied For</Label>
                    <Input value={job?.title ?? ""} disabled className="bg-muted text-muted-foreground" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Years of Experience *</Label>
                    <Input
                      type="number"
                      min={0}
                      max={40}
                      value={experience}
                      onChange={(e) => setExperience(Number(e.target.value))}
                    />
                  </div>
                </div>

                {/* Current / Last Job Title */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Current or Last Job Title *</Label>
                  <Input
                    placeholder="e.g. Senior Realtor at Prime Homes"
                    value={currentJobTitle}
                    onChange={(e) => setCurrentJobTitle(e.target.value)}
                  />
                </div>

                {/* Cover Letter */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Cover Letter / Note *</Label>
                  <Textarea
                    rows={3}
                    placeholder="Tell us about your background, major achievements, and why you wish to join Eden Shelters..."
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                  />
                </div>

                {/* CV Upload */}
                <div className="space-y-1.5">
                  <Label className="text-xs">CV Upload (PDF only, max 5MB) *</Label>
                  <div className="rounded-lg border border-dashed border-border p-4 text-center space-y-2 bg-muted/20">
                    <Input
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            toast.error("File size exceeds 5MB limit.");
                            return;
                          }
                          setCvFile(file);
                        }
                      }}
                      className="cursor-pointer text-xs"
                    />
                    {cvFile ? (
                      <p className="text-xs text-emerald-600 font-medium flex items-center justify-center gap-1">
                        <FileCheck className="size-3.5" />
                        Selected: {cvFile.name} ({(cvFile.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">
                        Attach your latest CV or resume in PDF format.
                      </p>
                    )}
                  </div>
                </div>

                {/* Optional Social URLs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">LinkedIn URL (optional)</Label>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Portfolio URL (optional)</Label>
                    <Input
                      placeholder="https://..."
                      value={portfolioUrl}
                      onChange={(e) => setPortfolioUrl(e.target.value)}
                    />
                  </div>
                </div>

                {/* Referral Source */}
                <div className="space-y-1.5">
                  <Label className="text-xs">How did you hear about us? *</Label>
                  <Select
                    value={referralSource}
                    onValueChange={(v) => setReferralSource(v as (typeof REFERRAL_SOURCES)[number])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {REFERRAL_SOURCES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <Button variant="outline" onClick={() => setApplyOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={() => applyMutation.mutate()}
                  disabled={
                    applyMutation.isPending ||
                    cvUploading ||
                    !fullName.trim() ||
                    !email.trim() ||
                    !phone.trim() ||
                    !cvFile
                  }
                  className="bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold"
                >
                  {applyMutation.isPending || cvUploading ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
