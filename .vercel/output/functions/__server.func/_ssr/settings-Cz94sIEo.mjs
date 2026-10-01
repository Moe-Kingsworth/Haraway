import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { E as isAdmin } from "./format-CslrSBid.mjs";
import { i as getBootstrap, l as updateWorkspace } from "./access-mHLhjGqG.mjs";
import { t as Button } from "./button-BFe-DrCJ.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-D-Qm8Q2Q.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DyuG4pKK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Label, t as Input } from "./label-ZHM-2AwH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-Cz94sIEo.js
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const isAdmin$1 = boot.data?.access ? isAdmin(boot.data.access.role) : false;
	const ws = boot.data?.access.workspace;
	const save = useMutation({
		mutationFn: (data) => updateWorkspace({ data }),
		onSuccess: () => {
			toast.success("Company file saved.");
			qc.invalidateQueries({ queryKey: ["bootstrap"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		kicker: "Company",
		title: "The firm",
		description: "Name, address and RC number as they appear on purchase forms and receipts."
	}), !ws ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64 rounded-xl" }) : !isAdmin$1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-5 text-sm text-muted-foreground",
		children: "Only the operations desk can amend the company file."
	}) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "max-w-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Letterhead" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "space-y-3",
			onSubmit: (e) => {
				e.preventDefault();
				const fd = new FormData(e.currentTarget);
				save.mutate({
					companyName: String(fd.get("companyName")),
					tagline: String(fd.get("tagline")),
					address: String(fd.get("address")),
					phone: String(fd.get("phone")),
					email: String(fd.get("email")),
					rcNumber: String(fd.get("rcNumber"))
				});
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Company name",
					name: "companyName",
					defaultValue: ws.companyName,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Tagline",
					name: "tagline",
					defaultValue: ws.tagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Address",
					name: "address",
					defaultValue: ws.address,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Phone",
					name: "phone",
					defaultValue: ws.phone,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Email",
					name: "email",
					type: "email",
					defaultValue: ws.email,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "RC number",
					name: "rcNumber",
					defaultValue: ws.rcNumber,
					required: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: save.isPending,
					children: "Save letterhead"
				})
			]
		}, ws.companyName + ws.rcNumber) })]
	})] });
}
function Field({ label, name, type = "text", defaultValue, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: name,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			id: name,
			name,
			type,
			defaultValue,
			required
		})]
	});
}
//#endregion
export { SettingsPage as component };
