import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatNgn, r as formatDate } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { m as STAFF_STATUSES, s as DEPARTMENTS, t as BANKS } from "./constants-C6wSzqdU.mjs";
import { t as PersonChip } from "./person-chip-CZM1RLbM.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { f as upsertStaff, o as listStaff } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/staff-BJSkwvF3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StaffPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const isAdmin = boot.data?.access.role === "admin";
	const save = useMutation({
		mutationFn: (data) => upsertStaff({ data }),
		onSuccess: () => {
			toast.success("Staff file saved.");
			setOpen(false);
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["staff"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "People",
			title: "The house",
			description: "Everyone on the payroll. Add a colleague with their work email so they can sign in to their own desk.",
			actions: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: "Add person"
			}) : null
		}),
		staff.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-xl" }, i))
		}) : (staff.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No one on the file yet",
			hint: "Add the first person and share their work email."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3",
			children: (staff.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
					id: s.id,
					name: s.fullName,
					meta: `${s.role} · ${s.department} · ${s.email}`
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: s.status }),
						isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-muted-foreground",
							children: [formatNgn(s.salaryNgn), " / mo"]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "hidden text-muted-foreground md:inline",
							children: ["Since ", formatDate(s.hireDate)]
						}),
						isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => {
								setEditing(s);
								setOpen(true);
							},
							children: "Edit"
						}) : null
					]
				})]
			}) }, s.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StaffDialog, {
			open,
			onOpenChange: setOpen,
			editing,
			busy: save.isPending,
			onSave: (data) => save.mutate(data)
		})
	] });
}
function StaffDialog({ open, onOpenChange, editing, busy, onSave }) {
	const [department, setDepartment] = (0, import_react.useState)("Sales");
	const [status, setStatus] = (0, import_react.useState)("active");
	const [bankName, setBankName] = (0, import_react.useState)("GTBank");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setDepartment(editing?.department ?? "Sales");
		setStatus(editing?.status ?? "active");
		setBankName(editing?.bankName ?? "GTBank");
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[90svh] overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
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
						accountNumber: String(fd.get("accountNumber") || "")
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit person" : "Add person" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Use the email they will sign in with. When they create an account on that address they land on their own desk — clock, tasks, payslips. Salaries stay on the operations desk."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								name: "fullName",
								defaultValue: editing?.fullName,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Work email",
								name: "email",
								type: "email",
								defaultValue: editing?.email,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								name: "phone",
								defaultValue: editing?.phone,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Role",
								name: "role",
								defaultValue: editing?.role ?? "Agent",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Department" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: department,
									onValueChange: setDepartment,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: d,
										children: d
									}, d)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Monthly salary (₦)",
								name: "salaryNgn",
								type: "number",
								defaultValue: editing?.salaryNgn ?? 5e5,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Hire date",
								name: "hireDate",
								type: "date",
								defaultValue: editing?.hireDate,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: status,
									onValueChange: setStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STAFF_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s.replace("_", " ")
									}, s)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bank" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: bankName,
									onValueChange: setBankName,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: BANKS.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: b,
										children: b
									}, b)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Account number",
								name: "accountNumber",
								defaultValue: editing?.accountNumber ?? ""
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: "Save"
					}) })
				]
			}, editing?.id ?? "new")
		})
	});
}
function Field({ label, name, type = "text", defaultValue, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: name,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: name,
			name,
			type,
			defaultValue: defaultValue ?? "",
			required
		})]
	});
}
//#endregion
export { StaffPage as component };
