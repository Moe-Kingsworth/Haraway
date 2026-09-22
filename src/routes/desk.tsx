import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBootstrap } from "@/lib/server/access";
import { clockToday, listAttendance, listLeave, listPayroll, listReviews, listTasks, requestLeave } from "@/lib/server/people";
import { formatDate, formatNgn, formatTimeWAT, monthLabel, todayWAT } from "@/lib/format";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAVE_TYPES } from "@/lib/constants";
import { useState } from "react";

export const Route = createFileRoute("/desk")({ component: DeskPage });

function DeskPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const today = todayWAT();
  const from = `${today.slice(0, 8)}01`;
  const att = useQuery({
    queryKey: ["attendance", from, today],
    queryFn: () => listAttendance({ data: { from, to: today } }),
  });
  const tasks = useQuery({ queryKey: ["tasks"], queryFn: () => listTasks() });
  const pay = useQuery({ queryKey: ["payroll"], queryFn: () => listPayroll() });
  const reviews = useQuery({ queryKey: ["reviews"], queryFn: () => listReviews() });
  const leave = useQuery({ queryKey: ["leave"], queryFn: () => listLeave() });
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("annual");

  const me = boot.data?.me;
  const staffId = me?.id;
  const myToday = att.data?.find((r) => r.staffId === staffId && r.workDate === today);
  const myTasks = (tasks.data ?? []).filter((t) => t.status !== "done" && t.staffId === staffId).slice(0, 6);
  const latestSlip = (pay.data?.slips ?? []).find((s) => s.staffId === staffId);
  const review = (reviews.data ?? []).find((r) => r.staffId === staffId);
  const myLeave = (leave.data ?? []).filter((l) => l.staffId === staffId);

  const clock = useMutation({
    mutationFn: (action: "in" | "out") => clockToday({ data: { action } }),
    onSuccess: (_, action) => {
      toast.success(action === "in" ? "Clocked in." : "Clocked out.");
      void qc.invalidateQueries({ queryKey: ["attendance"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const askLeave = useMutation({
    mutationFn: (data: { leaveType: string; startDate: string; endDate: string; reason: string }) =>
      requestLeave({ data }),
    onSuccess: () => {
      toast.success("Leave request sent.");
      setLeaveOpen(false);
      void qc.invalidateQueries({ queryKey: ["leave"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="My desk"
        title={me ? me.fullName : "Your desk"}
        description={me ? `${me.role} · ${me.department}` : "Clock in, see your work, and read your last payslip."}
        actions={
          <div className="flex gap-2">
            <Button
              onClick={() => clock.mutate("in")}
              disabled={clock.isPending || Boolean(myToday?.clockIn)}
            >
              Clock in
            </Button>
            <Button
              variant="outline"
              onClick={() => clock.mutate("out")}
              disabled={clock.isPending || !myToday?.clockIn || Boolean(myToday?.clockOut)}
            >
              Clock out
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {myToday ? (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <StatusBadge value={myToday.status} />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">In</span>
                  <span className="tabular-nums">{formatTimeWAT(myToday.clockIn)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Out</span>
                  <span className="tabular-nums">{formatTimeWAT(myToday.clockOut)}</span>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">You have not clocked in today.</p>
            )}
            <Button variant="secondary" className="w-full" onClick={() => setLeaveOpen(true)}>
              Request leave
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last payslip</CardTitle>
          </CardHeader>
          <CardContent>
            {latestSlip ? (
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{monthLabel(latestSlip.periodYear, latestSlip.periodMonth)}</p>
                <p className="font-display text-2xl font-medium tabular-nums">{formatNgn(latestSlip.netNgn)}</p>
                <p className="text-xs text-muted-foreground">
                  Basic {formatNgn(latestSlip.basicNgn)} · Housing {formatNgn(latestSlip.allowanceNgn)} · Pension{" "}
                  {formatNgn(latestSlip.deductionNgn)}
                </p>
                <Link to="/payroll" className="text-sm text-accent hover:underline">
                  All payslips
                </Link>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No payslip yet.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {review ? (
              <div>
                <p className="text-sm text-muted-foreground">{review.periodLabel}</p>
                <p className="font-display text-2xl font-medium tabular-nums">{review.overallScore}</p>
                <p className="mt-2 text-sm text-muted-foreground">{review.notes}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No review on file.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {myTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing assigned.</p>
            ) : (
              myTasks.map((t) => (
                <div key={t.id} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{t.dueDate ? formatDate(t.dueDate) : "No due date"}</p>
                  </div>
                  <StatusBadge value={t.status} />
                </div>
              ))
            )}
            <Link to="/tasks" className="inline-block text-sm text-accent hover:underline">
              Open the board
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(myLeave ?? []).slice(0, 5).map((l) => (
              <div key={l.id} className="flex items-center justify-between gap-3 text-sm">
                <span>
                  {l.leaveType} · {formatDate(l.startDate)} – {formatDate(l.endDate)}
                </span>
                <StatusBadge value={l.status} />
              </div>
            ))}
            {myLeave.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leave on file.</p>
            ) : null}
          </CardContent>
        </Card>
      </div>

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              askLeave.mutate({
                leaveType,
                startDate: String(fd.get("startDate")),
                endDate: String(fd.get("endDate")),
                reason: String(fd.get("reason") || ""),
              });
            }}
          >
            <DialogHeader>
              <DialogTitle>Request leave</DialogTitle>
            </DialogHeader>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startDate">From</Label>
                <Input id="startDate" name="startDate" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endDate">To</Label>
                <Input id="endDate" name="endDate" type="date" required />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reason">Reason</Label>
              <Textarea id="reason" name="reason" required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={askLeave.isPending}>
                Send request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
