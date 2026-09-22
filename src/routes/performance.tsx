import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PersonChip } from "@/components/person-chip";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getBootstrap } from "@/lib/server/access";
import { listReviews, listStaff, upsertReview } from "@/lib/server/people";

export const Route = createFileRoute("/performance")({ component: PerformancePage });

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-xs tracking-wide text-muted-foreground uppercase">{label}</p>
      <p className="font-display text-2xl font-medium tabular-nums">{value}</p>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function PerformancePage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const reviews = useQuery({ queryKey: ["reviews"], queryFn: () => listReviews() });
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const isAdmin = boot.data?.access.role === "admin";
  const [open, setOpen] = useState(false);
  const [staffId, setStaffId] = useState("");

  const save = useMutation({
    mutationFn: (data: Parameters<typeof upsertReview>[0]["data"]) => upsertReview({ data }),
    onSuccess: (res) => {
      toast.success(`Review filed. Overall ${res.overall}.`);
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  useEffect(() => {
    if (!open) return;
    setStaffId(staff.data?.[0] ? String(staff.data[0].id) : "");
  }, [open, staff.data]);

  return (
    <AppShell>
      <PageHeader
        kicker="Performance"
        title="How the house is landing"
        description="Quarterly scores — closings, listings, the register, and how clients speak of the work."
        actions={
          isAdmin ? <Button onClick={() => setOpen(true)}>File a review</Button> : null
        }
      />
      {reviews.isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (reviews.data ?? []).length === 0 ? (
        <EmptyState title="No reviews on file" hint="File a quarterly review when the numbers are in." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {(reviews.data ?? []).map((r) => (
            <Card key={r.id}>
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <PersonChip id={r.staffId} name={r.staffName} meta={`${r.department} · ${r.periodLabel}`} />
                  <p className="font-display text-3xl font-medium tabular-nums">{r.overallScore}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Score label="Attendance" value={r.attendanceScore} />
                  <Score label="Client" value={r.clientScore} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {r.dealsClosed} closings · {r.listingsWon} listings
                </p>
                {r.notes ? <p className="text-sm">{r.notes}</p> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90svh] overflow-y-auto">
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              if (!staffId) return;
              save.mutate({
                staffId: Number(staffId),
                periodLabel: String(fd.get("periodLabel")),
                dealsClosed: Number(fd.get("dealsClosed") || 0),
                listingsWon: Number(fd.get("listingsWon") || 0),
                attendanceScore: Number(fd.get("attendanceScore") || 0),
                clientScore: Number(fd.get("clientScore") || 0),
                notes: String(fd.get("notes") || ""),
              });
            }}
          >
            <DialogHeader>
              <DialogTitle>File a review</DialogTitle>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label>Person</Label>
              <Select value={staffId} onValueChange={setStaffId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {(staff.data ?? []).map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="periodLabel">Period</Label>
              <Input id="periodLabel" name="periodLabel" defaultValue="Q3 2026" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dealsClosed">Closings</Label>
                <Input id="dealsClosed" name="dealsClosed" type="number" min={0} defaultValue={0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="listingsWon">Listings</Label>
                <Input id="listingsWon" name="listingsWon" type="number" min={0} defaultValue={0} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="attendanceScore">Attendance (0–100)</Label>
                <Input id="attendanceScore" name="attendanceScore" type="number" min={0} max={100} defaultValue={90} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="clientScore">Client (0–100)</Label>
                <Input id="clientScore" name="clientScore" type="number" min={0} max={100} defaultValue={90} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={save.isPending || !staffId}>
                File review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
