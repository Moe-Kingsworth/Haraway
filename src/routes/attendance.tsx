import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PersonChip } from "@/components/person-chip";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate, formatTimeWAT, todayWAT } from "@/lib/format";
import { clockToday, listAttendance, listLeave, listStaff, reviewLeave } from "@/lib/server/people";
import { getBootstrap } from "@/lib/server/access";

export const Route = createFileRoute("/attendance")({ component: AttendancePage });

function AttendancePage() {
  const qc = useQueryClient();
  const today = todayWAT();
  const from = useMemo(() => {
    const d = new Date(`${today}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 14);
    return d.toISOString().slice(0, 10);
  }, [today]);
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const att = useQuery({
    queryKey: ["attendance", from, today],
    queryFn: () => listAttendance({ data: { from, to: today } }),
  });
  const leave = useQuery({ queryKey: ["leave"], queryFn: () => listLeave() });
  const isAdmin = boot.data?.access.role === "admin";

  const clock = useMutation({
    mutationFn: (input: { action: "in" | "out"; staffId?: number }) => clockToday({ data: input }),
    onSuccess: () => {
      toast.success("Register updated.");
      void qc.invalidateQueries({ queryKey: ["attendance"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const decide = useMutation({
    mutationFn: (input: { id: number; status: "approved" | "declined" }) => reviewLeave({ data: input }),
    onSuccess: () => {
      toast.success("Leave updated.");
      void qc.invalidateQueries({ queryKey: ["leave"] });
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const todayRows = (att.data ?? []).filter((r) => r.workDate === today);
  const history = (att.data ?? []).filter((r) => r.workDate !== today);
  const activeStaff = (staff.data ?? []).filter((s) => s.status === "active");

  return (
    <AppShell>
      <PageHeader
        kicker="Attendance"
        title="The register"
        description="Clock the house in. Leave requests sit on the second tab until you sign them."
      />
      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="log">Last two weeks</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
        </TabsList>
        <TabsContent value="today" className="space-y-3">
          {staff.isLoading ? (
            <Skeleton className="h-24 rounded-xl" />
          ) : activeStaff.length === 0 ? (
            <EmptyState title="No active staff" hint="Add people to the house first." />
          ) : (
            activeStaff.map((s) => {
              const row = todayRows.find((r) => r.staffId === s.id);
              const canAct = isAdmin || boot.data?.access.staffId === s.id;
              return (
                <Card key={s.id}>
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <PersonChip id={s.id} name={s.fullName} meta={s.role} />
                    <div className="flex flex-wrap items-center gap-2">
                      {row ? <StatusBadge value={row.status} /> : <StatusBadge value="absent" />}
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {formatTimeWAT(row?.clockIn)} – {formatTimeWAT(row?.clockOut)}
                      </span>
                      {canAct ? (
                        <>
                          <Button
                            size="sm"
                            disabled={clock.isPending || Boolean(row?.clockIn)}
                            onClick={() => clock.mutate({ action: "in", staffId: s.id })}
                          >
                            In
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={clock.isPending || !row?.clockIn || Boolean(row?.clockOut)}
                            onClick={() => clock.mutate({ action: "out", staffId: s.id })}
                          >
                            Out
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
        <TabsContent value="log" className="overflow-x-auto">
          {history.length === 0 ? (
            <EmptyState title="No register yet" hint="Clock-ins from the last two weeks will land here." />
          ) : (
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="text-xs tracking-wide text-muted-foreground uppercase">
                <tr className="border-b border-border">
                  <th className="py-2 pr-3 font-medium">Date</th>
                  <th className="py-2 pr-3 font-medium">Person</th>
                  <th className="py-2 pr-3 font-medium">In</th>
                  <th className="py-2 pr-3 font-medium">Out</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id} className="border-b border-border/70">
                    <td className="py-2.5 pr-3 tabular-nums">{formatDate(r.workDate)}</td>
                    <td className="py-2.5 pr-3">{r.staffName}</td>
                    <td className="py-2.5 pr-3 tabular-nums">{formatTimeWAT(r.clockIn)}</td>
                    <td className="py-2.5 pr-3 tabular-nums">{formatTimeWAT(r.clockOut)}</td>
                    <td className="py-2.5">
                      <StatusBadge value={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </TabsContent>
        <TabsContent value="leave" className="space-y-3">
          {(leave.data ?? []).length === 0 ? (
            <EmptyState title="No leave requests" hint="Ask from My desk. Approvals land here." />
          ) : (
            (leave.data ?? []).map((l) => (
              <Card key={l.id}>
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium">{l.staffName}</p>
                    <p className="text-sm text-muted-foreground">
                      {l.leaveType} · {formatDate(l.startDate)} – {formatDate(l.endDate)}
                    </p>
                    {l.reason ? <p className="mt-1 text-sm">{l.reason}</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={l.status} />
                    {isAdmin && l.status === "pending" ? (
                      <>
                        <Button size="sm" onClick={() => decide.mutate({ id: l.id, status: "approved" })}>
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => decide.mutate({ id: l.id, status: "declined" })}
                        >
                          Decline
                        </Button>
                      </>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
