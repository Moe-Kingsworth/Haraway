import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime, r as Slot } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
import { n as setBearerToken } from "./client-WGoQWNp1.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BcOzCNJ3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Current user + loading state powered by Supabase Auth.
* Automatically synchronizes bearer tokens and listens for auth changes.
*/
function useCurrentUserState() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isPending, setIsPending] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!mounted) return;
			if (session?.user) {
				setBearerToken(session.access_token);
				const meta = session.user.user_metadata || {};
				setUser({
					id: session.user.id,
					displayName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Staff",
					primaryEmail: session.user.email || null,
					profileImageUrl: meta.avatar_url || null,
					isDevFallback: false
				});
			} else {
				setBearerToken(null);
				setUser(null);
			}
			setIsPending(false);
		}).catch(() => {
			if (mounted) setIsPending(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!mounted) return;
			if (session?.user) {
				setBearerToken(session.access_token);
				const meta = session.user.user_metadata || {};
				setUser({
					id: session.user.id,
					displayName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Staff",
					primaryEmail: session.user.email || null,
					profileImageUrl: meta.avatar_url || null,
					isDevFallback: false
				});
			} else {
				setBearerToken(null);
				setUser(null);
			}
			setIsPending(false);
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);
	return {
		user,
		isPending
	};
}
function useCurrentUser() {
	return useCurrentUserState().user;
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
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
export { useCurrentUserState as i, cn as n, useCurrentUser as r, Button as t };
