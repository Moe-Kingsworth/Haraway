import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as DEPARTMENTS } from "./constants-Dvnu62zU.mjs";
import { A as Funnel, L as Clock, S as MapPin, X as Briefcase, Z as ArrowRight, d as Sparkles, h as Search, w as LogIn } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, r as Wordmark, t as Badge } from "./badge-BJzbO8FA.mjs";
import { n as CardContent, t as Card } from "./card-DHh5pwIE.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { i as getPublicJobPostings } from "./jobs-Bpxr4sVI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/careers-DUTWh2DW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CareersPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [deptFilter, setDeptFilter] = (0, import_react.useState)("all");
	const query = useQuery({
		queryKey: ["public-jobs"],
		queryFn: () => getPublicJobPostings()
	});
	const jobs = query.data ?? [];
	const filteredJobs = (0, import_react.useMemo)(() => {
		return jobs.filter((job) => {
			if (deptFilter !== "all" && job.department !== deptFilter) return false;
			if (search.trim()) {
				const q = search.trim().toLowerCase();
				const matchTitle = job.title.toLowerCase().includes(q);
				const matchDesc = job.description.toLowerCase().includes(q);
				const matchDept = job.department.toLowerCase().includes(q);
				if (!matchTitle && !matchDesc && !matchDept) return false;
			}
			return true;
		});
	}, [
		jobs,
		deptFilter,
		search
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-[#F9F7F4] text-foreground flex flex-col selection:bg-accent/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/60 bg-[#F9F7F4]/90 backdrop-blur-md px-4 py-3.5 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/careers",
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { name: "Eden Shelters" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/login",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "text-xs font-medium text-muted-foreground hover:text-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-1.5 size-3.5" }), "Staff Portal"]
							})
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border/50 bg-gradient-to-b from-[#4B2E1E]/5 to-transparent px-4 py-16 sm:px-8 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-3xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-[#C9A84C]/20 text-[#4B2E1E] border-[#C9A84C]/40 px-3 py-1 text-xs font-semibold",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1.5 size-3.5 text-[#C9A84C]" }), "Careers at Eden Shelters"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-3xl sm:text-5xl font-medium tracking-tight text-[#4B2E1E]",
							children: "Build the Future of Prime Estate Operations in Abuja"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto",
							children: "We are assembling Nigeria’s leading property professionals — from luxury sales specialists and legal closing counsels to operational leaders delivering Maitama, Guzape, and Asokoro landmarks."
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto max-w-6xl w-full px-4 py-12 sm:px-8 space-y-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-border shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-full sm:max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search open positions by role or keywords...",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-9 h-10 text-xs bg-transparent border-border/70"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 w-full sm:w-auto",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "size-4 text-muted-foreground hidden sm:inline-block" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: deptFilter,
							onValueChange: setDeptFilter,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-10 w-full sm:w-44 text-xs",
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
				}), query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-xl bg-white" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-xl bg-white" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-56 rounded-xl bg-white" })
					]
				}) : filteredJobs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-dashed border-border/80 bg-white p-16 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto size-12 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-semibold text-foreground",
							children: "No open positions at this time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto",
							children: "Check back soon or revisit this page as our recruitment team periodically posts new vacancies."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
					children: filteredJobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "rounded-2xl border border-border/80 bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-6 space-y-4 flex flex-col flex-1 justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-border text-[11px] text-muted-foreground",
											children: job.department
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground tabular-nums",
											children: new Date(job.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-lg font-semibold tracking-tight text-[#4B2E1E] line-clamp-1",
										children: job.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-3.5 text-accent" }), job.location]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5 text-accent" }), job.employmentType]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground line-clamp-3 leading-relaxed pt-2",
										children: job.description
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-4 border-t border-border/60",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/careers/$id",
									params: { id: job.id },
									className: "w-full block",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "w-full bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold text-xs h-10 shadow-sm cursor-pointer",
										children: ["Apply Now", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1.5 size-4" })]
									})
								})
							})]
						})
					}, job.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-auto border-t border-border/60 bg-white px-4 py-8 sm:px-8 text-xs text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1 text-center sm:text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-semibold text-foreground",
								children: "Eden Shelters Limited"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "F8, Melita Plaza, Gimbiya Street, Area 11 Garki FCT, Abuja" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "RC 1847291 · ops@edenshelters.ng · +234 9 461 2200" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center sm:text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Eden Shelters. All rights reserved."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground/80 mt-1",
							children: "Equal opportunity estate employer."
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { CareersPage as component };
