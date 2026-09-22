import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { t as PersonChip } from "./person-chip-CZM1RLbM.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { a as listReviews, d as upsertReview, o as listStaff } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/performance-Bb21uRHn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Score({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs tracking-wide text-muted-foreground uppercase",
			children: label
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-2xl font-medium tabular-nums",
			children: value
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 h-1.5 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-full rounded-full bg-primary",
				style: { width: `${Math.min(100, value)}%` }
			})
		})
	] });
}
function PerformancePage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const reviews = useQuery({
		queryKey: ["reviews"],
		queryFn: () => listReviews()
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const isAdmin = boot.data?.access.role === "admin";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [staffId, setStaffId] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: (data) => upsertReview({ data }),
		onSuccess: (res) => {
			toast.success(`Review filed. Overall ${res.overall}.`);
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["reviews"] });
		},
		onError: (e) => toast.error(e.message)
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setStaffId(staff.data?.[0] ? String(staff.data[0].id) : "");
	}, [open, staff.data]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Performance",
			title: "How the house is landing",
			description: "Quarterly scores — closings, listings, the register, and how clients speak of the work.",
			actions: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "File a review"
			}) : null
		}),
		reviews.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }, i))
		}) : (reviews.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No reviews on file",
			hint: "File a quarterly review when the numbers are in."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: (reviews.data ?? []).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
							id: r.staffId,
							name: r.staffName,
							meta: `${r.department} · ${r.periodLabel}`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl font-medium tabular-nums",
							children: r.overallScore
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
							label: "Attendance",
							value: r.attendanceScore
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Score, {
							label: "Client",
							value: r.clientScore
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							r.dealsClosed,
							" closings · ",
							r.listingsWon,
							" listings"
						]
					}),
					r.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: r.notes
					}) : null
				]
			}) }, r.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-h-[90svh] overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						if (!staffId) return;
						save.mutate({
							staffId: Number(staffId),
							periodLabel: String(fd.get("periodLabel")),
							dealsClosed: Number(fd.get("dealsClosed") || 0),
							listingsWon: Number(fd.get("listingsWon") || 0),
							attendanceScore: Number(fd.get("attendanceScore") || 0),
							clientScore: Number(fd.get("clientScore") || 0),
							notes: String(fd.get("notes") || "")
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "File a review" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Person" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: staffId,
								onValueChange: setStaffId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (staff.data ?? []).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: String(s.id),
									children: s.fullName
								}, s.id)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "periodLabel",
								children: "Period"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "periodLabel",
								name: "periodLabel",
								defaultValue: "Q3 2026",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "dealsClosed",
										children: "Closings"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "dealsClosed",
										name: "dealsClosed",
										type: "number",
										min: 0,
										defaultValue: 0
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "listingsWon",
										children: "Listings"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "listingsWon",
										name: "listingsWon",
										type: "number",
										min: 0,
										defaultValue: 0
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "attendanceScore",
										children: "Attendance (0–100)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "attendanceScore",
										name: "attendanceScore",
										type: "number",
										min: 0,
										max: 100,
										defaultValue: 90
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "clientScore",
										children: "Client (0–100)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "clientScore",
										name: "clientScore",
										type: "number",
										min: 0,
										max: 100,
										defaultValue: 90
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "notes",
								children: "Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "notes",
								name: "notes"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: save.isPending || !staffId,
							children: "File review"
						}) })
					]
				})
			})
		})
	] });
}
//#endregion
export { PerformancePage as component };
