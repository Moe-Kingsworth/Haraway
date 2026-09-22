import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PersonChip } from "@/components/person-chip";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBootstrap } from "@/lib/server/access";
import { getDashboard } from "@/lib/server/dashboard";
import { clockToday } from "@/lib/server/people";
import { formatNgn, formatNgnCompact, formatTimeWAT, isWeekend, monthLabel, todayWAT } from "@/lib/format";

export const Route = createFileRoute("/")({ component: Home });

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <Card className="rounded-xl">
      <CardContent className="p-5">
        <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">{label}</p>
        <p className="mt-2 font-display text-3xl font-medium tracking-tight tabular-nums">{value}</p>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function Home() {
  const qc = useQueryClient();
  const dash = useQuery({ queryKey: ["dashboard"], queryFn: () => getDashboard() });
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const d = dash.data;
  const firstName = boot.data?.access.displayName?.trim().split(/\s+/)[0];
  const today = todayWAT();
  const [year, month] = today.split("-").map(Number);
  const meId = boot.data?.access.staffId;
  const alreadyIn = Boolean(meId && d?.inOffice.some((p) => p.id === meId));

  const clock = useMutation({
    mutationFn: () => clockToday({ data: { action: "in" } }),
    onSuccess: () => {
      toast.success("Clocked in.");
      void qc.invalidateQueries({ queryKey: ["dashboard"] });
      void qc.invalidateQueries({ queryKey: ["attendance"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="Overview"
        title={firstName ? `Good day, ${firstName}.` : "The operations desk"}
        description="The house at a glance — who is in, what is moving, and what still needs a signature."
        actions={
          boot.data?.me && !alreadyIn && !dash.isLoading ? (
            <Button onClick={() => clock.mutate()} disabled={clock.isPending}>
              Clock in
            </Button>
          ) : null
        }
      />

      {dash.isLoading || !d ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat
              label="In today"
              value={`${d.presentToday}/${d.staffCount}`}
              hint="Clocked present, late or remote"
            />
            <Stat
              label="Open tasks"
              value={String(d.openTasks)}
              hint={d.overdueTasks ? `${d.overdueTasks} overdue` : "Nothing overdue"}
            />
            <Stat label="Live pipeline" value={formatNgnCompact(d.pipelineNgn)} hint="Draft, issued and accepted" />
            <Stat
              label="Receipts this month"
              value={formatNgnCompact(d.monthReceiptsNgn)}
              hint={`${monthLabel(year ?? 2026, month ?? 9)} collections`}
            />
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Collections</CardTitle>
                <p className="text-sm text-muted-foreground">Money in, by month.</p>
              </CardHeader>
              <CardContent className="h-56">
                {d.collections.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No receipts yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={d.collections} barSize={28}>
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v: number) => formatNgnCompact(v)}
                        width={56}
                      />
                      <Tooltip
                        cursor={{ fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" }}
                        formatter={(v: number | string) => [formatNgn(Number(v)), "Collected"]}
                        contentStyle={{
                          background: "var(--color-card)",
                          border: "1px solid var(--color-border)",
                          borderRadius: 8,
                          fontSize: 12,
                        }}
                      />
                      <Bar dataKey="amount" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Who is in</CardTitle>
                <p className="text-sm text-muted-foreground">Today, West Africa Time.</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.inOffice.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {isWeekend(today)
                      ? "The house is quiet this weekend. Clock in if you are on a viewing."
                      : "Nobody has clocked in yet."}
                  </p>
                ) : (
                  d.inOffice.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-3">
                      <PersonChip id={p.id} name={p.name} meta={p.role} size="sm" />
                      <div className="flex items-center gap-2">
                        <span className="text-xs tabular-nums text-muted-foreground">{formatTimeWAT(p.clockIn)}</span>
                        <StatusBadge value={p.status} />
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Needs a look</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {d.attention.length === 0 ? (
                  <p className="text-sm text-muted-foreground">The desk is clear.</p>
                ) : (
                  d.attention.map((a) => (
                    <Link
                      key={a.title}
                      to={a.href}
                      className="flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted"
                    >
                      <span>{a.title}</span>
                      <span className="text-xs text-muted-foreground">Open</span>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latest receipts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {d.recentPayments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No receipts yet.</p>
                ) : (
                  d.recentPayments.map((p) => (
                    <Link
                      key={p.id}
                      to="/receipts/$id"
                      params={{ id: String(p.id) }}
                      className="flex items-center justify-between gap-3 text-sm hover:text-accent"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium">{p.clientName}</span>
                        <span className="text-xs text-muted-foreground">{p.receiptNo}</span>
                      </span>
                      <span className="shrink-0 tabular-nums">{formatNgn(p.amountNgn)}</span>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </AppShell>
  );
}
