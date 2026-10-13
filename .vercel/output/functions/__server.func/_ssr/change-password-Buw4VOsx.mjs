import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { y as getRoleLandingPath } from "./constants-Dvnu62zU.mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
import { r as completePasswordChange } from "./access-DIVfVghL.mjs";
import { N as Eye, P as EyeOff } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCurrentUserState } from "./use-current-user-lWYjPfuZ.mjs";
import { t as Button } from "./button-DvoKzsAM.mjs";
import { t as Input } from "./input-zlVt__pg.mjs";
import { t as Label } from "./label-CPeUE8i1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/change-password-Buw4VOsx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ChangePasswordPage() {
	const { user, isPending } = useCurrentUserState();
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [showNew, setShowNew] = (0, import_react.useState)(false);
	const [showConfirm, setShowConfirm] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (!isPending && !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to: "/login" });
	async function handleSubmit(e) {
		e.preventDefault();
		if (busy) return;
		if (newPassword.length < 8) {
			toast.error("Password must be at least 8 characters.");
			return;
		}
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}
		setBusy(true);
		try {
			const { error } = await supabase.auth.updateUser({ password: newPassword });
			if (error) {
				toast.error(error.message || "Failed to update password.");
				setBusy(false);
				return;
			}
			const res = await completePasswordChange();
			toast.success("Password updated. Welcome to Eden Shelters Staff Portal.");
			const landing = getRoleLandingPath(res.role);
			window.location.href = landing;
		} catch (err) {
			console.error("Password change error:", err);
			toast.error("An error occurred while updating your password.");
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
						children: "Set New Password"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground leading-relaxed",
						children: "Your account requires a password change before continuing to the desk."
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "new-password",
							className: "text-sm font-medium",
							children: "New Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "new-password",
								type: showNew ? "text" : "password",
								autoComplete: "new-password",
								placeholder: "Minimum 8 characters",
								value: newPassword,
								onChange: (e) => setNewPassword(e.target.value),
								minLength: 8,
								required: true,
								disabled: busy,
								className: "h-11 pr-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowNew(!showNew),
								tabIndex: -1,
								className: "absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
								"aria-label": showNew ? "Hide password" : "Show password",
								children: showNew ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "confirm-password",
							className: "text-sm font-medium",
							children: "Confirm Password"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "confirm-password",
								type: showConfirm ? "text" : "password",
								autoComplete: "new-password",
								placeholder: "Re-enter new password",
								value: confirmPassword,
								onChange: (e) => setConfirmPassword(e.target.value),
								minLength: 8,
								required: true,
								disabled: busy,
								className: "h-11 pr-11 border-[#DDD7CD] focus-visible:ring-[#C9A84C]"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setShowConfirm(!showConfirm),
								tabIndex: -1,
								className: "absolute right-0 top-0 h-11 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
								"aria-label": showConfirm ? "Hide password" : "Show password",
								children: showConfirm ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						className: "w-full h-11 bg-[#C9A84C] hover:bg-[#B8973B] text-white font-medium text-sm rounded-lg transition-colors shadow-none cursor-pointer",
						children: busy ? "Updating password…" : "Update Password"
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
export { ChangePasswordPage as component };
