import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
import { B as CircleCheck, L as Clock, M as FileCheck, Q as ArrowLeft, S as MapPin, w as LogIn } from "../_libs/lucide-react.mjs";
import { n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as Route$3 } from "./router-o6QkYaZz.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { n as Skeleton, r as Wordmark, t as Badge } from "./badge-BJzbO8FA.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-Bq583Q1q.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { t as Label } from "./label-CPeUE8i1.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-Dh9Uoc03.mjs";
import { t as Textarea } from "./textarea-Dy6h8d4C.mjs";
import { r as getPublicJobPostingById, s as submitPublicJobApplication } from "./jobs-Bpxr4sVI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/careers_._id-CIAfK_hg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var REFERRAL_SOURCES = [
	"LinkedIn",
	"Referral",
	"Website",
	"Walk-in",
	"Other"
];
function JobDetailPage() {
	const { id } = Route$3.useParams();
	const query = useQuery({
		queryKey: ["public-job", id],
		queryFn: () => getPublicJobPostingById({ data: { id } })
	});
	const job = query.data;
	const [applyOpen, setApplyOpen] = (0, import_react.useState)(false);
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [experience, setExperience] = (0, import_react.useState)(3);
	const [currentJobTitle, setCurrentJobTitle] = (0, import_react.useState)("");
	const [coverLetter, setCoverLetter] = (0, import_react.useState)("");
	const [linkedinUrl, setLinkedinUrl] = (0, import_react.useState)("");
	const [portfolioUrl, setPortfolioUrl] = (0, import_react.useState)("");
	const [referralSource, setReferralSource] = (0, import_react.useState)("Website");
	const [cvFile, setCvFile] = (0, import_react.useState)(null);
	const [cvUploading, setCvUploading] = (0, import_react.useState)(false);
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const applyMutation = useMutation({
		mutationFn: async () => {
			if (!job) throw new Error("Job not found.");
			if (!fullName.trim() || !email.trim() || !phone.trim()) throw new Error("Please complete all required fields.");
			if (!cvFile) throw new Error("Please upload your CV in PDF format.");
			if (cvFile.size > 5242880) throw new Error("CV file size exceeds 5MB limit.");
			setCvUploading(true);
			let uploadedCvUrl = "";
			try {
				const filePath = `resumes/${`${Date.now()}-${Math.random().toString(36).slice(2, 8)}.pdf`}`;
				const { data: uploadData, error: uploadErr } = await supabase.storage.from("cvs").upload(filePath, cvFile, {
					contentType: "application/pdf",
					upsert: false
				});
				if (uploadErr) {
					console.warn("Storage upload error, using direct reference:", uploadErr);
					uploadedCvUrl = await new Promise((resolve) => {
						const reader = new FileReader();
						reader.onload = () => resolve(reader.result);
						reader.readAsDataURL(cvFile);
					});
				} else {
					const { data: urlData } = supabase.storage.from("cvs").getPublicUrl(filePath);
					uploadedCvUrl = urlData.publicUrl;
				}
			} catch (e) {
				console.warn("Fallback to base64 CV:", e);
				uploadedCvUrl = await new Promise((resolve) => {
					const reader = new FileReader();
					reader.onload = () => resolve(reader.result);
					reader.readAsDataURL(cvFile);
				});
			} finally {
				setCvUploading(false);
			}
			return submitPublicJobApplication({ data: {
				jobPostingId: job.id,
				fullName,
				email,
				phone,
				yearsExperience: Number(experience) || 0,
				currentJobTitle,
				coverLetter,
				cvUrl: uploadedCvUrl,
				linkedinUrl: linkedinUrl || void 0,
				portfolioUrl: portfolioUrl || void 0,
				referralSource
			} });
		},
		onSuccess: () => {
			setSubmitted(true);
			toast.success("Application submitted successfully!");
		},
		onError: (e) => {
			setCvUploading(false);
			toast.error(e.message);
		}
	});
	const requirementsList = job?.requirements ? job.requirements.split("\n").map((r) => r.trim()).filter(Boolean) : [];
	const responsibilitiesList = job?.responsibilities ? job.responsibilities.split("\n").map((r) => r.trim()).filter(Boolean) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-svh bg-[#F9F7F4] text-foreground flex flex-col selection:bg-accent/20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-30 border-b border-border/60 bg-[#F9F7F4]/90 backdrop-blur-md px-4 py-3.5 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-5xl items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/careers",
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { name: "Eden Shelters" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							className: "text-xs font-medium text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "mr-1.5 size-3.5" }), "Staff Portal"]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 mx-auto max-w-5xl w-full px-4 py-8 sm:py-12 sm:px-8 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/careers",
					className: "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5" }), "Back to all open positions"]
				}) }), query.isLoading || !job ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-2/3 bg-white" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full bg-white" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 w-full bg-white" })
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-2 space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center justify-between gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "border-border text-xs",
											children: job.department
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground tabular-nums",
											children: ["Posted on ", new Date(job.createdAt).toLocaleDateString("en-GB", { dateStyle: "long" })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "font-display text-2xl sm:text-4xl font-semibold tracking-tight text-[#4B2E1E]",
										children: job.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "size-4 text-accent" }), job.location]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1.5 font-medium",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-4 text-accent" }), job.employmentType]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-semibold text-[#4B2E1E]",
									children: "Role Overview"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap",
									children: job.description
								})]
							}),
							responsibilitiesList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-semibold text-[#4B2E1E]",
									children: "Key Responsibilities"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2.5 text-sm text-foreground/90",
									children: responsibilitiesList.map((resp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-1.5 rounded-full bg-accent mt-2 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: resp })]
									}, i))
								})]
							}),
							requirementsList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/80 bg-white p-6 sm:p-8 space-y-4 shadow-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg font-semibold text-[#4B2E1E]",
									children: "Requirements & Qualifications"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "space-y-2.5 text-sm text-foreground/90",
									children: requirementsList.map((req, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-start gap-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-emerald-600 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: req })]
									}, i))
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sticky top-20 rounded-2xl border border-border/80 bg-white p-6 space-y-5 shadow-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-lg font-semibold text-[#4B2E1E]",
									children: "Apply for this Position"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "Join Eden Shelters in delivering premier real estate and property operations across Abuja."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => {
											setSubmitted(false);
											setApplyOpen(true);
										},
										className: "w-full bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold text-sm h-11 shadow-sm cursor-pointer",
										children: "Apply for this role"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl bg-muted/40 p-4 space-y-2.5 text-xs border border-border/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground",
										children: "Application Checklist:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
										className: "space-y-1.5 text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Curriculum Vitae (PDF max 5MB)" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Contact details & experience history" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Brief cover letter / motivation" })
										]
									})]
								})
							]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: applyOpen,
				onOpenChange: setApplyOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-xl max-h-[90vh] overflow-y-auto",
					children: submitted ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 text-center space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mx-auto size-14 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-8" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-xl font-display text-[#4B2E1E]",
								children: "Application Submitted!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed",
								children: [
									"Thank you for applying for ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: job?.title
									}),
									". We'll be in touch within 5 working days."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setApplyOpen(false),
								className: "bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold",
								children: "Return to Job Description"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display text-xl text-[#4B2E1E]",
							children: ["Apply: ", job?.title]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Fill out the form below. All applications are reviewed directly by the Eden Shelters recruitment team."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Full Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Moses Kingsworth",
										value: fullName,
										onChange: (e) => setFullName(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Email Address *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "email",
											placeholder: "you@example.com",
											value: email,
											onChange: (e) => setEmail(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Phone Number *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "+234 803 000 0000",
											value: phone,
											onChange: (e) => setPhone(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Position Applied For"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: job?.title ?? "",
											disabled: true,
											className: "bg-muted text-muted-foreground"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Years of Experience *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 0,
											max: 40,
											value: experience,
											onChange: (e) => setExperience(Number(e.target.value))
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Current or Last Job Title *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										placeholder: "e.g. Senior Realtor at Prime Homes",
										value: currentJobTitle,
										onChange: (e) => setCurrentJobTitle(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Cover Letter / Note *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 3,
										placeholder: "Tell us about your background, major achievements, and why you wish to join Eden Shelters...",
										value: coverLetter,
										onChange: (e) => setCoverLetter(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "CV Upload (PDF only, max 5MB) *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-dashed border-border p-4 text-center space-y-2 bg-muted/20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "file",
											accept: ".pdf,application/pdf",
											onChange: (e) => {
												const file = e.target.files?.[0];
												if (file) {
													if (file.size > 5242880) {
														toast.error("File size exceeds 5MB limit.");
														return;
													}
													setCvFile(file);
												}
											},
											className: "cursor-pointer text-xs"
										}), cvFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-emerald-600 font-medium flex items-center justify-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "size-3.5" }),
												"Selected: ",
												cvFile.name,
												" (",
												(cvFile.size / 1024 / 1024).toFixed(2),
												" MB)"
											]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Attach your latest CV or resume in PDF format."
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "LinkedIn URL (optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "https://linkedin.com/in/...",
											value: linkedinUrl,
											onChange: (e) => setLinkedinUrl(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Portfolio URL (optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											placeholder: "https://...",
											value: portfolioUrl,
											onChange: (e) => setPortfolioUrl(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "How did you hear about us? *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: referralSource,
										onValueChange: (v) => setReferralSource(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REFERRAL_SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: s,
											children: s
										}, s)) })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setApplyOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => applyMutation.mutate(),
								disabled: applyMutation.isPending || cvUploading || !fullName.trim() || !email.trim() || !phone.trim() || !cvFile,
								className: "bg-[#C9A84C] text-[#4B2E1E] hover:bg-[#C9A84C]/90 font-semibold",
								children: applyMutation.isPending || cvUploading ? "Submitting..." : "Submit Application"
							})]
						})
					] })
				})
			})
		]
	});
}
//#endregion
export { JobDetailPage as component };
