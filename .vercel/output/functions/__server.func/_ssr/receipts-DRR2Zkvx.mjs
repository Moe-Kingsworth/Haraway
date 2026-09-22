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
import { u as PAYMENT_METHODS } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
import { a as listDeals, i as listClients, o as listPayments, t as createPayment } from "./crm-Dhws9iQH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/receipts-DRR2Zkvx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReceiptsPage() {
	const qc = useQueryClient();
	const navigate = useNavigate();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const payments = useQuery({
		queryKey: ["payments"],
		queryFn: () => listPayments()
	});
	const clients = useQuery({
		queryKey: ["clients"],
		queryFn: () => listClients()
	});
	const deals = useQuery({
		queryKey: ["deals"],
		queryFn: () => listDeals()
	});
	const isAdmin = boot.data?.access.role === "admin";
	const [open, setOpen] = (0, import_react.useState)(false);
	const save = useMutation({
		mutationFn: (data) => createPayment({ data }),
		onSuccess: (res) => {
			toast.success(`Receipt ${res.receiptNo} issued.`);
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			if (res.id) navigate({
				to: "/receipts/$id",
				params: { id: String(res.id) }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Receipts",
			title: "Money in",
			description: "Every naira that crossed the desk. Issue a receipt, then print it for the file.",
			actions: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Issue receipt"
			}) : null
		}),
		payments.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }) : (payments.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No receipts yet",
			hint: "Issue a receipt when money lands."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[44rem] text-left text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-xs tracking-wide text-muted-foreground uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Receipt"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Client"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 font-medium" })
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (payments.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/70",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "py-3 pr-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: p.receiptNo
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: p.dealReference ?? p.narration
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3",
							children: p.clientName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3 tabular-nums",
							children: formatDate(p.paidAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.method })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3 pr-3 tabular-nums font-medium",
							children: formatNgn(p.amountNgn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/receipts/$id",
									params: { id: String(p.id) },
									children: "Open"
								})
							})
						})
					]
				}, p.id)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentDialog, {
			open,
			onOpenChange: setOpen,
			clients: (clients.data ?? []).map((c) => ({
				id: c.id,
				name: c.fullName
			})),
			deals: (deals.data ?? []).map((d) => ({
				id: d.id,
				label: `${d.reference} · ${d.clientName}`,
				clientId: d.clientId
			})),
			busy: save.isPending,
			onSave: (data) => save.mutate(data)
		})
	] });
}
function PaymentDialog({ open, onOpenChange, clients, deals, busy, onSave }) {
	const [clientId, setClientId] = (0, import_react.useState)("");
	const [dealId, setDealId] = (0, import_react.useState)("none");
	const [method, setMethod] = (0, import_react.useState)("transfer");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setClientId(clients[0] ? String(clients[0].id) : "");
		setDealId("none");
		setMethod("transfer");
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				const fd = new FormData(e.currentTarget);
				onSave({
					clientId: Number(clientId),
					dealId: dealId === "none" ? null : Number(dealId),
					amountNgn: Number(fd.get("amountNgn")),
					method,
					paidAt: String(fd.get("paidAt") || todayWAT()),
					narration: String(fd.get("narration") || "")
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Issue receipt" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Client" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: clientId,
						onValueChange: setClientId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: clients.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(c.id),
							children: c.name
						}, c.id)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Linked form" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: dealId,
						onValueChange: (v) => {
							setDealId(v);
							if (v !== "none") {
								const d = deals.find((x) => String(x.id) === v);
								if (d) setClientId(String(d.clientId));
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "none",
							children: "None"
						}), deals.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: String(d.id),
							children: d.label
						}, d.id))] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "amountNgn",
							children: "Amount (₦)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "amountNgn",
							name: "amountNgn",
							type: "number",
							required: true,
							min: 1
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "paidAt",
							children: "Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "paidAt",
							name: "paidAt",
							type: "date",
							defaultValue: todayWAT(),
							required: true
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Method" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: method,
						onValueChange: setMethod,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PAYMENT_METHODS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m,
							children: m
						}, m)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "narration",
						children: "Narration"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "narration",
						name: "narration"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy || !clientId,
					children: "Issue"
				}) })
			]
		}) })
	});
}
//#endregion
export { ReceiptsPage as component };
