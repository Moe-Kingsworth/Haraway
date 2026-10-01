import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import "./client-BzrKyXF3.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BFe-DrCJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Stable fallback user, used ONLY when auth is disabled
* (`VITE_AUTH_ENABLED=false`, the shipped default). With auth on, the sandbox
* live preview does real sign-in via the baked preview client. Its id is
* `"dev-user"` — the SAME id `verify.server.ts` returns server-side — so per-user
* rows written in that mode belong to one consistent owner.
*/
var DEV_USER = {
	id: "dev-user",
	displayName: "Dev User",
	primaryEmail: "dev@example.com",
	profileImageUrl: null,
	isDevFallback: true
};
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	return {
		user: DEV_USER,
		isPending: false
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function LogoMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/logo-mark.png",
		alt: "Eden Shelters",
		className: cn("size-8 shrink-0 object-contain", className)
	});
}
function Wordmark({ inverted = false, name = "Eden Shelters", className }) {
	if (name && name !== "Eden Shelters") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-center gap-2.5", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "leading-tight",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("font-display text-base font-medium tracking-tight", inverted ? "text-sidebar-foreground" : "text-foreground"),
				children: name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: cn("text-xs tracking-wide uppercase", inverted ? "text-sidebar-muted" : "text-muted-foreground"),
				children: "Staff Portal"
			})]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex items-center", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: inverted ? "/logo-inverted.png" : "/logo.png",
			alt: name,
			className: "h-9 w-auto max-w-full object-contain"
		})
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-accent",
			secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
			outline: "border border-border bg-card text-foreground hover:bg-muted",
			ghost: "hover:bg-muted text-foreground",
			destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
			link: "text-accent underline-offset-4 hover:underline"
		},
		size: {
			default: "h-10 px-4",
			sm: "h-8 rounded-sm px-3 text-xs",
			lg: "h-11 rounded-md px-5",
			icon: "h-10 w-10"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { useCurrentUserState as a, useCurrentUser as i, Wordmark as n, cn as r, Button as t };
