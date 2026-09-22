import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { i as CLIENT_TYPES, n as CLIENT_STAGES, r as CLIENT_STAGE_LABELS } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { o as listStaff } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
import { c as upsertClient, i as listClients } from "./crm-Dhws9iQH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/clients-9GrBFxlG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ClientsPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const clients = useQuery({
		queryKey: ["clients"],
		queryFn: () => listClients()
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const isAdmin = boot.data?.access.role === "admin";
	const save = useMutation({
		mutationFn: (data) => upsertClient({ data }),
		onSuccess: () => {
			toast.success("Client file saved.");
			setOpen(false);
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["clients"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const advance = useMutation({
		mutationFn: (c) => {
			const i = CLIENT_STAGES.indexOf(c.stage);
			const next = CLIENT_STAGES[i + 1];
			if (!next || next === "lost") throw new Error("This file is already at the end.");
			return upsertClient({ data: {
				id: c.id,
				fullName: c.fullName,
				email: c.email ?? void 0,
				phone: c.phone,
				type: c.type,
				stage: next,
				source: c.source ?? void 0,
				assignedStaffId: c.assignedStaffId,
				notes: c.notes ?? void 0
			} });
		},
		onSuccess: () => {
			toast.success("Stage updated.");
			qc.invalidateQueries({ queryKey: ["clients"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Clients",
			title: "The book",
			description: "The pipeline from first call to a signed C of O. Open a card to amend the file.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: "Add client"
			})
		}),
		clients.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }) : (clients.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "The book is empty",
			hint: "Add a buyer, seller or investor to start a file."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:px-0",
			children: CLIENT_STAGES.map((stage) => {
				const items = (clients.data ?? []).filter((c) => c.stage === stage);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-64 shrink-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mb-2 text-xs font-medium tracking-widest text-muted-foreground uppercase",
						children: [
							CLIENT_STAGE_LABELS[stage],
							" · ",
							items.length
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: items.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							className: "cursor-pointer",
							onClick: () => {
								setEditing(c);
								setOpen(true);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
								className: "space-y-2 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: c.fullName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: c.phone
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: c.type })
									}),
									c.assignedStaffName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: c.assignedStaffName
									}) : null,
									stage !== "closed" && stage !== "lost" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										className: "h-8 px-2",
										onClick: (e) => {
											e.stopPropagation();
											advance.mutate(c);
										},
										children: "Advance"
									}) : null
								]
							})
						}, c.id))
					})]
				}, stage);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientDialog, {
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
function ClientDialog({ open, onOpenChange, editing, isAdmin, staff, busy, onSave }) {
	const [type, setType] = (0, import_react.useState)("buyer");
	const [stage, setStage] = (0, import_react.useState)("lead");
	const [assigned, setAssigned] = (0, import_react.useState)("none");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setType(editing?.type ?? "buyer");
		setStage(editing?.stage ?? "lead");
		setAssigned(editing?.assignedStaffId ? String(editing.assignedStaffId) : "none");
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
						email: String(fd.get("email") || ""),
						phone: String(fd.get("phone")),
						type,
						stage,
						source: String(fd.get("source") || ""),
						assignedStaffId: assigned === "none" ? null : Number(assigned),
						notes: String(fd.get("notes") || "")
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Client file" : "New client" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "fullName",
									children: "Full name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fullName",
									name: "fullName",
									defaultValue: editing?.fullName,
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "phone",
									children: "Phone"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "phone",
									name: "phone",
									defaultValue: editing?.phone,
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "email",
									children: "Email"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "email",
									name: "email",
									type: "email",
									defaultValue: editing?.email ?? ""
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type,
									onValueChange: setType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CLIENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Stage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: stage,
									onValueChange: setStage,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CLIENT_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: CLIENT_STAGE_LABELS[s]
									}, s)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "source",
									children: "Source"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "source",
									name: "source",
									defaultValue: editing?.source ?? ""
								})]
							}),
							isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assigned agent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: assigned,
									onValueChange: setAssigned,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "none",
										children: "Unassigned"
									}), staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: String(s.id),
										children: s.name
									}, s.id))] })]
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "notes",
									children: "Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "notes",
									name: "notes",
									defaultValue: editing?.notes ?? ""
								})]
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
//#endregion
export { ClientsPage as component };
