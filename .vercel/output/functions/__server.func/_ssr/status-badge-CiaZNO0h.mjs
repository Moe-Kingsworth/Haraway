import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Badge } from "./app-shell-C3mSjfCF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/status-badge-CiaZNO0h.js
var import_jsx_runtime = require_jsx_runtime();
var MAP = {
	active: {
		label: "Active",
		variant: "success"
	},
	on_leave: {
		label: "On leave",
		variant: "warning"
	},
	exited: {
		label: "Exited",
		variant: "muted"
	},
	present: {
		label: "Present",
		variant: "success"
	},
	late: {
		label: "Late",
		variant: "warning"
	},
	absent: {
		label: "Absent",
		variant: "danger"
	},
	leave: {
		label: "Leave",
		variant: "secondary"
	},
	remote: {
		label: "Remote",
		variant: "outline"
	},
	pending: {
		label: "Pending",
		variant: "warning"
	},
	approved: {
		label: "Approved",
		variant: "success"
	},
	declined: {
		label: "Declined",
		variant: "danger"
	},
	paid: {
		label: "Paid",
		variant: "success"
	},
	processed: {
		label: "Processed",
		variant: "success"
	},
	draft: {
		label: "Draft",
		variant: "muted"
	},
	todo: {
		label: "To do",
		variant: "muted"
	},
	doing: {
		label: "In hand",
		variant: "warning"
	},
	done: {
		label: "Done",
		variant: "success"
	},
	blocked: {
		label: "Blocked",
		variant: "danger"
	},
	high: {
		label: "High",
		variant: "danger"
	},
	medium: {
		label: "Medium",
		variant: "warning"
	},
	low: {
		label: "Low",
		variant: "muted"
	},
	available: {
		label: "Available",
		variant: "success"
	},
	reserved: {
		label: "Reserved",
		variant: "warning"
	},
	sold: {
		label: "Sold",
		variant: "muted"
	},
	let: {
		label: "Let",
		variant: "secondary"
	},
	lead: {
		label: "Lead",
		variant: "muted"
	},
	viewing: {
		label: "Viewing",
		variant: "outline"
	},
	offer: {
		label: "Offer",
		variant: "warning"
	},
	due_diligence: {
		label: "Search",
		variant: "warning"
	},
	closed: {
		label: "Closed",
		variant: "success"
	},
	lost: {
		label: "Lost",
		variant: "danger"
	},
	issued: {
		label: "Issued",
		variant: "outline"
	},
	accepted: {
		label: "Accepted",
		variant: "success"
	},
	completed: {
		label: "Completed",
		variant: "success"
	},
	cancelled: {
		label: "Cancelled",
		variant: "muted"
	},
	buyer: {
		label: "Buyer",
		variant: "secondary"
	},
	seller: {
		label: "Seller",
		variant: "secondary"
	},
	tenant: {
		label: "Tenant",
		variant: "secondary"
	},
	landlord: {
		label: "Landlord",
		variant: "secondary"
	},
	investor: {
		label: "Investor",
		variant: "secondary"
	},
	sale: {
		label: "Sale",
		variant: "outline"
	},
	lease: {
		label: "Lease",
		variant: "outline"
	},
	transfer: {
		label: "Transfer",
		variant: "outline"
	},
	cash: {
		label: "Cash",
		variant: "outline"
	},
	cheque: {
		label: "Cheque",
		variant: "outline"
	},
	pos: {
		label: "POS",
		variant: "outline"
	},
	admin: {
		label: "Desk",
		variant: "default"
	},
	staff: {
		label: "Team",
		variant: "secondary"
	}
};
function StatusBadge({ value }) {
	const entry = MAP[value] ?? {
		label: value.replaceAll("_", " "),
		variant: "muted"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: entry.variant,
		children: entry.label
	});
}
//#endregion
export { StatusBadge as t };
