//#region node_modules/.nitro/vite/services/ssr/assets/constants-C6wSzqdU.js
var DISTRICTS = [
	"Maitama",
	"Asokoro",
	"Wuse II",
	"Jabi",
	"Guzape",
	"Katampe Extension",
	"Life Camp",
	"Jahi",
	"Gwarinpa",
	"Wuye",
	"Central Business District",
	"Garki",
	"Utako",
	"Apo"
];
var PROPERTY_TYPES = [
	"Mansion",
	"Duplex",
	"Terrace",
	"Apartment",
	"Penthouse",
	"Plot",
	"Commercial"
];
var PROPERTY_STATUSES = [
	"available",
	"reserved",
	"sold",
	"let"
];
var CLIENT_TYPES = [
	"buyer",
	"seller",
	"tenant",
	"landlord",
	"investor"
];
var CLIENT_STAGES = [
	"lead",
	"viewing",
	"offer",
	"due_diligence",
	"closed",
	"lost"
];
var CLIENT_STAGE_LABELS = {
	lead: "Lead",
	viewing: "Viewing",
	offer: "Offer",
	due_diligence: "Search",
	closed: "Closed",
	lost: "Lost"
};
var DEPARTMENTS = [
	"Leadership",
	"Sales",
	"Legal",
	"Finance",
	"Operations"
];
var STAFF_STATUSES = [
	"active",
	"on_leave",
	"exited"
];
var TASK_STATUSES = [
	"todo",
	"doing",
	"done",
	"blocked"
];
var TASK_PRIORITIES = [
	"low",
	"medium",
	"high"
];
var LEAVE_TYPES = [
	"annual",
	"sick",
	"casual",
	"unpaid"
];
var PAYMENT_METHODS = [
	"transfer",
	"cash",
	"cheque",
	"pos"
];
var DEAL_KINDS = ["sale", "lease"];
var DEAL_STATUSES = [
	"draft",
	"issued",
	"accepted",
	"completed",
	"cancelled"
];
var PAYMENT_PLANS = [
	"outright",
	"mortgage",
	"instalment"
];
var BANKS = [
	"GTBank",
	"Access Bank",
	"Zenith Bank",
	"UBA",
	"First Bank",
	"Stanbic IBTC"
];
var AVATAR_TONES = [
	"bg-primary text-primary-foreground",
	"bg-accent text-accent-foreground",
	"bg-foreground text-background",
	"bg-muted-foreground text-background",
	"bg-sidebar text-sidebar-foreground"
];
function avatarTone(id) {
	return AVATAR_TONES[Math.abs(id) % AVATAR_TONES.length] ?? AVATAR_TONES[0];
}
//#endregion
export { avatarTone as _, DEAL_KINDS as a, DISTRICTS as c, PAYMENT_PLANS as d, PROPERTY_STATUSES as f, TASK_STATUSES as g, TASK_PRIORITIES as h, CLIENT_TYPES as i, LEAVE_TYPES as l, STAFF_STATUSES as m, CLIENT_STAGES as n, DEAL_STATUSES as o, PROPERTY_TYPES as p, CLIENT_STAGE_LABELS as r, DEPARTMENTS as s, BANKS as t, PAYMENT_METHODS as u };
