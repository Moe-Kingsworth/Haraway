import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as formatDate } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { r as cn, t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { g as TASK_STATUSES, h as TASK_PRIORITIES } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { o as listStaff, p as upsertTask, s as listTasks } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-DUJFZ-7C.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLS = [
	"todo",
	"doing",
	"blocked",
	"done"
];
function TasksPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const tasks = useQuery({
		queryKey: ["tasks"],
		queryFn: () => listTasks()
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const isAdmin = boot.data?.access.role === "admin";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const save = useMutation({
		mutationFn: (data) => upsertTask({ data }),
		onSuccess: () => {
			toast.success("Task saved.");
			setOpen(false);
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["tasks"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const move = useMutation({
		mutationFn: (data) => upsertTask({ data: {
			id: data.id,
			title: tasks.data?.find((t) => t.id === data.id)?.title ?? "Task",
			status: data.status,
			priority: tasks.data?.find((t) => t.id === data.id)?.priority ?? "medium"
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["tasks"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Tasks",
			title: "On the board",
			description: "What the house is carrying. Move a card when the work moves.",
			actions: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: "New task"
			}) : null
		}),
		tasks.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }, i))
		}) : (tasks.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "The board is empty",
			hint: "Assign the first piece of work."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: COLS.map((col) => {
				const items = (tasks.data ?? []).filter((t) => t.status === col);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase",
						children: col === "todo" ? "To do" : col === "doing" ? "In hand" : col
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: items.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: cn("cursor-pointer"),
							onClick: () => {
								setEditing(t);
								setOpen(true);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: t.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: t.priority }), t.dueDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground",
											children: formatDate(t.dueDate)
										}) : null]
									}),
									t.staffName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: t.staffName
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1",
										onClick: (e) => e.stopPropagation(),
										children: COLS.filter((c) => c !== t.status).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "h-7 px-2 text-xs",
											onClick: () => move.mutate({
												id: t.id,
												status: c
											}),
											children: c === "todo" ? "To do" : c === "doing" ? "In hand" : c
										}, c))
									})
								]
							})
						}, t.id))
					})]
				}, col);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskDialog, {
			open,
			onOpenChange: setOpen,
			editing,
			isAdmin: Boolean(isAdmin),
			staff: (staff.data ?? []).map((s) => ({
				id: s.id,
				name: s.fullName
			})),
			busy: save.isPending,
			onSave: (data) => save.mutate(data)
		})
	] });
}
function TaskDialog({ open, onOpenChange, editing, isAdmin, staff, busy, onSave }) {
	const [priority, setPriority] = (0, import_react.useState)("medium");
	const [status, setStatus] = (0, import_react.useState)("todo");
	const [staffId, setStaffId] = (0, import_react.useState)("none");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setPriority(editing?.priority ?? "medium");
		setStatus(editing?.status ?? "todo");
		setStaffId(editing?.staffId ? String(editing.staffId) : "none");
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				const fd = new FormData(e.currentTarget);
				onSave({
					id: editing?.id,
					title: String(fd.get("title")),
					description: String(fd.get("description") || ""),
					staffId: staffId === "none" ? null : Number(staffId),
					priority,
					status,
					dueDate: String(fd.get("dueDate") || "") || null
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Task" : "New task" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "title",
						children: "Title"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "title",
						name: "title",
						defaultValue: editing?.title,
						required: true,
						readOnly: !isAdmin && Boolean(editing)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "description",
						children: "Notes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "description",
						name: "description",
						defaultValue: editing?.description ?? "",
						readOnly: !isAdmin && Boolean(editing)
					})]
				}),
				isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Priority" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: priority,
							onValueChange: setPriority,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TASK_PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: p,
								children: p
							}, p)) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assign" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: staffId,
							onValueChange: setStaffId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "none",
								children: "Unassigned"
							}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: String(s.id),
								children: s.name
							}, s.id))] })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "dueDate",
						children: "Due"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "dueDate",
						name: "dueDate",
						type: "date",
						defaultValue: editing?.dueDate ?? ""
					})]
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: status,
						onValueChange: setStatus,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TASK_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: "Save"
				}) })
			]
		}, editing?.id ?? "new") })
	});
}
//#endregion
export { TasksPage as component };
