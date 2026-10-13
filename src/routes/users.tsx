import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserCog,
  UserX,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { PersonChip } from "@/components/person-chip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { DEPARTMENTS, ROLES, roleLabel, type Role } from "@/lib/constants";
import { getBootstrap } from "@/lib/server/access";
import {
  createUser,
  editUser,
  listUsers,
  promoteSuperAdmin,
  reactivateUser,
  resetUserPassword,
  suspendUser,
} from "@/lib/server/admin";
import type { Staff } from "@/lib/types";

export const Route = createFileRoute("/users")({ component: UsersPage });

function RoleBadge({ role }: { role: Role }) {
  const isSuper = role === "super_admin";
  const isExec = role === "executive" || role === "hr_admin";
  return (
    <Badge
      variant="outline"
      className={
        isSuper
          ? "border-primary/40 bg-primary/10 text-primary font-semibold"
          : isExec
            ? "border-accent/40 bg-accent/10 text-accent font-medium"
            : "border-border text-foreground/80"
      }
    >
      {roleLabel(role)}
    </Badge>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "active") {
    return <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-500/30">Active</Badge>;
  }
  if (status === "suspended") {
    return <Badge className="bg-rose-500/15 text-rose-700 border-rose-500/30">Suspended</Badge>;
  }
  return <Badge variant="secondary">{status}</Badge>;
}

