import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { s as initials } from "./format-Tz25-cit.mjs";
import { r as cn } from "./button-BS70WMgP.mjs";
import { _ as avatarTone } from "./constants-C6wSzqdU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/person-chip-CZM1RLbM.js
var import_jsx_runtime = require_jsx_runtime();
function PersonChip({ id, name, meta, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("grid shrink-0 place-items-center rounded-full font-medium", size === "sm" ? "size-7 text-xs" : "size-9 text-xs", avatarTone(id)),
			children: initials(name)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-sm font-medium",
				children: name
			}), meta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block truncate text-xs text-muted-foreground",
				children: meta
			}) : null]
		})]
	});
}
//#endregion
export { PersonChip as t };
