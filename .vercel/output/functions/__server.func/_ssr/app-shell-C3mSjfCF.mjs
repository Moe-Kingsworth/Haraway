import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { d as useRouterState, v as Link, y as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { i as signOut } from "./client-B40BzJxt.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as useCurrentUserState, i as useCurrentUser, n as Wordmark, r as cn, t as Button } from "./button-BS70WMgP.mjs";
import { a as hasGateSessionMarker } from "./server-CCpKKDfz.mjs";
import { _ as Briefcase, a as ScrollText, c as LayoutDashboard, d as ClipboardList, g as Building2, h as CalendarCheck, l as Landmark, m as ChartLine, n as Wallet, o as Receipt, r as Users, s as Menu, t as X, u as House } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-C3mSjfCF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var Sheet = Dialog;
var SheetContent = import_react.forwardRef(({ className, children, side = "right", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn("fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col bg-sidebar text-sidebar-foreground shadow-soft", side === "left" ? "inset-y-0 left-0" : "inset-y-0 right-0", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute top-4 right-4 rounded-sm p-1 text-sidebar-muted hover:text-sidebar-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
SheetContent.displayName = "SheetContent";
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground",
		secondary: "border-transparent bg-secondary text-secondary-foreground",
		outline: "border-border text-foreground",
		success: "border-transparent bg-success/12 text-success",
		warning: "border-transparent bg-warning/12 text-warning",
		danger: "border-transparent bg-destructive/12 text-destructive",
		muted: "border-transparent bg-muted text-muted-foreground"
	} },
	defaultVariants: { variant: "secondary" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var NAV = [
	{
		href: "/",
		label: "Overview",
		icon: LayoutDashboard,
		adminOnly: false
	},
	{
		href: "/desk",
		label: "My desk",
		icon: House,
		adminOnly: false
	},
	{
		href: "/staff",
		label: "People",
		icon: Users,
		adminOnly: true
	},
	{
		href: "/attendance",
		label: "Attendance",
		icon: CalendarCheck,
		adminOnly: false
	},
	{
		href: "/payroll",
		label: "Payroll",
		icon: Wallet,
		adminOnly: false
	},
	{
		href: "/performance",
		label: "Performance",
		icon: ChartLine,
		adminOnly: false
	},
	{
		href: "/tasks",
		label: "Tasks",
		icon: ClipboardList,
		adminOnly: false
	},
	{
		href: "/clients",
		label: "Clients",
		icon: Briefcase,
		adminOnly: false
	},
	{
		href: "/properties",
		label: "Listings",
		icon: Building2,
		adminOnly: false
	},
	{
		href: "/deals",
		label: "Purchase forms",
		icon: ScrollText,
		adminOnly: false
	},
	{
		href: "/receipts",
		label: "Receipts",
		icon: Receipt,
		adminOnly: false
	},
	{
		href: "/settings",
		label: "Company",
		icon: Landmark,
		adminOnly: true
	}
];
function NavLinks({ role, onNavigate, pathname }) {
	const items = NAV.filter((item) => !item.adminOnly || role === "admin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-1 flex-col gap-0.5 overflow-y-auto px-3",
		children: items.map((item) => {
			const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.href,
				onClick: onNavigate,
				className: cn("flex h-10 items-center gap-3 rounded-sm px-3 text-sm transition-colors", active ? "bg-sidebar-foreground/10 text-sidebar-foreground" : "text-sidebar-muted hover:bg-sidebar-foreground/10 hover:text-sidebar-foreground"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0" }), item.label]
			}, item.href);
		})
	});
}
function SidebarBody({ role, workspace, onNavigate, pathname }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-5 pt-6 pb-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, {
				inverted: true,
				name: workspace.companyName
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-sidebar-muted",
				children: workspace.tagline
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
			role,
			onNavigate,
			pathname
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-auto px-5 py-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-sidebar-muted",
				children: workspace.address
			})
		})
	] });
}
var FALLBACK_WORKSPACE = {
	userId: "",
	companyName: "Aso Terrace",
	tagline: "Estate operations, Abuja",
	address: "Plot 42, Aminu Kano Crescent, Wuse II, Abuja, FCT",
	phone: "+234 9 461 2200",
	email: "ops@asoterrace.ng",
	rcNumber: "RC 1847291"
};
function AppShell({ children }) {
	const { user, isPending } = useCurrentUserState();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const bootstrap = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap(),
		enabled: Boolean(user)
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "hidden h-svh w-60 shrink-0 flex-col bg-sidebar md:flex",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-5 pt-6 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wordmark, { inverted: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-sidebar-muted",
					children: "Loading the desk…"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "flex-1 p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase",
					children: "Aso Terrace"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mb-4 font-display text-2xl font-medium tracking-tight",
					children: "The operations desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" })
			]
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const role = bootstrap.data?.access.role ?? "admin";
	const workspace = bootstrap.data?.access.workspace ?? FALLBACK_WORKSPACE;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-svh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "print-hidden hidden h-svh w-60 shrink-0 flex-col bg-sidebar md:flex",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {
				role,
				workspace,
				pathname
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "print-hidden sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur-sm md:px-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							className: "md:hidden",
							onClick: () => setOpen(true),
							"aria-label": "Open menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-sm text-muted-foreground",
								children: [new Intl.DateTimeFormat("en-GB", {
									weekday: "long",
									day: "numeric",
									month: "long",
									timeZone: "Africa/Lagos"
								}).format(/* @__PURE__ */ new Date()), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: " · West Africa Time"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "hidden sm:inline-flex",
							children: role === "admin" ? "Operations desk" : "Team desk"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "left",
						className: "p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarBody, {
							role,
							workspace,
							pathname,
							onNavigate: () => setOpen(false)
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 px-4 py-6 md:px-8 md:py-8",
					children
				})
			]
		})]
	});
}
//#endregion
export { Badge as n, Skeleton as r, AppShell as t };