function UsersPage() {
  const qc = useQueryClient();
  const boot = useQuery({ queryKey: ["bootstrap"], queryFn: () => getBootstrap() });
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: () => listUsers() });

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Staff | null>(null);

  // Create form state
  const [newFullName, setNewFullName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newDept, setNewDept] = useState<(typeof DEPARTMENTS)[number]>("Sales");
  const [newPosition, setNewPosition] = useState("");
  const [newRole, setNewRole] = useState<Role>("staff");
  const [newStatus, setNewStatus] = useState("active");
  const [newPassword, setNewPassword] = useState("");

  // Edit form state
  const [editFullName, setEditFullName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editEmpId, setEditEmpId] = useState("");
  const [editDept, setEditDept] = useState<(typeof DEPARTMENTS)[number]>("Sales");
  const [editPosition, setEditPosition] = useState("");
  const [editRole, setEditRole] = useState<Role>("staff");
  const [editStatus, setEditStatus] = useState("active");

  const isSuperAdmin = boot.data?.access.role === "super_admin";

  const createMutation = useMutation({
    mutationFn: () =>
      createUser({
        data: {
          fullName: newFullName,
          email: newEmail,
          phone: newPhone,
          employeeId: newEmpId,
          department: newDept,
          position: newPosition,
          role: newRole,
          status: newStatus,
          temporaryPassword: newPassword,
        },
      }),
    onSuccess: () => {
      toast.success("User created successfully");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
      setCreateOpen(false);
      resetCreateForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const editMutation = useMutation({
    mutationFn: () => {
      if (!selectedUser) throw new Error("No user selected.");
      return editUser({
        data: {
          id: selectedUser.id,
          fullName: editFullName,
          phone: editPhone,
          employeeId: editEmpId,
          department: editDept,
          position: editPosition,
          role: editRole,
          status: editStatus,
        },
      });
    },
    onSuccess: () => {
      toast.success("User updated successfully");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
      setEditOpen(false);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: number) => suspendUser({ data: { id } }),
    onSuccess: () => {
      toast.success("User account suspended.");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: number) => reactivateUser({ data: { id } }),
    onSuccess: () => {
      toast.success("User account reactivated.");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: number) => resetUserPassword({ data: { id } }),
    onSuccess: (res) => {
      toast.success(`Password reset. Temporary password: ${res.temporaryPassword}`, {
        duration: 10000,
      });
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const promoteMutation = useMutation({
    mutationFn: (id: number) => promoteSuperAdmin({ data: { id } }),
    onSuccess: () => {
      toast.success("User promoted to Super Admin.");
      void qc.invalidateQueries({ queryKey: ["admin-users"] });
      void qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function resetCreateForm() {
    setNewFullName("");
    setNewEmail("");
    setNewPhone("");
    setNewEmpId(`ES-${Math.floor(1000 + Math.random() * 9000)}`);
    setNewDept("Sales");
    setNewPosition("Associate");
    setNewRole("staff");
    setNewStatus("active");
    setNewPassword(`Eden#${Math.floor(100000 + Math.random() * 900000)}`);
  }

  function openEdit(user: Staff) {
    setSelectedUser(user);
    setEditFullName(user.fullName);
    setEditPhone(user.phone);
    setEditEmpId(user.employeeId ?? `ES-${String(user.id).padStart(4, "0")}`);
    setEditDept((user.department as (typeof DEPARTMENTS)[number]) || "Sales");
    setEditPosition(user.position ?? "");
    setEditRole(user.role);
    setEditStatus(user.status);
    setEditOpen(true);
  }

  const users = usersQuery.data ?? [];

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (deptFilter !== "all" && u.department !== deptFilter) return false;
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (search.trim()) {
        const q = search.trim().toLowerCase();
        const emp = (u.employeeId ?? "").toLowerCase();
        const name = u.fullName.toLowerCase();
        const email = u.email.toLowerCase();
        if (!name.includes(q) && !emp.includes(q) && !email.includes(q)) return false;
      }
      return true;
    });
  }, [users, deptFilter, roleFilter, statusFilter, search]);

  if (!isSuperAdmin && !boot.isLoading) {
    return (
      <AppShell>
        <div className="rounded-xl border border-border bg-card p-8 text-center space-y-4">
          <ShieldAlert className="mx-auto size-12 text-destructive" />
          <h2 className="text-xl font-semibold">Access Restricted</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            The User Management system is only accessible to users with the Super Admin role.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        kicker="Security & Administration"
        title="User Management"
        description="Provision staff accounts, configure roles, reset credentials, and oversee permissions."
        actions={
          <Button
            onClick={() => {
              resetCreateForm();
              setCreateOpen(true);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="mr-2 size-4" />
            Create User
          </Button>
        }
      />

      <Card className="rounded-xl border border-border">
        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or employee ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger className="h-9 w-36 text-xs">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="h-9 w-32 text-xs">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {roleLabel(r)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-28 text-xs">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* User List Table */}
          {usersQuery.isLoading ? (
            <div className="space-y-2 py-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/60 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Employee ID</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Role Badge</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-muted-foreground">
                        No users match the selected criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <PersonChip id={user.id} name={user.fullName} size="sm" />
                            {user.isFounderAccount ? (
                              <span className="text-[10px] uppercase font-semibold text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded">
                                Founder
                              </span>
                            ) : null}
                          </div>
                          <span className="text-xs text-muted-foreground block pl-9">{user.email}</span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                          {user.employeeId ?? `ES-${String(user.id).padStart(4, "0")}`}
                        </td>
                        <td className="px-4 py-3 text-xs text-foreground font-medium">
                          {user.department}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {user.position || "Associate"}
                        </td>
                        <td className="px-4 py-3">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="size-8">
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuLabel className="text-xs">User Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => openEdit(user)}>
                                <UserCog className="mr-2 size-4" />
                                Edit User
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => resetPasswordMutation.mutate(user.id)}
                                disabled={resetPasswordMutation.isPending}
                              >
                                <KeyRound className="mr-2 size-4" />
                                Reset Password
                              </DropdownMenuItem>

                              {user.role !== "super_admin" ? (
                                <DropdownMenuItem
                                  onClick={() => promoteMutation.mutate(user.id)}
                                  disabled={promoteMutation.isPending}
                                >
                                  <ShieldCheck className="mr-2 size-4 text-primary" />
                                  Promote to Admin
                                </DropdownMenuItem>
                              ) : null}

                              <DropdownMenuSeparator />

                              {user.status === "active" ? (
                                <DropdownMenuItem
                                  onClick={() => {
                                    if (user.isFounderAccount) {
                                      toast.error("Cannot suspend the founder account.");
                                      return;
                                    }
                                    suspendMutation.mutate(user.id);
                                  }}
                                  disabled={user.isFounderAccount || suspendMutation.isPending}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <UserX className="mr-2 size-4" />
                                  Suspend Account
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => reactivateMutation.mutate(user.id)}
                                  disabled={reactivateMutation.isPending}
                                  className="text-emerald-600 focus:text-emerald-600"
                                >
                                  <RotateCcw className="mr-2 size-4" />
                                  Reactivate Account
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CREATE USER MODAL */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Staff Account</DialogTitle>
            <DialogDescription>
              Provision a new Eden Shelters portal account. A temporary password will require
              password change on initial login.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name *</Label>
              <Input
                placeholder="e.g. Amina Mohammed"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Email *</Label>
                <Input
                  type="email"
                  placeholder="name@edenshelters.ng"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone Number *</Label>
                <Input
                  placeholder="+234 803 000 0000"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Employee ID *</Label>
                <Input
                  placeholder="ES-0012"
                  value={newEmpId}
                  onChange={(e) => setNewEmpId(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department *</Label>
                <Select
                  value={newDept}
                  onValueChange={(v) => setNewDept(v as (typeof DEPARTMENTS)[number])}
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Position *</Label>
                <Input
                  placeholder="e.g. Sales Associate"
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Role *</Label>
                <Select value={newRole} onValueChange={(v) => setNewRole(v as Role)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Temporary Password *</Label>
                <Input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !newFullName || !newEmail || !newPassword}
              className="bg-primary text-primary-foreground"
            >
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT USER MODAL */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Staff Account</DialogTitle>
            <DialogDescription>
              Update user role, department, employee ID, and status.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Full Name</Label>
              <Input value={editFullName} onChange={(e) => setEditFullName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Email (Read Only)</Label>
                <Input value={selectedUser?.email ?? ""} disabled className="bg-muted" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Phone Number</Label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Employee ID</Label>
                <Input value={editEmpId} onChange={(e) => setEditEmpId(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Department</Label>
                <Select
                  value={editDept}
                  onValueChange={(v) => setEditDept(v as (typeof DEPARTMENTS)[number])}
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Position</Label>
                <Input value={editPosition} onChange={(e) => setEditPosition(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">
                  Role {selectedUser?.isFounderAccount ? "(Locked: Founder)" : ""}
                </Label>
                <Select
                  value={editRole}
                  onValueChange={(v) => setEditRole(v as Role)}
                  disabled={selectedUser?.isFounderAccount}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((r) => (
                      <SelectItem key={r} value={r}>
                        {roleLabel(r)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Status {selectedUser?.isFounderAccount ? "(Locked: Founder)" : ""}
              </Label>
              <Select
                value={editStatus}
                onValueChange={setEditStatus}
                disabled={selectedUser?.isFounderAccount}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => editMutation.mutate()}
              disabled={editMutation.isPending}
              className="bg-primary text-primary-foreground"
            >
              {editMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
