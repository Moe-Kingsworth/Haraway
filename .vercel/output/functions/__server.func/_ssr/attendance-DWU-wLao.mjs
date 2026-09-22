import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as todayWAT, o as formatTimeWAT, r as formatDate } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { r as cn, t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { t as PersonChip } from "./person-chip-CZM1RLbM.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { n as listAttendance, o as listStaff, r as listLeave, t as clockToday, u as reviewLeave } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-DWU-wLao.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-10 items-center gap-1 rounded-md bg-muted p-1", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-soft", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-4", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function AttendancePage() {
	const qc = useQueryClient();
	const today = todayWAT();
	const from = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date(`${today}T00:00:00Z`);
		d.setUTCDate(d.getUTCDate() - 14);
		return d.toISOString().slice(0, 10);
	}, [today]);
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const staff = useQuery({
		queryKey: ["staff"],
		queryFn: () => listStaff()
	});
	const att = useQuery({
		queryKey: [
			"attendance",
			from,
			today
		],
		queryFn: () => listAttendance({ data: {
			from,
			to: today
		} })
	});
	const leave = useQuery({
		queryKey: ["leave"],
		queryFn: () => listLeave()
	});
	const isAdmin = boot.data?.access.role === "admin";
	const clock = useMutation({
		mutationFn: (input) => clockToday({ data: input }),
		onSuccess: () => {
			toast.success("Register updated.");
			qc.invalidateQueries({ queryKey: ["attendance"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const decide = useMutation({
		mutationFn: (input) => reviewLeave({ data: input }),
		onSuccess: () => {
			toast.success("Leave updated.");
			qc.invalidateQueries({ queryKey: ["leave"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const todayRows = (att.data ?? []).filter((r) => r.workDate === today);
	const history = (att.data ?? []).filter((r) => r.workDate !== today);
	const activeStaff = (staff.data ?? []).filter((s) => s.status === "active");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Attendance",
		title: "The register",
		description: "Clock the house in. Leave requests sit on the second tab until you sign them."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "today",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "today",
					children: "Today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "log",
					children: "Last two weeks"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "leave",
					children: "Leave"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "today",
				className: "space-y-3",
				children: staff.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }) : activeStaff.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No active staff",
					hint: "Add people to the house first."
				}) : activeStaff.map((s) => {
					const row = todayRows.find((r) => r.staffId === s.id);
					const canAct = isAdmin || boot.data?.access.staffId === s.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PersonChip, {
							id: s.id,
							name: s.fullName,
							meta: s.role
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								row ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: row.status }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: "absent" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs tabular-nums text-muted-foreground",
									children: [
										formatTimeWAT(row?.clockIn),
										" – ",
										formatTimeWAT(row?.clockOut)
									]
								}),
								canAct ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: clock.isPending || Boolean(row?.clockIn),
									onClick: () => clock.mutate({
										action: "in",
										staffId: s.id
									}),
									children: "In"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "outline",
									disabled: clock.isPending || !row?.clockIn || Boolean(row?.clockOut),
									onClick: () => clock.mutate({
										action: "out",
										staffId: s.id
									}),
									children: "Out"
								})] }) : null
							]
						})]
					}) }, s.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "log",
				className: "overflow-x-auto",
				children: history.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No register yet",
					hint: "Clock-ins from the last two weeks will land here."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[40rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs tracking-wide text-muted-foreground uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Person"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "In"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 pr-3 font-medium",
									children: "Out"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2 font-medium",
									children: "Status"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: history.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/70",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-3 tabular-nums",
								children: formatDate(r.workDate)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-3",
								children: r.staffName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-3 tabular-nums",
								children: formatTimeWAT(r.clockIn)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5 pr-3 tabular-nums",
								children: formatTimeWAT(r.clockOut)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: r.status })
							})
						]
					}, r.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "leave",
				className: "space-y-3",
				children: (leave.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					title: "No leave requests",
					hint: "Ask from My desk. Approvals land here."
				}) : (leave.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: l.staffName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								l.leaveType,
								" · ",
								formatDate(l.startDate),
								" – ",
								formatDate(l.endDate)
							]
						}),
						l.reason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm",
							children: l.reason
						}) : null
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: l.status }), isAdmin && l.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => decide.mutate({
								id: l.id,
								status: "approved"
							}),
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => decide.mutate({
								id: l.id,
								status: "declined"
							}),
							children: "Decline"
						})] }) : null]
					})]
				}) }, l.id))
			})
		]
	})] });
}
//#endregion
export { AttendancePage as component };
