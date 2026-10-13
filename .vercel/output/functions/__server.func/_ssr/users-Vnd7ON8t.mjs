import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { m as ROLES, s as DEPARTMENTS, x as roleLabel } from "./constants-Dvnu62zU.mjs";
import { a as getBootstrap } from "./access-DIVfVghL.mjs";
import { D as KeyRound, I as Ellipsis, _ as RotateCcw, h as Search, i as UserX, m as ShieldAlert, o as UserCog, p as ShieldCheck, y as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, t as Badge } from "./badge-BJzbO8FA.mjs";
import { t as AppShell } from "./app-shell-DuzJoH7o.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { n as CardContent, t as Card } from "./card-DHh5pwIE.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Bq583Q1q.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { t as Label } from "./label-CPeUE8i1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { t as PersonChip } from "./person-chip-CngTrjLx.mjs";
import { a as listUsers, c as reactivateUser, l as resetUserPassword, n as editUser, s as promoteSuperAdmin, t as createUser, u as suspendUser } from "./admin-DtxWFnV4.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-D3sYENOi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-Vnd7ON8t.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RoleBadge({ role }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		className: role === "super_admin" ? "border-primary/40 bg-primary/10 text-primary font-semibold" : role === "executive" || role === "hr_admin" ? "border-accent/40 bg-accent/10 text-accent font-medium" : "border-border text-foreground/80",
		children: roleLabel(role)
	});
}
function StatusBadge({ status }) {
	if (status === "active") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
		children: "Active"
	});
	if (status === "suspended") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-rose-500/15 text-rose-700 border-rose-500/30",
		children: "Suspended"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "secondary",
		children: status
	});
}
function UsersPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const usersQuery = useQuery({
		queryKey: ["admin-users"],
		queryFn: () => listUsers()
	});
	const [search, setSearch] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [selectedUser, setSelectedUser] = (0, import_react.useState)(null);
	const [newFullName, setNewFullName] = (0, import_react.useState)("");
	const [newEmail, setNewEmail] = (0, import_react.useState)("");
	const [newPhone, setNewPhone] = (0, import_react.useState)("");
	const [newEmpId, setNewEmpId] = (0, import_react.useState)("");
	const [newDept, setNewDept] = (0, import_react.useState)("Sales");
	const [newPosition, setNewPosition] = (0, import_react.useState)("");
	const [newRole, setNewRole] = (0, import_react.useState)("staff");
	const [newStatus, setNewStatus] = (0, import_react.useState)("active");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [editFullName, setEditFullName] = (0, import_react.useState)("");
	const [editPhone, setEditPhone] = (0, import_react.useState)("");
	const [editEmpId, setEditEmpId] = (0, import_react.useState)("");
	const [editDept, setEditDept] = (0, import_react.useState)("Sales");
	const [editPosition, setEditPosition] = (0, import_react.useState)("");
	const [editRole, setEditRole] = (0, import_react.useState)("staff");
	const [editStatus, setEditStatus] = (0, import_react.useState)("active");
	const isSuperAdmin = boot.data?.access.role === "super_admin";
	const createMutation = useMutation({
		mutationFn: () => createUser({ data: {
			fullName: newFullName,
			email: newEmail,
			phone: newPhone,
			employeeId: newEmpId,
			department: newDept,
			position: newPosition,
			role: newRole,
			status: newStatus,
			temporaryPassword: newPassword
		} }),
		onSuccess: () => {
			toast.success("User created successfully");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
			setCreateOpen(false);
			resetCreateForm();
		},
		onError: (e) => toast.error(e.message)
	});
	const editMutation = useMutation({
		mutationFn: () => {
			if (!selectedUser) throw new Error("No user selected.");
			return editUser({ data: {
				id: selectedUser.id,
				fullName: editFullName,
				phone: editPhone,
				employeeId: editEmpId,
				department: editDept,
				position: editPosition,
				role: editRole,
				status: editStatus
			} });
		},
		onSuccess: () => {
			toast.success("User updated successfully");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
			setEditOpen(false);
		},
		onError: (e) => toast.error(e.message)
	});
	const suspendMutation = useMutation({
		mutationFn: (id) => suspendUser({ data: { id } }),
		onSuccess: () => {
			toast.success("User account suspended.");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const reactivateMutation = useMutation({
		mutationFn: (id) => reactivateUser({ data: { id } }),
		onSuccess: () => {
			toast.success("User account reactivated.");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const resetPasswordMutation = useMutation({
		mutationFn: (id) => resetUserPassword({ data: { id } }),
		onSuccess: (res) => {
			toast.success(`Password reset. Temporary password: ${res.temporaryPassword}`, { duration: 1e4 });
			qc.invalidateQueries({ queryKey: ["admin-users"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const promoteMutation = useMutation({
		mutationFn: (id) => promoteSuperAdmin({ data: { id } }),
		onSuccess: () => {
			toast.success("User promoted to Super Admin.");
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function resetCreateForm() {
		setNewFullName("");
		setNewEmail("");
		setNewPhone("");
		setNewEmpId(`ES-${Math.floor(1e3 + Math.random() * 9e3)}`);
		setNewDept("Sales");
		setNewPosition("Associate");
		setNewRole("staff");
		setNewStatus("active");
		setNewPassword(`Eden#${Math.floor(1e5 + Math.random() * 9e5)}`);
	}
	function openEdit(user) {
		setSelectedUser(user);
		setEditFullName(user.fullName);
		setEditPhone(user.phone);
		setEditEmpId(user.employeeId ?? `ES-${String(user.id).padStart(4, "0")}`);
		setEditDept(user.department || "Sales");
		setEditPosition(user.position ?? "");
		setEditRole(user.role);
		setEditStatus(user.status);
		setEditOpen(true);
	}
	const users = usersQuery.data ?? [];
	const filteredUsers = (0, import_react.useMemo)(() => {
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
	}, [
		users,
		deptFilter,
		roleFilter,
		statusFilter,
		search
	]);
	if (!isSuperAdmin && !boot.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-8 text-center space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mx-auto size-12 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground max-w-md mx-auto",
				children: "The User Management system is only accessible to users with the Super Admin role."
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Security & Administration",
			title: "User Management",
			description: "Provision staff accounts, configure roles, reset credentials, and oversee permissions.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => {
					resetCreateForm();
					setCreateOpen(true);
				},
				className: "bg-primary text-primary-foreground hover:bg-primary/90",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Create User"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 sm:p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search by name, email, or employee ID...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-9 h-9 text-xs"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: deptFilter,
								onValueChange: setDeptFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-36 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Department" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Departments"
								}), DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: d,
									children: d
								}, d))] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: roleFilter,
								onValueChange: setRoleFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-32 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Role" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Roles"
								}), ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: r,
									children: roleLabel(r)
								}, r))] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-28 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Active"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "suspended",
										children: "Suspended"
									})
								] })]
							})
						]
					})]
				}), usersQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto rounded-lg border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/60 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Full Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Employee ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Position"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Role Badge"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: filteredUsers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 7,
								className: "py-12 text-center text-sm text-muted-foreground",
								children: "No users match the selected criteria."
							}) }) : filteredUsers.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
												id: user.id,
												name: user.fullName,
												size: "sm"
											}), user.isFounderAccount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] uppercase font-semibold text-accent border border-accent/40 bg-accent/10 px-1.5 py-0.5 rounded",
												children: "Founder"
											}) : null]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground block pl-9",
											children: user.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs font-mono text-muted-foreground",
										children: user.employeeId ?? `ES-${String(user.id).padStart(4, "0")}`
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs text-foreground font-medium",
										children: user.department
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs text-muted-foreground",
										children: user.position || "Associate"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: user.role })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: user.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "size-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "w-48",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
													className: "text-xs",
													children: "User Actions"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => openEdit(user),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "mr-2 size-4" }), "Edit User"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => resetPasswordMutation.mutate(user.id),
													disabled: resetPasswordMutation.isPending,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "mr-2 size-4" }), "Reset Password"]
												}),
												user.role !== "super_admin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => promoteMutation.mutate(user.id),
													disabled: promoteMutation.isPending,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "mr-2 size-4 text-primary" }), "Promote to Admin"]
												}) : null,
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
												user.status === "active" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => {
														if (user.isFounderAccount) {
															toast.error("Cannot suspend the founder account.");
															return;
														}
														suspendMutation.mutate(user.id);
													},
													disabled: user.isFounderAccount || suspendMutation.isPending,
													className: "text-destructive focus:text-destructive",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "mr-2 size-4" }), "Suspend Account"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => reactivateMutation.mutate(user.id),
													disabled: reactivateMutation.isPending,
													className: "text-emerald-600 focus:text-emerald-600",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-2 size-4" }), "Reactivate Account"]
												})
											]
										})] })
									})
								]
							}, user.id))
						})]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: createOpen,
			onOpenChange: setCreateOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create New Staff Account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Provision a new Eden Shelters portal account. A temporary password will require password change on initial login." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Full Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. Amina Mohammed",
									value: newFullName,
									onChange: (e) => setNewFullName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Email *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										placeholder: "name@edenshelters.ng",
										value: newEmail,
										onChange: (e) => setNewEmail(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Phone Number *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "+234 803 000 0000",
										value: newPhone,
										onChange: (e) => setNewPhone(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Employee ID *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "ES-0012",
										value: newEmpId,
										onChange: (e) => setNewEmpId(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Department *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newDept,
										onValueChange: (v) => setNewDept(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: d,
											children: d
										}, d)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Position *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Sales Associate",
										value: newPosition,
										onChange: (e) => setNewPosition(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Role *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newRole,
										onValueChange: (v) => setNewRole(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: r,
											children: roleLabel(r)
										}, r)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newStatus,
										onValueChange: setNewStatus,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "active",
											children: "Active"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "suspended",
											children: "Suspended"
										})] })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Temporary Password *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										value: newPassword,
										onChange: (e) => setNewPassword(e.target.value)
									})]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setCreateOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => createMutation.mutate(),
						disabled: createMutation.isPending || !newFullName || !newEmail || !newPassword,
						className: "bg-primary text-primary-foreground",
						children: createMutation.isPending ? "Creating..." : "Create User"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: editOpen,
			onOpenChange: setEditOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Staff Account" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Update user role, department, employee ID, and status." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: editFullName,
									onChange: (e) => setEditFullName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Email (Read Only)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: selectedUser?.email ?? "",
										disabled: true,
										className: "bg-muted"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editPhone,
										onChange: (e) => setEditPhone(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Employee ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editEmpId,
										onChange: (e) => setEditEmpId(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editDept,
										onValueChange: (v) => setEditDept(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: d,
											children: d
										}, d)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Position"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editPosition,
										onChange: (e) => setEditPosition(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-xs",
										children: ["Role ", selectedUser?.isFounderAccount ? "(Locked: Founder)" : ""]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: editRole,
										onValueChange: (v) => setEditRole(v),
										disabled: selectedUser?.isFounderAccount,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: r,
											children: roleLabel(r)
										}, r)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs",
									children: ["Status ", selectedUser?.isFounderAccount ? "(Locked: Founder)" : ""]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: editStatus,
									onValueChange: setEditStatus,
									disabled: selectedUser?.isFounderAccount,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "active",
										children: "Active"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "suspended",
										children: "Suspended"
									})] })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEditOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => editMutation.mutate(),
						disabled: editMutation.isPending,
						className: "bg-primary text-primary-foreground",
						children: editMutation.isPending ? "Saving..." : "Save Changes"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { UsersPage as component };
