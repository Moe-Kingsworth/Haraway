//#region node_modules/.nitro/vite/services/ssr/assets/constants-Dvnu62zU.js
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
	"Executive",
	"Sales",
	"Legal",
	"Finance",
	"Operations",
	"HR"
];
var ROLES = [
	"super_admin",
	"executive",
	"hr_admin",
	"finance",
	"team_lead",
	"secretary",
	"staff"
];
var ADMIN_ROLES = [
	"super_admin",
	"executive",
	"hr_admin",
	"finance",
	"team_lead",
	"secretary"
];
function isAdmin(role) {
	return ADMIN_ROLES.includes(role);
}
function roleLabel(role) {
	return {
		super_admin: "Super Admin",
		executive: "Executive",
		hr_admin: "HR/Admin",
		finance: "Finance",
		team_lead: "Team Lead",
		secretary: "Secretary",
		staff: "Staff"
	}[role];
}
function getRoleLandingPath(role) {
	switch (role) {
		case "secretary": return "/attendance";
		case "staff": return "/desk";
		default: return "/";
	}
}
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
export { TASK_STATUSES as _, DEAL_KINDS as a, isAdmin as b, DISTRICTS as c, PAYMENT_PLANS as d, PROPERTY_STATUSES as f, TASK_PRIORITIES as g, STAFF_STATUSES as h, CLIENT_TYPES as i, LEAVE_TYPES as l, ROLES as m, CLIENT_STAGES as n, DEAL_STATUSES as o, PROPERTY_TYPES as p, CLIENT_STAGE_LABELS as r, DEPARTMENTS as s, BANKS as t, PAYMENT_METHODS as u, avatarTone as v, roleLabel as x, getRoleLandingPath as y };
