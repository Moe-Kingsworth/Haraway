import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { getBootstrap } from "@/lib/server/access";
import { listAuditLogs } from "@/lib/server/admin";

export const Route = createFileRoute("/audit-log")({ component: AuditLogPage });

const COMMON_ACTIONS = [
  "All Actions",
  "Create User",
  "Edit User",
  "Suspend User",
  "Reactivate User",
  "Reset Password",
  "Promote to Super Admin",
  "Create Job Posting",
  "Update Job Posting",
  "Delete Job Posting",
  "Submit Application",
  "Update Application Status",
  "Convert to Staff",
];

function ActionBadge({ action }: { action: string }) {
  if (action.includes("Suspend") || action.includes("Delete")) {
    return <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30 font-medium">{action}</Badge>;
  }
  if (action.includes("Create") || action.includes("Convert")) {
    return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-medium">{action}</Badge>;
  }
  if (action.includes("Promote") || action.includes("Reset")) {
    return <Badge className="bg-primary/15 text-primary border-primary/30 font-medium">{action}</Badge>;
  }
  return <Badge variant="outline">{action}</Badge>;
}

function AuditLogPage() {
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const isSuperAdmin = boot.data?.access.role === "super_admin";

  const [page, setPage] = useState(1);
  const [actionType, setActionType] = useState("All Actions");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const query = useQuery({
    queryKey: ["audit-logs", page, actionType, startDate, endDate],
    queryFn: () =>
      listAuditLogs({
        data: {
          actionType: actionType === "All Actions" ? undefined : actionType,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
          page,
          limit: 20,
        },
      }),
    enabled: isSuperAdmin,
  });

  if (!isSuperAdmin && !boot.isLoading) {
    return (
      <AppShell>
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <ShieldAlert className="mx-auto size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The Audit Log is restricted to Super Admins for compliance and security auditing.
          </p>
        </div>
      </AppShell>
    );
  }

  const logs = query.data?.rows ?? [];
  const totalPages = query.data?.totalPages ?? 1;
  const totalCount = query.data?.totalCount ?? 0;

  return (
    <AppShell>
      <PageHeader
        kicker="Security & Compliance"
        title="System Audit Log"
        description="Immutable record of administrative operations, account modifications, and hiring transactions."
      />

      <Card className="rounded-xl border border-border">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-end gap-3 pb-2 border-b border-border/60">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Action Type</Label>
              <Select
                value={actionType}
                onValueChange={(v) => {
                  setActionType(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-9 w-48 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMON_ACTIONS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">From Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-36 text-xs"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">To Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-36 text-xs"
              />
            </div>

            {(actionType !== "All Actions" || startDate || endDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setActionType("All Actions");
                  setStartDate("");
                  setEndDate("");
                  setPage(1);
                }}
                className="text-xs h-9"
              >
                <RotateCcw className="mr-1 size-3.5" />
                Reset Filters
              </Button>
            )}

            <div className="ml-auto text-xs text-muted-foreground self-center">
              Total entries: <span className="font-semibold text-foreground">{totalCount}</span>
            </div>
          </div>

          {/* Table */}
          {query.isLoading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Timestamp (WAT)</th>
                    <th className="px-4 py-3">Actor</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Target</th>
                    <th className="px-4 py-3">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                        No audit records found matching the filters.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 text-xs tabular-nums text-muted-foreground whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString("en-GB", {
                            dateStyle: "short",
                            timeStyle: "medium",
                            timeZone: "Africa/Lagos",
                          })}
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                          {log.actorName}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <ActionBadge action={log.action} />
                        </td>
                        <td className="px-4 py-3 font-medium text-foreground">
                          {log.target}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs font-mono truncate">
                          {log.details ? JSON.stringify(log.details) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || query.isLoading}
                className="h-8 text-xs"
              >
                <ChevronLeft className="mr-1 size-3.5" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || query.isLoading}
                className="h-8 text-xs"
              >
                Next
                <ChevronRight className="ml-1 size-3.5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
