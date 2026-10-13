import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { T as getRoleLandingPath } from "./format-D0gwmfzM.mjs";
import { o as getLoginStaffProfile } from "./access-D6IUEpza.mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
import { n as setBearerToken, r as signOut } from "./client-WGoQWNp1.mjs";
import { i as useCurrentUserState, t as Button } from "./button-BcOzCNJ3.mjs";
import { f as Eye, p as EyeOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-Cho-T70k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BXWB3aGe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LoginPage() {
	const { user, isPending } = useCurrentUserState();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/" });
	async function handleSubmit(e) {
		e.preventDefault();
		if (busy) return;
		setBusy(true);
		try {
			const cleanEmail = email.trim();
			const { data, error } = await supabase.auth.signInWithPassword({
				email: cleanEmail,
				password
			});
			if (error || !data?.session) {
				toast.error("Invalid email or password");
				setBusy(false);
				return;
			}
			setBearerToken(data.session.access_token);
			try {
				const profile = await getLoginStaffProfile();
				if (profile.status === "suspended" || profile.status === "exited") {
					toast.error("Your account has been suspended. Contact your administrator.");
					await signOut("/login");
					setBusy(false);
					return;
				}
				if (profile.mustChangePassword) {
					window.location.href = "/change-password";
					return;
				}
				const landing = getRoleLandingPath(profile.role);
				window.location.href = landing;
			} catch (err) {
				console.error("Profile resolution error:", err);
				window.location.href = "/";
			}
		} catch {
			toast.error("Invalid email or password");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-svh flex flex-col justify-center items-center bg-[#F9F7F4] p-4 sm:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-[420px] bg-white rounded-2xl border border-[#E8E4DD] shadow-sm p-8 sm:p-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center text-center mb-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/logo.png",
						alt: "Eden Shelters",
						className: "h-10 w-auto object-contain mb-5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-semibold tracking-tight text-foreground",
						children: "Staff Portal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground tracking-wide uppercase",
						children: "F8, Melita Plaza, Area 11 Garki · Abuja"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							className: "text-sm font-medium",
							children: "Email address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							autoComplete: "email",
							placeholder: "name@edenshelters.ng",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							required: true,
							disabled: busy,
							className: "h-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "password",
							className: "text-sm font-medium",
							children: "Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "password",
								type: showPassword ? "text" : "password",
								autoComplete: "current-password",
								placeholder: "••••••••",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								required: true,
								disabled: busy,
								className: "h-11 pr-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowPassword(!showPassword),
								tabIndex: -1,
								className: "absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
								"aria-label": showPassword ? "Hide password" : "Show password",
								children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full h-11 bg-[#C9A84C] hover:bg-[#B8973B] text-white font-medium text-sm rounded-lg transition-colors shadow-none cursor-pointer",
						children: busy ? "Signing in…" : "Sign In"
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-8 text-xs text-muted-foreground text-center",
			children: "Eden Shelters · RC 1847291 · Estate operations, Abuja"
		})]
	});
}
//#endregion
export { LoginPage as component };
