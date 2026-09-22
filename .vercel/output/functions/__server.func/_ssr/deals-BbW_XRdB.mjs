import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as todayWAT, i as formatNgn, r as formatDate } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { a as DEAL_KINDS, d as PAYMENT_PLANS, o as DEAL_STATUSES } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { o as listStaff } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
import { a as listDeals, i as listClients, l as upsertDeal, s as listProperties } from "./crm-Dhws9iQH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deals-BbW_XRdB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DealsPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const deals = useQuery({
		queryKey: ["deals"],
		queryFn: () => listDeals()
	});
	const clients = useQuery({
		queryKey: ["clients"],
		queryFn: () => listClients()
	});
	const properties = useQuery({
		queryKey: ["properties"],
		queryFn: () => listProperties()
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const isAdmin = boot.data?.access.role === "admin";
	const save = useMutation({
		mutationFn: (data) => upsertDeal({ data }),
		onSuccess: (res) => {
			toast.success("Purchase form saved.");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["deals"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
			if (res.id) navigate({
				to: "/deals/$id",
				params: { id: String(res.id) }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Purchase forms",
			title: "Offers and leases",
			description: "From draft to completed. Open a form to print the paper the client signs.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "New form"
			})
		}),
		deals.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
		}) : (deals.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No purchase forms yet",
			hint: "Raise an offer or lease against a listing."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: (deals.data ?? []).map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium",
							children: [
								d.reference,
								" · ",
								d.kind
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted-foreground",
							children: [
								d.clientName,
								" — ",
								d.propertyTitle
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								d.issuedAt ? formatDate(d.issuedAt) : "Not issued",
								" · Paid ",
								formatNgn(d.paidNgn),
								" of",
								" ",
								formatNgn(d.offerNgn)
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: d.status }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/deals/$id",
							params: { id: String(d.id) },
							children: "Open form"
						})
					})]
				})]
			}) }, d.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DealDialog, {
			open,
			onOpenChange: setOpen,
			isAdmin: Boolean(isAdmin),
			clients: (clients.data ?? []).map((c) => ({
				id: c.id,
				name: c.fullName
			})),
			properties: (properties.data ?? []).map((p) => ({
				id: p.id,
				name: `${p.title} · ${formatNgn(p.priceNgn)}`,
				price: p.priceNgn
			})),
			staff: (staff.data ?? []).map((s) => ({
				id: s.id,
				name: s.fullName
			})),
			defaultStaffId: boot.data?.access.staffId ?? null,
			busy: save.isPending,
			onSave: (data) => save.mutate(data)
		})
	] });
}
function DealDialog({ open, onOpenChange, isAdmin, clients, properties, staff, defaultStaffId, busy, onSave }) {
	const [clientId, setClientId] = (0, import_react.useState)("");
	const [propertyId, setPropertyId] = (0, import_react.useState)("");
	const [staffId, setStaffId] = (0, import_react.useState)("none");
	const [kind, setKind] = (0, import_react.useState)("sale");
	const [status, setStatus] = (0, import_react.useState)("draft");
	const [plan, setPlan] = (0, import_react.useState)("outright");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setClientId(clients[0] ? String(clients[0].id) : "");
		setPropertyId(properties[0] ? String(properties[0].id) : "");
		setStaffId(defaultStaffId ? String(defaultStaffId) : "none");
		setKind("sale");
		setStatus("draft");
		setPlan("outright");
	}, [open]);
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
					const prop = properties.find((p) => String(p.id) === propertyId);
					onSave({
						clientId: Number(clientId),
						propertyId: Number(propertyId),
						staffId: staffId === "none" ? null : Number(staffId),
						kind,
						offerNgn: Number(fd.get("offerNgn") || prop?.price || 0),
						status,
						paymentPlan: plan,
						issuedAt: status === "draft" ? null : todayWAT(),
						notes: String(fd.get("notes") || "")
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New purchase form" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: clientId,
							onValueChange: setClientId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select client" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: String(c.id),
								children: c.name
							}, c.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Listing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: propertyId,
							onValueChange: setPropertyId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select listing" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: properties.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: String(p.id),
								children: p.name
							}, p.id)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kind" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: kind,
									onValueChange: setKind,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEAL_KINDS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: k,
										children: k
									}, k)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: status,
									onValueChange: setStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEAL_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: plan,
									onValueChange: setPlan,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: p,
										children: p
									}, p)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "offerNgn",
									children: "Offer (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "offerNgn",
									name: "offerNgn",
									type: "number",
									defaultValue: properties.find((p) => String(p.id) === propertyId)?.price ?? 0
								})]
							})
						]
					}),
					isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Agent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
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
					}) : null,
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
						disabled: busy || !clientId || !propertyId,
						children: "Create form"
					}) })
				]
			})
		})
	});
}
//#endregion
export { DealsPage as component };
