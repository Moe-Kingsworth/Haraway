import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as cn } from "./button-DvoKzsAM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-BJzbO8FA.js
var import_jsx_runtime = require_jsx_runtime();
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
//#endregion
export { Skeleton as n, Wordmark as r, Badge as t };
