import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as getBootstrap } from "./access-DIVfVghL.mjs";
import { H as ChevronRight, U as ChevronLeft, _ as RotateCcw, m as ShieldAlert } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, t as Badge } from "./badge-BJzbO8FA.mjs";
import { t as AppShell } from "./app-shell-DuzJoH7o.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { n as CardContent, t as Card } from "./card-DHh5pwIE.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { t as Label } from "./label-CPeUE8i1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { i as listAuditLogs } from "./admin-DtxWFnV4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-log-2tySUr7Y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMMON_ACTIONS = [
	"All Actions",
	"Create User",
	"Edit User",
	"Suspend User",
	"Reactivate User",
	"Reset Password",
	"Promote to Super Admin",
	"Create Job Posting",
	"Update Job Posting",
	"Delete Job Posting",
	"Submit Application",
	"Update Application Status",
	"Convert to Staff"
];
function ActionBadge({ action }) {
	if (action.includes("Suspend") || action.includes("Delete")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-rose-500/15 text-rose-700 border-rose-500/30 font-medium",
		children: action
	});
	if (action.includes("Create") || action.includes("Convert")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-medium",
		children: action
	});
	if (action.includes("Promote") || action.includes("Reset")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-primary/15 text-primary border-primary/30 font-medium",
		children: action
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "outline",
		children: action
	});
}
function AuditLogPage() {
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const isSuperAdmin = boot.data?.access.role === "super_admin";
	const [page, setPage] = (0, import_react.useState)(1);
	const [actionType, setActionType] = (0, import_react.useState)("All Actions");
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const query = useQuery({
		queryKey: [
			"audit-logs",
			page,
			actionType,
			startDate,
			endDate
		],
		queryFn: () => listAuditLogs({ data: {
			actionType: actionType === "All Actions" ? void 0 : actionType,
			startDate: startDate || void 0,
			endDate: endDate || void 0,
			page,
			limit: 20
		} }),
		enabled: isSuperAdmin
	});
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
				children: "The Audit Log is restricted to Super Admins for compliance and security auditing."
			})
		]
	}) });
	const logs = query.data?.rows ?? [];
	const totalPages = query.data?.totalPages ?? 1;
	const totalCount = query.data?.totalCount ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Security & Compliance",
		title: "System Audit Log",
		description: "Immutable record of administrative operations, account modifications, and hiring transactions."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "rounded-xl border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "p-4 sm:p-6 space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end gap-3 pb-2 border-b border-border/60",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Action Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: actionType,
								onValueChange: (v) => {
									setActionType(v);
									setPage(1);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-48 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: COMMON_ACTIONS.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: a,
									children: a
								}, a)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "From Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: startDate,
								onChange: (e) => {
									setStartDate(e.target.value);
									setPage(1);
								},
								className: "h-9 w-36 text-xs"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "To Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: endDate,
								onChange: (e) => {
									setEndDate(e.target.value);
									setPage(1);
								},
								className: "h-9 w-36 text-xs"
							})]
						}),
						(actionType !== "All Actions" || startDate || endDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => {
								setActionType("All Actions");
								setStartDate("");
								setEndDate("");
								setPage(1);
							},
							className: "text-xs h-9",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 size-3.5" }), "Reset Filters"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto text-xs text-muted-foreground self-center",
							children: ["Total entries: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: totalCount
							})]
						})
					]
				}),
				query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" }),
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
									children: "Timestamp (WAT)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Actor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Action"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Target"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Details"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 5,
								className: "py-12 text-center text-sm text-muted-foreground",
								children: "No audit records found matching the filters."
							}) }) : logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs tabular-nums text-muted-foreground whitespace-nowrap",
										children: new Date(log.timestamp).toLocaleString("en-GB", {
											dateStyle: "short",
											timeStyle: "medium",
											timeZone: "Africa/Lagos"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-foreground whitespace-nowrap",
										children: log.actorName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 whitespace-nowrap",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionBadge, { action: log.action })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-foreground",
										children: log.target
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs text-muted-foreground max-w-xs font-mono truncate",
										children: log.details ? JSON.stringify(log.details) : "—"
									})
								]
							}, log.id))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-muted-foreground",
						children: [
							"Page ",
							page,
							" of ",
							totalPages
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPage((p) => Math.max(1, p - 1)),
							disabled: page <= 1 || query.isLoading,
							className: "h-8 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "mr-1 size-3.5" }), "Previous"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setPage((p) => Math.min(totalPages, p + 1)),
							disabled: page >= totalPages || query.isLoading,
							className: "h-8 text-xs",
							children: ["Next", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-1 size-3.5" })]
						})]
					})]
				})
			]
		})
	})] });
}
//#endregion
export { AuditLogPage as component };
