import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as DEPARTMENTS } from "./constants-Dvnu62zU.mjs";
import { a as getBootstrap } from "./access-DIVfVghL.mjs";
import { I as Ellipsis, L as Clock, N as Eye, S as MapPin, V as CircleCheckBig, X as Briefcase, b as Pencil, m as ShieldAlert, r as Users, u as Trash2, y as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, t as Badge } from "./badge-BJzbO8FA.mjs";
import { t as AppShell } from "./app-shell-DuzJoH7o.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DHh5pwIE.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Bq583Q1q.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { t as Label } from "./label-CPeUE8i1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { t as Textarea } from "./textarea-Dy6h8d4C.mjs";
import { l as upsertJobPosting, n as deleteJobPosting, o as listJobPostings } from "./jobs-Bpxr4sVI.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-D3sYENOi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/jobs-BwbaqPTS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPLOYMENT_TYPES = [
	"Full-time",
	"Part-time",
	"Contract"
];
function StatusBadge({ status }) {
	if (status === "published") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-emerald-500/15 text-emerald-700 border-emerald-500/30",
		children: "Published"
	});
	if (status === "draft") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		className: "bg-amber-500/15 text-amber-700 border-amber-500/30",
		children: "Draft"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: "secondary",
		children: "Unpublished"
	});
}
function JobsPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const isAllowed = ["super_admin", "hr_admin"].includes(boot.data?.access.role ?? "");
	const jobsQuery = useQuery({
		queryKey: ["admin-jobs"],
		queryFn: () => listJobPostings(),
		enabled: isAllowed
	});
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [dept, setDept] = (0, import_react.useState)("Sales");
	const [type, setType] = (0, import_react.useState)("Full-time");
	const [location, setLocation] = (0, import_react.useState)("Abuja, Nigeria");
	const [description, setDescription] = (0, import_react.useState)("");
	const [requirements, setRequirements] = (0, import_react.useState)("");
	const [responsibilities, setResponsibilities] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("draft");
	const upsertMutation = useMutation({
		mutationFn: () => upsertJobPosting({ data: {
			id: editingId || void 0,
			title,
			department: dept,
			employmentType: type,
			location,
			description,
			requirements,
			responsibilities,
			status
		} }),
		onSuccess: () => {
			toast.success(editingId ? "Job posting updated" : "Job posting created");
			qc.invalidateQueries({ queryKey: ["admin-jobs"] });
			setDialogOpen(false);
			resetForm();
		},
		onError: (e) => toast.error(e.message)
	});
	const togglePublishMutation = useMutation({
		mutationFn: (posting) => upsertJobPosting({ data: {
			id: posting.id,
			title: posting.title,
			department: posting.department,
			employmentType: posting.employmentType,
			location: posting.location,
			description: posting.description,
			requirements: posting.requirements,
			responsibilities: posting.responsibilities,
			status: posting.status === "published" ? "unpublished" : "published"
		} }),
		onSuccess: () => {
			toast.success("Job status updated");
			qc.invalidateQueries({ queryKey: ["admin-jobs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => deleteJobPosting({ data: { id } }),
		onSuccess: () => {
			toast.success("Job posting removed");
			qc.invalidateQueries({ queryKey: ["admin-jobs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	function resetForm() {
		setEditingId(null);
		setTitle("");
		setDept("Sales");
		setType("Full-time");
		setLocation("Abuja, Nigeria");
		setDescription("");
		setRequirements("");
		setResponsibilities("");
		setStatus("draft");
	}
	function openEdit(posting) {
		setEditingId(posting.id);
		setTitle(posting.title);
		setDept(posting.department || "Sales");
		setType(posting.employmentType || "Full-time");
		setLocation(posting.location || "Abuja, Nigeria");
		setDescription(posting.description);
		setRequirements(posting.requirements);
		setResponsibilities(posting.responsibilities);
		setStatus(posting.status);
		setDialogOpen(true);
	}
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
				children: "Job posting management is available to HR/Admin and Super Admin roles."
			})
		]
	}) });
	const jobs = jobsQuery.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Talent & Recruitment",
			title: "Job Postings",
			description: "Publish career openings to the public careers portal, manage vacancies, and track incoming candidates.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/careers",
					target: "_blank",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-2 size-4" }), "View Careers Page"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => {
						resetForm();
						setDialogOpen(true);
					},
					className: "bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Create Job"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: jobsQuery.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" })
				]
			}) : jobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-xl border border-dashed p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto size-12 text-muted-foreground/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "mt-4 text-base font-medium",
						children: "No job postings created"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground max-w-sm mx-auto",
						children: "Create your first opening to attract candidates on the public Eden Shelters Careers page."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							resetForm();
							setDialogOpen(true);
						},
						className: "mt-4 bg-primary text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 size-4" }), "Post a Position"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "pb-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
								className: "text-base line-clamp-1",
								children: job.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: job.department
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: job.status })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 pb-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5" }), job.location]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }), job.employmentType]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-foreground/80 line-clamp-2",
								children: job.description || "No description provided."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between pt-2 border-t border-border/60 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/applications",
									className: "flex items-center gap-1.5 font-medium text-primary hover:underline",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [job.applicationsCount || 0, " applications"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										className: "size-7",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "size-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => openEdit(job),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 size-3.5" }), "Edit Posting"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => togglePublishMutation.mutate(job),
											disabled: togglePublishMutation.isPending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "mr-2 size-3.5" }), job.status === "published" ? "Unpublish" : "Publish"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => deleteMutation.mutate(job.id),
											className: "text-destructive focus:text-destructive",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-2 size-3.5" }), "Delete Posting"]
										})
									]
								})] })]
							})
						]
					})]
				}, job.id))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: dialogOpen,
			onOpenChange: setDialogOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg max-h-[90vh] overflow-y-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingId ? "Edit Job Posting" : "Create Job Posting" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Configure the vacancy details. Published positions will appear on the public careers portal." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Job Title *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. Senior Real Estate Consultant",
									value: title,
									onChange: (e) => setTitle(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Department *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: dept,
										onValueChange: (v) => setDept(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: d,
											children: d
										}, d)) })]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Employment Type *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: type,
										onValueChange: (v) => setType(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EMPLOYMENT_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: t,
											children: t
										}, t)) })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: location,
										onChange: (e) => setLocation(e.target.value)
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: status,
										onValueChange: (v) => setStatus(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "draft",
												children: "Draft (Hidden)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "published",
												children: "Published (Live)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "unpublished",
												children: "Unpublished (Archived)"
											})
										] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Job Description *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									placeholder: "Describe the opportunity, team environment, and core mandate...",
									value: description,
									onChange: (e) => setDescription(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Requirements (one per line)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									placeholder: "5+ years property sales experience in Abuja\nProven portfolio in Maitama / Guzape\nB.Sc in Estate Management or relevant discipline",
									value: requirements,
									onChange: (e) => setRequirements(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Responsibilities (one per line)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 3,
									placeholder: "Originate high-value buyer transactions\nConduct private viewings with HNIs\nPrepare documentation and closing packets",
									value: responsibilities,
									onChange: (e) => setResponsibilities(e.target.value)
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setDialogOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => upsertMutation.mutate(),
						disabled: upsertMutation.isPending || !title.trim(),
						className: "bg-primary text-primary-foreground",
						children: upsertMutation.isPending ? "Saving..." : editingId ? "Update Job" : "Create Job"
					})] })
				]
			})
		})
	] });
}
//#endregion
export { JobsPage as component };
