import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as todayWAT, i as formatNgn, l as monthLabel } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CH-yyI5c.mjs";
import { c as processPayroll, i as listPayroll } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, t as Dialog } from "./dialog-Bvk90m3e.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payroll-ClC_xh0S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PayrollPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const pay = useQuery({
		queryKey: ["payroll"],
		queryFn: () => listPayroll()
	});
	const [slip, setSlip] = (0, import_react.useState)(null);
	const isAdmin = boot.data?.access.role === "admin";
	const company = boot.data?.access.workspace.companyName ?? "Aso Terrace";
	const [year, month] = todayWAT().split("-").map(Number);
	const already = pay.data?.runs.some((r) => r.periodYear === year && r.periodMonth === month && r.status !== "draft");
	const run = useMutation({
		mutationFn: () => processPayroll({ data: {
			year,
			month
		} }),
		onSuccess: () => {
			toast.success(`Payroll for ${monthLabel(year, month)} processed.`);
			qc.invalidateQueries({ queryKey: ["payroll"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const grouped = /* @__PURE__ */ new Map();
	for (const s of pay.data?.slips ?? []) {
		const key = `${s.periodYear}-${s.periodMonth}`;
		const list = grouped.get(key) ?? [];
		list.push(s);
		grouped.set(key, list);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Payroll",
			title: "The envelope",
			description: "Housing at 20%, pension at 8%. Process the month when the register is clean.",
			actions: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				disabled: run.isPending || already,
				onClick: () => run.mutate(),
				children: already ? "This month is paid" : `Process ${monthLabel(year, month)}`
			}) : null
		}),
		pay.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }) : grouped.size === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No payslips yet",
			hint: "Process the month from the operations desk."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: [...grouped.entries()].map(([key, slips]) => {
				const first = slips[0];
				const total = slips.reduce((a, s) => a + s.netNgn, 0);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex-row items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: monthLabel(first.periodYear, first.periodMonth) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [formatNgn(total), " net"]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: first.runStatus })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full min-w-[36rem] text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "text-xs tracking-wide text-muted-foreground uppercase",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Person"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Basic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Housing"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Pension"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2 font-medium",
										children: "Net"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: slips.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "cursor-pointer border-b border-border/70 hover:bg-muted/60",
							onClick: () => setSlip(s),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5",
									children: s.staffName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 tabular-nums",
									children: formatNgn(s.basicNgn)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 tabular-nums",
									children: formatNgn(s.allowanceNgn)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 tabular-nums",
									children: formatNgn(s.deductionNgn)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 tabular-nums font-medium",
									children: formatNgn(s.netNgn)
								})
							]
						}, s.id)) })]
					})
				})] }, key);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(slip),
			onOpenChange: () => setSlip(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: slip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Payslip · ", slip.staffName] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted-foreground",
					children: [
						company,
						" · ",
						monthLabel(slip.periodYear, slip.periodMonth)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Basic",
							v: formatNgn(slip.basicNgn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Housing allowance",
							v: formatNgn(slip.allowanceNgn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Pension (8%)",
							v: `− ${formatNgn(slip.deductionNgn)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "Net pay",
							v: formatNgn(slip.netNgn)
						})
					]
				})
			] }) : null })
		})
	] });
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between border-b border-border py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "tabular-nums font-medium",
			children: v
		})]
	});
}
//#endregion
export { PayrollPage as component };
