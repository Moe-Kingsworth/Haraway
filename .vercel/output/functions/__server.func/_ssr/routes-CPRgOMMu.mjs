import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Yj8VJyDF.mjs";
import { s as DEPARTMENTS, x as roleLabel } from "./constants-Dvnu62zU.mjs";
import { a as formatTimeWAT, c as monthLabel, i as formatNgnCompact, r as formatNgn, s as isWeekend, u as todayWAT } from "./format-DRMnNg8r.mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { a as getBootstrap } from "./access-DIVfVghL.mjs";
import { $ as Activity, A as Funnel, B as CircleCheck, L as Clock, a as UserPlus, f as Shield, i as UserX, l as TreePalm, r as Users, s as UserCheck, z as CircleX } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, t as Badge } from "./badge-BJzbO8FA.mjs";
import { t as AppShell } from "./app-shell-DuzJoH7o.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DHh5pwIE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { t as PersonChip } from "./person-chip-CngTrjLx.mjs";
import { t as StatusBadge } from "./status-badge-BRzGgqPI.mjs";
import { t as clockToday } from "./people-ai2WMjcS.mjs";
import { r as getSuperAdminDashboard } from "./admin-DtxWFnV4.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CPRgOMMu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12"));
function AttendanceBadge({ status }) {
	switch (status) {
		case "Complete": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			className: "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/20 border-emerald-500/30 gap-1 font-medium",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), "Complete"]
		});
		case "Incomplete": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			className: "bg-amber-500/15 text-amber-700 hover:bg-amber-500/20 border-amber-500/30 gap-1 font-medium",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3" }), "Incomplete"]
		});
		case "On Leave": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			className: "bg-sky-500/15 text-sky-700 hover:bg-sky-500/20 border-sky-500/30 gap-1 font-medium",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreePalm, { className: "size-3" }), "On Leave"]
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			className: "bg-rose-500/15 text-rose-700 hover:bg-rose-500/20 border-rose-500/30 gap-1 font-medium",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "size-3" }), "Absent"]
		});
	}
}
function SuperAdminDashboard() {
	const qc = useQueryClient();
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const query = useQuery({
		queryKey: ["super-admin-dashboard"],
		queryFn: () => getSuperAdminDashboard()
	});
	(0, import_react.useEffect)(() => {
		const channel = supabase.channel("super_admin_live").on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "attendance"
		}, () => {
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "audit_log"
		}, () => {
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
		}).on("postgres_changes", {
			event: "*",
			schema: "public",
			table: "staff"
		}, () => {
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [qc]);
	const data = query.data;
	const filteredAttendance = (0, import_react.useMemo)(() => {
		if (!data?.attendanceRows) return [];
		if (deptFilter === "all") return data.attendanceRows;
		return data.attendanceRows.filter((r) => r.department === deptFilter);
	}, [data?.attendanceRows, deptFilter]);
	if (query.isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Command Centre",
				title: "Super Admin Dashboard",
				description: "Live attendance surveillance, system security events, and workforce oversight."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-96 rounded-xl" })
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				kicker: "Command Centre",
				title: "Super Admin Dashboard",
				description: "Live attendance surveillance, system security audit feed, and workforce analytics in real time.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/users",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-primary text-primary-foreground hover:bg-primary/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 size-4" }), "Manage Users"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/audit-log",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "mr-2 size-4" }), "Full Audit Log"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-xl border border-border/80 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-widest text-muted-foreground uppercase",
									children: "Active Staff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-3xl font-semibold tabular-nums text-foreground",
									children: data.staffSummary.totalActive
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Accounts currently in service"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-emerald-500/10 p-3 text-emerald-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "size-6" })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-xl border border-border/80 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-widest text-muted-foreground uppercase",
									children: "Suspended Accounts"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-3xl font-semibold tabular-nums text-foreground",
									children: data.staffSummary.suspended
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "Restricted from portal login"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-rose-500/10 p-3 text-rose-600",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "size-6" })
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-xl border border-border/80 shadow-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium tracking-widest text-muted-foreground uppercase",
									children: "Created This Month"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 font-display text-3xl font-semibold tabular-nums text-foreground",
									children: data.staffSummary.createdThisMonth
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: "New onboarded staff profiles"
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-primary/10 p-3 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-6" })
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2 rounded-xl border border-border/80 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-lg",
								children: "Live Attendance Panel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[11px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Live (Today)"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Real-time clock-in monitoring across all departments. View only."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: deptFilter,
								onValueChange: setDeptFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 w-36 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Department" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Departments"
								}), DEPARTMENTS.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: dept,
									children: dept
								}, dept))] })]
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-4 gap-2 rounded-lg bg-muted/50 p-2.5 text-center border border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-r border-border/50 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
										children: "Total Present"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 font-display text-xl font-bold text-emerald-600 tabular-nums",
										children: data.summary.totalPresent
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-r border-border/50 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
										children: "Total Absent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 font-display text-xl font-bold text-rose-600 tabular-nums",
										children: data.summary.totalAbsent
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-r border-border/50 pr-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
										children: "Incomplete"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 font-display text-xl font-bold text-amber-600 tabular-nums",
										children: data.summary.incomplete
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
									children: "On Leave"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-0.5 font-display text-xl font-bold text-sky-600 tabular-nums",
									children: data.summary.onLeave
								})] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-x-auto rounded-lg border border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-left text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-muted/60 text-[11px] font-medium uppercase tracking-wider text-muted-foreground border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Department"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Clock In"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Clock Out"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 text-right",
											children: "Status Badge"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border/60",
									children: filteredAttendance.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										colSpan: 5,
										className: "py-8 text-center text-sm text-muted-foreground",
										children: "No staff members found for the selected department."
									}) }) : filteredAttendance.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/40 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 font-medium",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
													id: row.staffId,
													name: row.name,
													size: "sm"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-xs text-muted-foreground",
												children: row.department
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-xs tabular-nums text-foreground",
												children: row.clockIn ? formatTimeWAT(row.clockIn) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-xs tabular-nums text-foreground",
												children: row.clockOut ? formatTimeWAT(row.clockOut) : "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceBadge, { status: row.status })
											})
										]
									}, row.staffId))
								})]
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border/80 shadow-sm flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "pb-3 flex flex-row items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-lg flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-4 text-primary" }), "System Activity Feed"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: "Latest 10 security & management events."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/audit-log",
							className: "text-xs text-primary hover:underline font-medium",
							children: "View all"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "flex-1 overflow-hidden p-0",
						children: data.auditLogs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 text-center text-xs text-muted-foreground",
							children: "No audit events recorded yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-[460px] overflow-y-auto divide-y divide-border/50 px-5",
							children: data.auditLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "py-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground truncate max-w-[140px]",
										children: log.actorName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground tabular-nums",
										children: new Date(log.timestamp).toLocaleTimeString("en-GB", {
											hour: "2-digit",
											minute: "2-digit",
											second: "2-digit",
											timeZone: "Africa/Lagos"
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground/90",
										children: [log.action, ":"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: log.target
									})]
								})]
							}, log.id))
						})
					})]
				})]
			})
		]
	});
}
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
	const role = boot.data?.access.role;
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
	if (role === "super_admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuperAdminDashboard, {}) });
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
						meta: roleLabel(p.role),
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
