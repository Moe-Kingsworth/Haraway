import { useEffect, useState } from "react";
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
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BANKS, DEPARTMENTS, STAFF_STATUSES } from "@/lib/constants";
import { formatDate, formatNgn } from "@/lib/format";
import { getBootstrap } from "@/lib/server/access";
import { listStaff, upsertStaff } from "@/lib/server/people";
import type { Staff } from "@/lib/types";

export const Route = createFileRoute("/staff")({ component: StaffPage });

function StaffPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Staff | null>(null);
  const isAdmin = boot.data?.access.role === "admin";

  const save = useMutation({
    mutationFn: (data: Parameters<typeof upsertStaff>[0]["data"]) => upsertStaff({ data }),
    onSuccess: () => {
      toast.success("Staff file saved.");
      setOpen(false);
      setEditing(null);
      void qc.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        kicker="People"
        title="The house"
        description="Everyone on the payroll. Add a colleague with their work email so they can sign in to their own desk."
        actions={
          isAdmin ? (
            <Button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
            >
              Add person
            </Button>
          ) : null
        }
      />

      {staff.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : (staff.data ?? []).length === 0 ? (
        <EmptyState title="No one on the file yet" hint="Add the first person and share their work email." />
      ) : (
        <div className="grid gap-3">
          {(staff.data ?? []).map((s) => (
            <Card key={s.id}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <PersonChip id={s.id} name={s.fullName} meta={`${s.role} · ${s.department} · ${s.email}`} />
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <StatusBadge value={s.status} />
                  {isAdmin ? (
                    <span className="tabular-nums text-muted-foreground">{formatNgn(s.salaryNgn)} / mo</span>
                  ) : null}
                  <span className="hidden text-muted-foreground md:inline">Since {formatDate(s.hireDate)}</span>
                  {isAdmin ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditing(s);
                        setOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <StaffDialog
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        busy={save.isPending}
        onSave={(data) => save.mutate(data)}
      />
    </AppShell>
  );
}

function StaffDialog({
  open,
  onOpenChange,
  editing,
  busy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: Staff | null;
  busy: boolean;
  onSave: (data: Parameters<typeof upsertStaff>[0]["data"]) => void;
}) {
  const [department, setDepartment] = useState("Sales");
  const [status, setStatus] = useState("active");
  const [bankName, setBankName] = useState("GTBank");

  useEffect(() => {
    if (!open) return;
    setDepartment(editing?.department ?? "Sales");
    setStatus(editing?.status ?? "active");
    setBankName(editing?.bankName ?? "GTBank");
  }, [open, editing]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <form
          key={editing?.id ?? "new"}
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            onSave({
              id: editing?.id,
              fullName: String(fd.get("fullName")),
              email: String(fd.get("email")),
              phone: String(fd.get("phone")),
              role: String(fd.get("role")),
              department,
              salaryNgn: Number(fd.get("salaryNgn")),
              hireDate: String(fd.get("hireDate")),
              status,
              bankName,
              accountNumber: String(fd.get("accountNumber") || ""),
            });
          }}
        >
          <DialogHeader>
            <DialogTitle>{editing ? "Edit person" : "Add person"}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Use the email they will sign in with. When they create an account on that address they
            land on their own desk — clock, tasks, payslips. Salaries stay on the operations desk.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name" name="fullName" defaultValue={editing?.fullName} required />
            <Field label="Work email" name="email" type="email" defaultValue={editing?.email} required />
            <Field label="Phone" name="phone" defaultValue={editing?.phone} required />
            <Field label="Role" name="role" defaultValue={editing?.role ?? "Agent"} required />
            <div className="space-y-1.5">
              <Label>Department</Label>
              <Select value={department} onValueChange={setDepartment}>
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
            <Field
              label="Monthly salary (₦)"
              name="salaryNgn"
              type="number"
              defaultValue={editing?.salaryNgn ?? 500000}
              required
            />
            <Field label="Hire date" name="hireDate" type="date" defaultValue={editing?.hireDate} required />
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STAFF_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Bank</Label>
              <Select value={bankName} onValueChange={setBankName}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BANKS.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Field label="Account number" name="accountNumber" defaultValue={editing?.accountNumber ?? ""} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={busy}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} />
    </div>
  );
}
