import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNgn, monthLabel, todayWAT } from "@/lib/format";
import { getBootstrap } from "@/lib/server/access";
import { listPayroll, processPayroll } from "@/lib/server/people";
import type { Payslip } from "@/lib/types";

export const Route = createFileRoute("/payroll")({ component: PayrollPage });

function PayrollPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const pay = useQuery({ queryKey: ["payroll"], queryFn: () => listPayroll() });
  const [slip, setSlip] = useState<Payslip | null>(null);
  const isAdmin = boot.data?.access.role === "admin";
  const company = boot.data?.access.workspace.companyName ?? "Aso Terrace";
  const today = todayWAT();
  const [year, month] = today.split("-").map(Number);
  const already = pay.data?.runs.some((r) => r.periodYear === year && r.periodMonth === month && r.status !== "draft");

  const run = useMutation({
    mutationFn: () => processPayroll({ data: { year, month } }),
    onSuccess: () => {
      toast.success(`Payroll for ${monthLabel(year, month)} processed.`);
      void qc.invalidateQueries({ queryKey: ["payroll"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const grouped = new Map<string, Payslip[]>();
  for (const s of pay.data?.slips ?? []) {
    const key = `${s.periodYear}-${s.periodMonth}`;
    const list = grouped.get(key) ?? [];
    list.push(s);
    grouped.set(key, list);
  }

  return (
    <AppShell>
      <PageHeader
        kicker="Payroll"
        title="The envelope"
        description="Housing at 20%, pension at 8%. Process the month when the register is clean."
        actions={
          isAdmin ? (
            <Button disabled={run.isPending || already} onClick={() => run.mutate()}>
              {already ? "This month is paid" : `Process ${monthLabel(year, month)}`}
            </Button>
          ) : null
        }
      />

      {pay.isLoading ? (
        <Skeleton className="h-48 rounded-xl" />
      ) : grouped.size === 0 ? (
        <EmptyState title="No payslips yet" hint="Process the month from the operations desk." />
      ) : (
        <div className="space-y-6">
          {[...grouped.entries()].map(([key, slips]) => {
            const first = slips[0]!;
            const total = slips.reduce((a, s) => a + s.netNgn, 0);
            return (
              <Card key={key}>
                <CardHeader className="flex-row items-center justify-between">
                  <div>
                    <CardTitle>{monthLabel(first.periodYear, first.periodMonth)}</CardTitle>
                    <p className="text-sm text-muted-foreground">{formatNgn(total)} net</p>
                  </div>
                  <StatusBadge value={first.runStatus} />
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full min-w-[36rem] text-left text-sm">
                    <thead className="text-xs tracking-wide text-muted-foreground uppercase">
                      <tr className="border-b border-border">
                        <th className="py-2 font-medium">Person</th>
                        <th className="py-2 font-medium">Basic</th>
                        <th className="py-2 font-medium">Housing</th>
                        <th className="py-2 font-medium">Pension</th>
                        <th className="py-2 font-medium">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {slips.map((s) => (
                        <tr
                          key={s.id}
                          className="cursor-pointer border-b border-border/70 hover:bg-muted/60"
                          onClick={() => setSlip(s)}
                        >
                          <td className="py-2.5">{s.staffName}</td>
                          <td className="py-2.5 tabular-nums">{formatNgn(s.basicNgn)}</td>
                          <td className="py-2.5 tabular-nums">{formatNgn(s.allowanceNgn)}</td>
                          <td className="py-2.5 tabular-nums">{formatNgn(s.deductionNgn)}</td>
                          <td className="py-2.5 tabular-nums font-medium">{formatNgn(s.netNgn)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(slip)} onOpenChange={() => setSlip(null)}>
        <DialogContent>
          {slip ? (
            <>
              <DialogHeader>
                <DialogTitle>Payslip · {slip.staffName}</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">
                {company} · {monthLabel(slip.periodYear, slip.periodMonth)}
              </p>
              <dl className="space-y-2 text-sm">
                <Row k="Basic" v={formatNgn(slip.basicNgn)} />
                <Row k="Housing allowance" v={formatNgn(slip.allowanceNgn)} />
                <Row k="Pension (8%)" v={`− ${formatNgn(slip.deductionNgn)}`} />
                <Row k="Net pay" v={formatNgn(slip.netNgn)} />
              </dl>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="tabular-nums font-medium">{v}</dd>
    </div>
  );
}
