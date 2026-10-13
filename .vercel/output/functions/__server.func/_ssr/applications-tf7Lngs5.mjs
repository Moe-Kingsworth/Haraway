import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { m as ROLES, s as DEPARTMENTS, x as roleLabel } from "./constants-Dvnu62zU.mjs";
import { a as getBootstrap } from "./access-DIVfVghL.mjs";
import { B as CircleCheck, F as ExternalLink, M as FileCheck, _ as RotateCcw, a as UserPlus, h as Search, m as ShieldAlert, q as Calendar, z as CircleX } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, t as Badge } from "./badge-BJzbO8FA.mjs";
import { t as AppShell } from "./app-shell-DuzJoH7o.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { n as CardContent, t as Card } from "./card-DHh5pwIE.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Bq583Q1q.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { t as Label } from "./label-CPeUE8i1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { t as Textarea } from "./textarea-Dy6h8d4C.mjs";
import { a as listJobApplications, c as updateApplicationStatus, t as convertApplicationToStaff } from "./jobs-Bpxr4sVI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/applications-tf7Lngs5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_STAGES = [
	{
		status: "applied",
		label: "Applied"
	},
	{
		status: "under_review",
		label: "Under Review"
	},
	{
		status: "shortlisted",
		label: "Shortlisted"
	},
	{
		status: "interview_scheduled",
		label: "Interview Scheduled"
	},
	{
		status: "interview_done",
		label: "Interview Done"
	},
	{
		status: "selected",
		label: "Selected"
	},
	{
		status: "rejected",
		label: "Rejected"
	},
	{
		status: "onboarded",
		label: "Onboarded"
	}
];
function StatusBadge({ status }) {
	switch (status) {
		case "applied": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "border-border",
			children: "Applied"
		});
		case "under_review": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-sky-500/15 text-sky-700 border-sky-500/30",
			children: "Under Review"
		});
		case "shortlisted": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-indigo-500/15 text-indigo-700 border-indigo-500/30",
			children: "Shortlisted"
		});
		case "interview_scheduled": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-amber-500/15 text-amber-700 border-amber-500/30",
			children: "Interview Scheduled"
		});
		case "interview_done": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-purple-500/15 text-purple-700 border-purple-500/30",
			children: "Interview Done"
		});
		case "selected": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-semibold",
			children: "Selected"
		});
		case "onboarded": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-primary/20 text-primary border-primary/40 font-semibold",
			children: "Onboarded"
		});
		default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "bg-rose-500/15 text-rose-700 border-rose-500/30",
			children: "Rejected"
		});
	}
}
function ApplicationsPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const isAllowed = [
		"super_admin",
		"hr_admin",
		"executive"
	].includes(boot.data?.access.role ?? "");
	const [search, setSearch] = (0, import_react.useState)("");
	const [posFilter, setPosFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const [detailOpen, setDetailOpen] = (0, import_react.useState)(false);
	const [selectedApp, setSelectedApp] = (0, import_react.useState)(null);
	const [internalNotes, setInternalNotes] = (0, import_react.useState)("");
	const [interviewDate, setInterviewDate] = (0, import_react.useState)("");
	const [interviewFormat, setInterviewFormat] = (0, import_react.useState)("In-person");
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	const [showSchedule, setShowSchedule] = (0, import_react.useState)(false);
	const [showRejectDialog, setShowRejectDialog] = (0, import_react.useState)(false);
	const [convertOpen, setConvertOpen] = (0, import_react.useState)(false);
	const [convertName, setConvertName] = (0, import_react.useState)("");
	const [convertEmail, setConvertEmail] = (0, import_react.useState)("");
	const [convertPhone, setConvertPhone] = (0, import_react.useState)("");
	const [convertDept, setConvertDept] = (0, import_react.useState)("Sales");
	const [convertPosition, setConvertPosition] = (0, import_react.useState)("");
	const [convertRole, setConvertRole] = (0, import_react.useState)("staff");
	const [convertPassword, setConvertPassword] = (0, import_react.useState)("");
	const [convertEmpId, setConvertEmpId] = (0, import_react.useState)("");
	const appsQuery = useQuery({
		queryKey: [
			"admin-applications",
			posFilter,
			statusFilter,
			startDate,
			endDate,
			search
		],
		queryFn: () => listJobApplications({ data: {
			position: posFilter === "all" ? void 0 : posFilter,
			status: statusFilter === "all" ? void 0 : statusFilter,
			startDate: startDate || void 0,
			endDate: endDate || void 0,
			search: search || void 0
		} }),
		enabled: isAllowed
	});
	const updateStatusMutation = useMutation({
		mutationFn: (args) => updateApplicationStatus({ data: args }),
		onSuccess: () => {
			toast.success("Application status updated");
			qc.invalidateQueries({ queryKey: ["admin-applications"] });
			setDetailOpen(false);
			setShowRejectDialog(false);
			setShowSchedule(false);
		},
		onError: (e) => toast.error(e.message)
	});
	const convertMutation = useMutation({
		mutationFn: () => {
			if (!selectedApp) throw new Error("No application selected.");
			return convertApplicationToStaff({ data: {
				applicationId: selectedApp.id,
				fullName: convertName,
				email: convertEmail,
				phone: convertPhone,
				department: convertDept,
				position: convertPosition,
				role: convertRole,
				temporaryPassword: convertPassword,
				employeeId: convertEmpId
			} });
		},
		onSuccess: (res) => {
			toast.success(`${res.fullName} has been added as a staff member.`);
			qc.invalidateQueries({ queryKey: ["admin-applications"] });
			qc.invalidateQueries({ queryKey: ["admin-users"] });
			qc.invalidateQueries({ queryKey: ["super-admin-dashboard"] });
			setConvertOpen(false);
			setDetailOpen(false);
		},
		onError: (e) => toast.error(e.message)
	});
	function openDetail(app) {
		setSelectedApp(app);
		setInternalNotes(app.internalNotes ?? "");
		setInterviewDate(app.interviewDate ? app.interviewDate.slice(0, 16) : "");
		setInterviewFormat(app.interviewFormat ?? "In-person");
		setRejectionReason(app.rejectionReason ?? "");
		setShowSchedule(false);
		setShowRejectDialog(false);
		setDetailOpen(true);
	}
	function openConvert(app) {
		setSelectedApp(app);
		setConvertName(app.fullName);
		setConvertEmail(app.email);
		setConvertPhone(app.phone);
		setConvertDept(DEPARTMENTS.find((d) => d === app.jobDepartment) ?? "Sales");
		setConvertPosition(app.jobTitle ?? "Associate");
		setConvertRole("staff");
		setConvertEmpId(`ES-${Math.floor(1e3 + Math.random() * 9e3)}`);
		setConvertPassword(`EdenStaff#${Math.floor(1e3 + Math.random() * 9e3)}`);
		setConvertOpen(true);
	}
	const applications = appsQuery.data ?? [];
	const uniquePositions = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		for (const a of applications) if (a.jobTitle) set.add(a.jobTitle);
		return Array.from(set);
	}, [applications]);
	if (!isAllowed && !boot.isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-8 text-center space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "mx-auto size-12 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-semibold",
				children: "Access Restricted"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground max-w-md mx-auto",
				children: "The candidate applications system is accessible to HR/Admin, Executive, and Super Admin roles."
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Talent & Recruitment",
			title: "Candidate Applications",
			description: "Review candidate credentials, progress stages through interviewing, and directly onboard hires into staff accounts."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "rounded-xl border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4 sm:p-6 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1 max-w-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search applicant name or email...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-9 h-9 text-xs"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: posFilter,
								onValueChange: setPosFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-40 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Position" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Positions"
								}), uniquePositions.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p,
									children: p
								}, p))] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: statusFilter,
								onValueChange: setStatusFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-9 w-40 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status Stage" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Statuses"
								}), STATUS_STAGES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s.status,
									children: s.label
								}, s.status))] })]
							}),
							(posFilter !== "all" || statusFilter !== "all" || search) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setPosFilter("all");
									setStatusFilter("all");
									setSearch("");
								},
								className: "text-xs h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "mr-1 size-3.5" }), "Reset"]
							})
						]
					})]
				}), appsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-4",
					children: [
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
									children: "Applicant Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Position"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Date Applied"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Experience"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: applications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "py-12 text-center text-sm text-muted-foreground",
								children: "No applications match your filter settings."
							}) }) : applications.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								onClick: () => openDetail(app),
								className: "hover:bg-muted/30 transition-colors cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-foreground",
											children: app.fullName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: app.email
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-xs text-foreground font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: app.jobTitle }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground",
											children: app.jobDepartment
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-xs tabular-nums text-muted-foreground",
										children: new Date(app.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-xs tabular-nums text-foreground",
										children: [
											app.yearsExperience,
											" ",
											app.yearsExperience === 1 ? "year" : "years"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: app.status })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: (e) => {
												e.stopPropagation();
												openDetail(app);
											},
											className: "text-xs h-8",
											children: "Review"
										})
									})
								]
							}, app.id))
						})]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: detailOpen,
			onOpenChange: setDetailOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-2xl max-h-[90vh] overflow-y-auto",
				children: selectedApp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-lg",
							children: selectedApp.fullName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs mt-0.5",
							children: [
								"Applied for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: selectedApp.jobTitle
								}),
								" (",
								selectedApp.jobDepartment,
								")"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: selectedApp.status })]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg bg-muted/50 p-3 border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground block",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${selectedApp.email}`,
										className: "text-primary hover:underline break-all",
										children: selectedApp.email
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground block",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${selectedApp.phone}`,
										className: "text-foreground",
										children: selectedApp.phone
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground block",
										children: "Experience"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-foreground",
										children: [
											selectedApp.yearsExperience,
											" yrs (",
											selectedApp.currentJobTitle || "N/A",
											")"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground block",
										children: "Source"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: selectedApp.referralSource
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									selectedApp.cvUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: selectedApp.cvUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary/10 text-primary hover:bg-primary/20 font-medium text-xs border border-primary/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-3.5" }),
											"View / Download CV (PDF)",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3 ml-0.5" })
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "No CV uploaded."
									}),
									selectedApp.linkedinUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: selectedApp.linkedinUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border text-foreground hover:bg-muted",
										children: ["LinkedIn", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
									}) : null,
									selectedApp.portfolioUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: selectedApp.portfolioUrl,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border text-foreground hover:bg-muted",
										children: ["Portfolio / Work", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-3" })]
									}) : null
								]
							}),
							selectedApp.coverLetter ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-semibold text-muted-foreground uppercase",
									children: "Cover Letter"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border border-border bg-muted/30 p-3 leading-relaxed text-foreground whitespace-pre-wrap max-h-40 overflow-y-auto",
									children: selectedApp.coverLetter
								})]
							}) : null,
							selectedApp.interviewDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold uppercase text-amber-800 dark:text-amber-300 block",
									children: "Scheduled Interview"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-foreground font-medium",
									children: [
										new Date(selectedApp.interviewDate).toLocaleString("en-GB", {
											dateStyle: "full",
											timeStyle: "short",
											timeZone: "Africa/Lagos"
										}),
										" ",
										"· ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: selectedApp.interviewFormat
										})
									]
								})]
							}) : null,
							selectedApp.status === "rejected" && selectedApp.rejectionReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold uppercase text-rose-800 dark:text-rose-300 block",
									children: "Rejection Reason"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-foreground",
									children: selectedApp.rejectionReason
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 pt-2 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground uppercase",
										children: "Internal Notes (HR/Admin only)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 2,
										placeholder: "Candidate feedback, interview scores, observations...",
										value: internalNotes,
										onChange: (e) => setInternalNotes(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => updateStatusMutation.mutate({
												id: selectedApp.id,
												status: selectedApp.status,
												internalNotes
											}),
											disabled: updateStatusMutation.isPending,
											className: "text-xs h-7",
											children: "Save Notes"
										})
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border space-y-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "Move Status Stage:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-wrap items-center gap-1.5",
											children: [
												selectedApp.status === "applied" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => updateStatusMutation.mutate({
														id: selectedApp.id,
														status: "under_review",
														internalNotes
													}),
													className: "text-xs h-8 bg-sky-600 text-white",
													children: "Mark Under Review"
												}),
												selectedApp.status === "under_review" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => updateStatusMutation.mutate({
														id: selectedApp.id,
														status: "shortlisted",
														internalNotes
													}),
													className: "text-xs h-8 bg-indigo-600 text-white",
													children: "Shortlist Candidate"
												}),
												selectedApp.status === "shortlisted" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													onClick: () => setShowSchedule(true),
													className: "text-xs h-8 bg-amber-600 text-white",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-1.5 size-3.5" }), "Schedule Interview"]
												}),
												selectedApp.status === "interview_scheduled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => updateStatusMutation.mutate({
														id: selectedApp.id,
														status: "interview_done",
														internalNotes
													}),
													className: "text-xs h-8 bg-purple-600 text-white",
													children: "Mark Interview Done"
												}),
												selectedApp.status === "interview_done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														onClick: () => updateStatusMutation.mutate({
															id: selectedApp.id,
															status: "selected",
															internalNotes
														}),
														className: "text-xs h-8 bg-emerald-600 text-white",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 size-3.5" }), "Select Candidate"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "destructive",
														onClick: () => setShowRejectDialog(true),
														className: "text-xs h-8",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 size-3.5" }), "Reject"]
													})]
												}),
												selectedApp.status === "selected" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													onClick: () => openConvert(selectedApp),
													className: "text-xs h-8 bg-accent text-accent-foreground font-semibold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1.5 size-3.5" }), "Convert to Staff"]
												})
											]
										})]
									}),
									showSchedule && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-border bg-muted/40 p-3 space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: "Schedule Interview Details"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-[11px]",
														children: "Date & Time (WAT) *"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: "datetime-local",
														value: interviewDate,
														onChange: (e) => setInterviewDate(e.target.value)
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-[11px]",
														children: "Format *"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: interviewFormat,
														onValueChange: setInterviewFormat,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "In-person",
																children: "In-person"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "Video call",
																children: "Video call"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "Phone",
																children: "Phone"
															})
														] })]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setShowSchedule(false),
													children: "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => updateStatusMutation.mutate({
														id: selectedApp.id,
														status: "interview_scheduled",
														interviewDate,
														interviewFormat,
														internalNotes
													}),
													disabled: !interviewDate || updateStatusMutation.isPending,
													className: "bg-amber-600 text-white",
													children: "Confirm Schedule"
												})]
											})
										]
									}),
									showRejectDialog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-rose-800 dark:text-rose-300",
												children: "Mandatory Rejection Reason"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
												rows: 2,
												placeholder: "State feedback or reason for non-selection...",
												value: rejectionReason,
												onChange: (e) => setRejectionReason(e.target.value)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-end gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													onClick: () => setShowRejectDialog(false),
													children: "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "destructive",
													onClick: () => updateStatusMutation.mutate({
														id: selectedApp.id,
														status: "rejected",
														rejectionReason,
														internalNotes
													}),
													disabled: !rejectionReason.trim() || updateStatusMutation.isPending,
													children: "Confirm Rejection"
												})]
											})
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setDetailOpen(false),
						children: "Close"
					}) })
				] }) : null
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: convertOpen,
			onOpenChange: setConvertOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Convert Candidate to Staff" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Create an official Eden Shelters staff profile and Supabase Auth credentials for this hired candidate." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Full Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: convertName,
									onChange: (e) => setConvertName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: convertEmail,
										onChange: (e) => setConvertEmail(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: convertPhone,
										onChange: (e) => setConvertPhone(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: convertDept,
										onValueChange: (v) => setConvertDept(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: d,
											children: d
										}, d)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Position"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: convertPosition,
										onChange: (e) => setConvertPosition(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Role"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: convertRole,
										onValueChange: (v) => setConvertRole(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: r,
											children: roleLabel(r)
										}, r)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Employee ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: convertEmpId,
										onChange: (e) => setConvertEmpId(e.target.value)
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Temporary Password *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "text",
										value: convertPassword,
										onChange: (e) => setConvertPassword(e.target.value)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "The new staff member will be required to change this upon first login."
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setConvertOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => convertMutation.mutate(),
						disabled: convertMutation.isPending || !convertName || !convertEmail || !convertPassword,
						className: "bg-accent text-accent-foreground font-semibold",
						children: convertMutation.isPending ? "Creating Staff..." : "Confirm & Onboard"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { ApplicationsPage as component };
