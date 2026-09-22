import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as todayWAT, i as formatNgn, r as formatDate, u as nairaToWords } from "./format-Tz25-cit.mjs";
import { n as Wordmark, t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { o as DEAL_STATUSES, u as PAYMENT_METHODS } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
import { l as upsertDeal, n as getDeal, t as createPayment } from "./crm-Dhws9iQH.mjs";
import { r as Route$2 } from "./router--Tq7Vjsr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deals_._id-XquRclR5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DealPrint() {
	const { id } = Route$2.useParams();
	const qc = useQueryClient();
	const navigate = useNavigate();
	const d = useQuery({
		queryKey: ["deal", id],
		queryFn: () => getDeal({ data: { id: Number(id) } })
	}).data;
	const [status, setStatus] = (0, import_react.useState)(null);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [method, setMethod] = (0, import_react.useState)("transfer");
	const current = status ?? d?.status ?? "draft";
	const balance = d ? Math.max(0, d.offerNgn - d.paidNgn) : 0;
	const save = useMutation({
		mutationFn: (next) => {
			if (!d) throw new Error("Form not loaded.");
			return upsertDeal({ data: {
				id: d.id,
				clientId: d.clientId,
				propertyId: d.propertyId,
				staffId: d.staffId,
				kind: d.kind,
				offerNgn: d.offerNgn,
				status: next,
				paymentPlan: d.paymentPlan ?? void 0,
				issuedAt: next === "draft" ? d.issuedAt : d.issuedAt ?? todayWAT(),
				notes: d.notes ?? void 0
			} });
		},
		onSuccess: () => {
			toast.success("Form updated.");
			qc.invalidateQueries({ queryKey: ["deal", id] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const pay = useMutation({
		mutationFn: (data) => {
			if (!d) throw new Error("Form not loaded.");
			return createPayment({ data: {
				clientId: d.clientId,
				dealId: d.id,
				amountNgn: data.amountNgn,
				method: data.method,
				paidAt: data.paidAt,
				narration: data.narration
			} });
		},
		onSuccess: (res) => {
			toast.success(`Receipt ${res.receiptNo} issued.`);
			setPayOpen(false);
			qc.invalidateQueries({ queryKey: ["deal", id] });
			qc.invalidateQueries({ queryKey: ["deals"] });
			qc.invalidateQueries({ queryKey: ["payments"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
			if (res.id) navigate({
				to: "/receipts/$id",
				params: { id: String(res.id) }
			});
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "print-hidden mb-4 flex flex-wrap items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/deals",
					children: "Back to forms"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: current,
						onValueChange: (v) => {
							setStatus(v);
							save.mutate(v);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEAL_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: s,
							children: s
						}, s)) })]
					}) : null,
					d && balance > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						onClick: () => setPayOpen(true),
						children: "Issue receipt"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => window.print(),
						children: "Print form"
					})
				]
			})]
		}),
		d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-3xl rounded-xl border border-border bg-card p-8 shadow-soft md:p-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 border-b border-border pb-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: d.reference
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: d.status })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted-foreground",
					children: [
						d.workspace.address,
						" · ",
						d.workspace.phone,
						" · ",
						d.workspace.rcNumber
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-8 font-display text-3xl font-medium tracking-tight",
					children: d.kind === "lease" ? "Offer to Lease" : "Offer to Purchase"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: [
						"Issued ",
						d.issuedAt ? formatDate(d.issuedAt) : "as a draft",
						" · ",
						d.paymentPlan ?? "outright"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 grid gap-6 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Purchaser / Lessee"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: d.clientName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: d.clientPhone
						}),
						d.clientEmail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: d.clientEmail
						}) : null
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Vendor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: d.workspace.companyName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "for the beneficial owner, as disclosed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: ["Agent: ", d.staffName ?? "the desk"]
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "The property"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-medium",
							children: d.propertyTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								d.propertyAddress,
								", ",
								d.propertyDistrict,
								", Abuja, FCT"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 rounded-lg bg-background p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: "Consideration"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-3xl font-medium tabular-nums",
							children: formatNgn(d.offerNgn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: nairaToWords(d.offerNgn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: [
								"Received to date ",
								formatNgn(d.paidNgn),
								" · Balance ",
								formatNgn(balance)
							]
						})
					]
				}),
				d.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: "Special conditions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm",
						children: d.notes
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-12 grid gap-10 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignLine, { label: "Purchaser / Lessee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignLine, { label: `For ${d.workspace.companyName}` })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-xs text-muted-foreground",
					children: "Subject to contract, good title, and the Land Use Act. This form is not a conveyance."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading form…"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: payOpen,
			onOpenChange: setPayOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "print-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						const fd = new FormData(e.currentTarget);
						pay.mutate({
							amountNgn: Number(fd.get("amountNgn")),
							method,
							paidAt: String(fd.get("paidAt") || todayWAT()),
							narration: String(fd.get("narration") || "")
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Issue receipt" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								d?.clientName,
								" · balance ",
								formatNgn(balance)
							]
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
									min: 1,
									defaultValue: balance || void 0
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
								name: "narration",
								defaultValue: d ? `${d.reference} — ${d.propertyTitle}` : ""
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: pay.isPending,
							children: "Issue"
						}) })
					]
				})
			})
		})
	] });
}
function SignLine({ label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-16 border-b border-foreground/30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted-foreground",
		children: label
	})] });
}
//#endregion
export { DealPrint as component };
