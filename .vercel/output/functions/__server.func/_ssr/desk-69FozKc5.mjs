import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { d as todayWAT, i as formatNgn, l as monthLabel, o as formatTimeWAT, r as formatDate } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { l as LEAVE_TYPES } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-CH-yyI5c.mjs";
import { a as listReviews, i as listPayroll, l as requestLeave, n as listAttendance, r as listLeave, s as listTasks, t as clockToday } from "./people-DIiQmf3t.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-69FozKc5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DeskPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const today = todayWAT();
	const from = `${today.slice(0, 8)}01`;
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
	const tasks = useQuery({
		queryKey: ["tasks"],
		queryFn: () => listTasks()
	});
	const pay = useQuery({
		queryKey: ["payroll"],
		queryFn: () => listPayroll()
	});
	const reviews = useQuery({
		queryKey: ["reviews"],
		queryFn: () => listReviews()
	});
	const leave = useQuery({
		queryKey: ["leave"],
		queryFn: () => listLeave()
	});
	const [leaveOpen, setLeaveOpen] = (0, import_react.useState)(false);
	const [leaveType, setLeaveType] = (0, import_react.useState)("annual");
	const me = boot.data?.me;
	const staffId = me?.id;
	const myToday = att.data?.find((r) => r.staffId === staffId && r.workDate === today);
	const myTasks = (tasks.data ?? []).filter((t) => t.status !== "done" && t.staffId === staffId).slice(0, 6);
	const latestSlip = (pay.data?.slips ?? []).find((s) => s.staffId === staffId);
	const review = (reviews.data ?? []).find((r) => r.staffId === staffId);
	const myLeave = (leave.data ?? []).filter((l) => l.staffId === staffId);
	const clock = useMutation({
		mutationFn: (action) => clockToday({ data: { action } }),
		onSuccess: (_, action) => {
			toast.success(action === "in" ? "Clocked in." : "Clocked out.");
			qc.invalidateQueries({ queryKey: ["attendance"] });
			qc.invalidateQueries({ queryKey: ["dashboard"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const askLeave = useMutation({
		mutationFn: (data) => requestLeave({ data }),
		onSuccess: () => {
			toast.success("Leave request sent.");
			setLeaveOpen(false);
			qc.invalidateQueries({ queryKey: ["leave"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "My desk",
			title: me ? me.fullName : "Your desk",
			description: me ? `${me.role} · ${me.department}` : "Clock in, see your work, and read your last payslip.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => clock.mutate("in"),
					disabled: clock.isPending || Boolean(myToday?.clockIn),
					children: "Clock in"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => clock.mutate("out"),
					disabled: clock.isPending || !myToday?.clockIn || Boolean(myToday?.clockOut),
					children: "Clock out"
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Today" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [myToday ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: myToday.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "In"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatTimeWAT(myToday.clockIn)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Out"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: formatTimeWAT(myToday.clockOut)
							})]
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "You have not clocked in today."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "secondary",
						className: "w-full",
						onClick: () => setLeaveOpen(true),
						children: "Request leave"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Last payslip" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: latestSlip ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground",
							children: monthLabel(latestSlip.periodYear, latestSlip.periodMonth)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-medium tabular-nums",
							children: formatNgn(latestSlip.netNgn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Basic ",
								formatNgn(latestSlip.basicNgn),
								" · Housing ",
								formatNgn(latestSlip.allowanceNgn),
								" · Pension",
								" ",
								formatNgn(latestSlip.deductionNgn)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/payroll",
							className: "text-sm text-accent hover:underline",
							children: "All payslips"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No payslip yet."
				}) })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Performance" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: review ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: review.periodLabel
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-medium tabular-nums",
						children: review.overallScore
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: review.notes
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No review on file."
				}) })] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your tasks" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2",
				children: [myTasks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Nothing assigned."
				}) : myTasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-medium",
							children: t.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: t.dueDate ? formatDate(t.dueDate) : "No due date"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: t.status })]
				}, t.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/tasks",
					className: "inline-block text-sm text-accent hover:underline",
					children: "Open the board"
				})]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Leave" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2",
				children: [(myLeave ?? []).slice(0, 5).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						l.leaveType,
						" · ",
						formatDate(l.startDate),
						" – ",
						formatDate(l.endDate)
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: l.status })]
				}, l.id)), myLeave.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No leave on file."
				}) : null]
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: leaveOpen,
			onOpenChange: setLeaveOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					askLeave.mutate({
						leaveType,
						startDate: String(fd.get("startDate")),
						endDate: String(fd.get("endDate")),
						reason: String(fd.get("reason") || "")
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Request leave" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: leaveType,
							onValueChange: setLeaveType,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAVE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "startDate",
								children: "From"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "startDate",
								name: "startDate",
								type: "date",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "endDate",
								children: "To"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "endDate",
								name: "endDate",
								type: "date",
								required: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "reason",
							children: "Reason"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "reason",
							name: "reason",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: askLeave.isPending,
						children: "Send request"
					}) })
				]
			}) })
		})
	] });
}
//#endregion
export { DeskPage as component };
