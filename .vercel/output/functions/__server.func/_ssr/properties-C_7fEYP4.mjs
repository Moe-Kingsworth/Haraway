import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as formatNgn } from "./format-Tz25-cit.mjs";
import { r as getBootstrap } from "./access-BBPyLmQY.mjs";
import { t as Button } from "./button-BS70WMgP.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { r as Skeleton, t as AppShell } from "./app-shell-C3mSjfCF.mjs";
import { t as EmptyState } from "./empty-state-DyaU8KfX.mjs";
import { t as PageHeader } from "./page-header-CCpi55Qm.mjs";
import { c as DISTRICTS, f as PROPERTY_STATUSES, p as PROPERTY_TYPES } from "./constants-C6wSzqdU.mjs";
import { t as StatusBadge } from "./status-badge-CiaZNO0h.mjs";
import { n as CardContent, t as Card } from "./card-CH-yyI5c.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-Bvk90m3e.mjs";
import { n as Label, t as Input } from "./label-BC8fU-lS.mjs";
import { t as Textarea } from "./textarea-Bp7dnapg.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DwnO6F4h.mjs";
import { s as listProperties, u as upsertProperty } from "./crm-Dhws9iQH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/properties-C_7fEYP4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PropertiesPage() {
	const qc = useQueryClient();
	const boot = useQuery({
		queryKey: ["bootstrap"],
		queryFn: () => getBootstrap()
	});
	const properties = useQuery({
		queryKey: ["properties"],
		queryFn: () => listProperties()
	});
	const isAdmin = boot.data?.access.role === "admin";
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const save = useMutation({
		mutationFn: (data) => upsertProperty({ data }),
		onSuccess: () => {
			toast.success("Listing saved.");
			setOpen(false);
			setEditing(null);
			qc.invalidateQueries({ queryKey: ["properties"] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Listings",
			title: "On the ground",
			description: "Maitama to Life Camp. Open a card to amend price, status or the brief.",
			actions: isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setEditing(null);
					setOpen(true);
				},
				children: "Add listing"
			}) : null
		}),
		properties.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 rounded-xl" }, i))
		}) : (properties.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			title: "No listings yet",
			hint: "Add a house, plot or plaza to start taking offers."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
			children: (properties.data ?? []).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "cursor-pointer",
				onClick: () => {
					if (!isAdmin) return;
					setEditing(p);
					setOpen(true);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-medium tracking-tight",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { value: p.status })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted-foreground",
							children: [
								p.district,
								" · ",
								p.address
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm",
							children: [
								p.type,
								p.bedrooms ? ` · ${p.bedrooms} bed` : "",
								p.bathrooms ? ` · ${p.bathrooms} bath` : "",
								p.sizeSqm ? ` · ${p.sizeSqm} m²` : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl font-medium tabular-nums",
							children: formatNgn(p.priceNgn)
						}),
						p.description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: p.description
						}) : null
					]
				})
			}, p.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PropertyDialog, {
			open,
			onOpenChange: setOpen,
			editing,
			busy: save.isPending,
			onSave: (data) => save.mutate(data)
		})
	] });
}
function PropertyDialog({ open, onOpenChange, editing, busy, onSave }) {
	const [district, setDistrict] = (0, import_react.useState)("Maitama");
	const [type, setType] = (0, import_react.useState)("Duplex");
	const [status, setStatus] = (0, import_react.useState)("available");
	(0, import_react.useEffect)(() => {
		if (!open) return;
		setDistrict(editing?.district ?? "Maitama");
		setType(editing?.type ?? "Duplex");
		setStatus(editing?.status ?? "available");
	}, [open, editing]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "max-h-[90svh] overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					const fd = new FormData(e.currentTarget);
					onSave({
						id: editing?.id,
						title: String(fd.get("title")),
						district,
						address: String(fd.get("address")),
						type,
						status,
						bedrooms: fd.get("bedrooms") ? Number(fd.get("bedrooms")) : null,
						bathrooms: fd.get("bathrooms") ? Number(fd.get("bathrooms")) : null,
						sizeSqm: fd.get("sizeSqm") ? Number(fd.get("sizeSqm")) : null,
						priceNgn: Number(fd.get("priceNgn")),
						description: String(fd.get("description") || "")
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit listing" : "New listing" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "title",
							children: "Title"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "title",
							name: "title",
							defaultValue: editing?.title,
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "address",
							children: "Address"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "address",
							name: "address",
							defaultValue: editing?.address,
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "District" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: district,
									onValueChange: setDistrict,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DISTRICTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: d,
										children: d
									}, d)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Type" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: type,
									onValueChange: setType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PROPERTY_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t,
										children: t
									}, t)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: status,
									onValueChange: setStatus,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PROPERTY_STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: s,
										children: s
									}, s)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "priceNgn",
									children: "Price (₦)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "priceNgn",
									name: "priceNgn",
									type: "number",
									defaultValue: editing?.priceNgn ?? 0,
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "bedrooms",
									children: "Beds"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "bedrooms",
									name: "bedrooms",
									type: "number",
									defaultValue: editing?.bedrooms ?? ""
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "bathrooms",
									children: "Baths"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "bathrooms",
									name: "bathrooms",
									type: "number",
									defaultValue: editing?.bathrooms ?? ""
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sizeSqm",
									children: "Size (m²)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "sizeSqm",
									name: "sizeSqm",
									type: "number",
									defaultValue: editing?.sizeSqm ?? ""
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "description",
							children: "Brief"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "description",
							name: "description",
							defaultValue: editing?.description ?? ""
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: busy,
						children: "Save"
					}) })
				]
			}, editing?.id ?? "new")
		})
	});
}
//#endregion
export { PropertiesPage as component };
