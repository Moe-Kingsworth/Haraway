import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Filter,
  Palmtree,
  Shield,
  UserCheck,
  UserPlus,
  Users,
  UserX,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { PersonChip } from "@/components/person-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DEPARTMENTS } from "@/lib/constants";
import { formatTimeWAT } from "@/lib/format";
import { getSuperAdminDashboard } from "@/lib/server/admin";
import { supabase } from "@/lib/supabase";
import type { SuperAdminAttendanceRow } from "@/lib/types";

function AttendanceBadge({ status }: { status: SuperAdminAttendanceRow["status"] }) {
  switch (status) {
    case "Complete":
      return (
        <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 gap-1 font-medium">
          <CheckCircle2 className="size-3" />
          Complete
        </Badge>
      );
    case "Incomplete":
      return (
        <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 gap-1 font-medium">
          <Clock className="size-3" />
          Incomplete
        </Badge>
      );
    case "On Leave":
      return (
        <Badge className="bg-sky-500/15 text-sky-700 hover:bg-sky-500/20 border-sky-500/30 gap-1 font-medium">
          <Palmtree className="size-3" />
          On Leave
        </Badge>
      );
    case "Absent":
    default:
      return (
        <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 border-rose-500/30 gap-1 font-medium">
          <XCircle className="size-3" />
          Absent
        </Badge>
      );
  }
}

export function SuperAdminDashboard() {
  const qc = useQueryClient();
  const [deptFilter, setDeptFilter] = useState<string>("all");

  const query = useQuery({
    queryKey: ["super-admin-dashboard"],
    queryFn: () => getSuperAdminDashboard(),
  });

  // Supabase Real-time updates
  useEffect(() => {
    const channel = supabase
      .channel("super_admin_live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "attendance" },
        () => {
          void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "audit_log" },
        () => {
          void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "staff" },
        () => {
          void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [qc]);

  const data = query.data;

  const filteredAttendance = useMemo(() => {
    if (!data?.attendanceRows) return [];
    if (deptFilter === "all") return data.attendanceRows;
    return data.attendanceRows.filter((r) => r.department === deptFilter);
  }, [data?.attendanceRows, deptFilter]);

  if (query.isLoading || !data) {
    return (
      <div className="space-y-6">
        <PageHeader
          kicker="Command Centre"
          title="Super Admin Dashboard"
          description="Live attendance surveillance, system security events, and workforce oversight."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
          <Skeleton className="h-28 rounded-xl" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Command Centre"
        title="Super Admin Dashboard"
        description="Live attendance surveillance, system security audit feed, and workforce analytics in real time."
        actions={
          <div className="flex items-center gap-2">
            <Link to="/users">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <Users className="mr-2 size-4" />
                Manage Users
              </Button>
            </Link>
            <Link to="/audit-log">
              <Button variant="outline">
                <Shield className="mr-2 size-4" />
                Full Audit Log
              </Button>
            </Link>
          </div>
        }
      />

      {/* Staff Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="rounded-xl border border-border/80 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Active Staff
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                {data.staffSummary.totalActive}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Accounts currently in service</p>
            </div>
            <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-600">
              <UserCheck className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/80 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Suspended Accounts
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                {data.staffSummary.suspended}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">Restricted from portal login</p>
            </div>
            <div className="rounded-xl bg-rose-500/10 p-3 text-rose-600">
              <UserX className="size-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-border/80 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Created This Month
              </p>
              <p className="mt-2 font-display text-3xl font-semibold tabular-nums text-foreground">
                {data.staffSummary.createdThisMonth}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">New onboarded staff profiles</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3 text-primary">
              <UserPlus className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Live Attendance & Activity Feed */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Live Attendance Panel (2 cols on large screen) */}
        <Card className="lg:col-span-2 rounded-xl border border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">Live Attendance Panel</CardTitle>
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live (Today)
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Real-time clock-in monitoring across all departments. View only.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="size-3.5 text-muted-foreground" />
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Summary Strip */}
            <div className="grid grid-cols-4 gap-2 rounded-lg bg-muted/50 p-2.5 text-center border border-border/60">
              <div className="border-r border-border/50 pr-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total Present
                </p>
                <p className="mt-0.5 font-display text-xl font-bold text-emerald-600 tabular-nums">
                  {data.summary.totalPresent}
                </p>
              </div>
              <div className="border-r border-border/50 pr-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Total Absent
                </p>
                <p className="mt-0.5 font-display text-xl font-bold text-rose-600 tabular-nums">
                  {data.summary.totalAbsent}
                </p>
              </div>
              <div className="border-r border-border/50 pr-2">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Incomplete
                </p>
                <p className="mt-0.5 font-display text-xl font-bold text-amber-600 tabular-nums">
                  {data.summary.incomplete}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  On Leave
                </p>
                <p className="mt-0.5 font-display text-xl font-bold text-sky-600 tabular-nums">
                  {data.summary.onLeave}
                </p>
              </div>
            </div>

            {/* Attendance Table */}
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Clock In</th>
                    <th className="px-4 py-3">Clock Out</th>
                    <th className="px-4 py-3 text-right">Status Badge</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                        No staff members found for the selected department.
                      </td>
                    </tr>
                  ) : (
                    filteredAttendance.map((row) => (
                      <tr key={row.staffId} className="hover:bg-muted/40 transition-colors">
                        <td className="px-4 py-3 font-medium">
                          <PersonChip id={row.staffId} name={row.name} size="sm" />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {row.department}
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums text-foreground">
                          {row.clockIn ? formatTimeWAT(row.clockIn) : "—"}
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums text-foreground">
                          {row.clockOut ? formatTimeWAT(row.clockOut) : "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <AttendanceBadge status={row.status} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Activity Feed */}
        <Card className="rounded-xl border border-border/80 shadow-sm flex flex-col">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="size-4 text-primary" />
                System Activity Feed
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest 10 security & management events.
              </p>
            </div>
            <Link to="/audit-log" className="text-xs text-primary hover:underline font-medium">
              View all
            </Link>
          </CardHeader>
          <CardContent className="flex-1 overflow-hidden p-0">
            {data.auditLogs.length === 0 ? (
              <div className="p-6 text-center text-xs text-muted-foreground">
                No audit events recorded yet.
              </div>
            ) : (
              <div className="max-h-[460px] overflow-y-auto divide-y divide-border/50 px-5">
                {data.auditLogs.map((log) => (
                  <div key={log.id} className="py-3 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-foreground truncate max-w-[140px]">
                        {log.actorName}
                      </span>
                      <span className="text-[10px] text-muted-foreground tabular-nums">
                        {new Date(log.timestamp).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          timeZone: "Africa/Lagos",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground/90">{log.action}:</span>
                      <span className="truncate">{log.target}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
