import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { a as formatNgnCompact, c as isWeekend, d as todayWAT, i as formatNgn, l as monthLabel, n as authMiddleware, o as formatTimeWAT } from "./format-Tz25-cit.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { t as PersonChip } from "./person-chip-CZM1RLbM.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CH-yyI5c.mjs";
import { t as clockToday } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-C4gJRlxm.js
var import_jsx_runtime = require_jsx_runtime();
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12"));
function Stat({ label, value, hint }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "rounded-xl",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted-foreground uppercase",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl font-medium tracking-tight tabular-nums",
					children: value
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			]
		})
	});
}
function Home() {
	const qc = useQueryClient();
	const dash = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => getDashboard()
	});
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const d = dash.data;
	const firstName = boot.data?.access.displayName?.trim().split(/\s+/)[0];
	const today = todayWAT();
	const [year, month] = today.split("-").map(Number);
	const meId = boot.data?.access.staffId;
	const alreadyIn = Boolean(meId && d?.inOffice.some((p) => p.id === meId));
	const clock = useMutation({
		mutationFn: () => clockToday({ data: { action: "in" } }),
		onSuccess: () => {
			toast.success("Clocked in.");
			qc.invalidateQueries({ queryKey: ["dashboard"] });
			qc.invalidateQueries({ queryKey: ["attendance"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Overview",
		title: firstName ? `Good day, ${firstName}.` : "The operations desk",
		description: "The house at a glance — who is in, what is moving, and what still needs a signature.",
		actions: boot.data?.me && !alreadyIn && !dash.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => clock.mutate(),
			disabled: clock.isPending,
			children: "Clock in"
		}) : null
	}), dash.isLoading || !d ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
		children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }, i))
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "In today",
					value: `${d.presentToday}/${d.staffCount}`,
					hint: "Clocked present, late or remote"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Open tasks",
					value: String(d.openTasks),
					hint: d.overdueTasks ? `${d.overdueTasks} overdue` : "Nothing overdue"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Live pipeline",
					value: formatNgnCompact(d.pipelineNgn),
					hint: "Draft, issued and accepted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Receipts this month",
					value: formatNgnCompact(d.monthReceiptsNgn),
					hint: `${monthLabel(year ?? 2026, month ?? 9)} collections`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Collections" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Money in, by month."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-56",
					children: d.collections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No receipts yet."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: d.collections,
							barSize: 28,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									tick: {
										fontSize: 12,
										fill: "var(--color-muted-foreground)"
									},
									axisLine: false,
									tickLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fontSize: 11,
										fill: "var(--color-muted-foreground)"
									},
									axisLine: false,
									tickLine: false,
									tickFormatter: (v) => formatNgnCompact(v),
									width: 56
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: "color-mix(in oklab, var(--color-primary) 8%, transparent)" },
									formatter: (v) => [formatNgn(Number(v)), "Collected"],
									contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 8,
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "amount",
									fill: "var(--color-primary)",
									radius: [
										4,
										4,
										0,
										0
									]
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Who is in" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Today, West Africa Time."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: d.inOffice.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: isWeekend(today) ? "The house is quiet this weekend. Clock in if you are on a viewing." : "Nobody has clocked in yet."
				}) : d.inOffice.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
						id: p.id,
						name: p.name,
						meta: p.role,
						size: "sm"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs tabular-nums text-muted-foreground",
							children: formatTimeWAT(p.clockIn)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status })]
					})]
				}, p.id))
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Needs a look" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2",
				children: d.attention.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "The desk is clear."
				}) : d.attention.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: a.href,
					className: "flex items-center justify-between rounded-md border border-border bg-background px-3 py-2.5 text-sm hover:bg-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: a.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Open"
					})]
				}, a.title))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Latest receipts" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: d.recentPayments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No receipts yet."
				}) : d.recentPayments.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/receipts/$id",
					params: { id: String(p.id) },
					className: "flex items-center justify-between gap-3 text-sm hover:text-accent",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block truncate font-medium",
							children: p.clientName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: p.receiptNo
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 tabular-nums",
						children: formatNgn(p.amountNgn)
					})]
				}, p.id))
			})] })]
		})
	] })] });
}
//#endregion
export { Home as component };
