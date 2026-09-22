import { n as createMiddleware } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-Tz25-cit.js
/**
* Auth middleware for server functions — the standard way to get the caller's
* verified user id. When deployed the session cookie is same-origin and rides
* along automatically. In the live preview the client also forwards the bearer
* token (partitioned cookies) via the `.client` hook below — call sites do not
* thread it themselves.
*
*   import { createServerFn } from "@tanstack/react-start";
*   import { getSql } from "@/lib/db";
*   import { authMiddleware } from "@/lib/auth/middleware";
*
*   export const listTodos = createServerFn({ method: "GET" })
*     .middleware([authMiddleware])
*     .handler(async ({ context }) => {
*       const sql = await getSql();
*       return sql`select * from todos where user_id = ${context.userId}`;
*     });
*
* Signed out with auth on (live preview included) -> throws `UnauthorizedError`
* (see `verify.server.ts`). With auth disabled (`VITE_AUTH_ENABLED=false`, the
* shipped default) it resolves the shared dev user — but throws instead when a
* `DATABASE_URL` is also set, so an app without sign-in must not use this at
* all. On the auth-on path, use it on every server function that touches
* per-user data and scope every query by `context.userId`.
*/
var authMiddleware = createMiddleware({ type: "function" }).client(async ({ next }) => {
	const { getBearerToken } = await import("./client-B40BzJxt.mjs").then((n) => n.n).then((n) => n.n);
	return next({ sendContext: { bearerToken: getBearerToken() ?? void 0 } });
}).server(async ({ next, context }) => {
	const { assertSameSiteRequest } = await import("./isolation.server-CGNg1r0B.mjs");
	const { requireUserId } = await import("./verify.server-Ds-UFl4P.mjs");
	assertSameSiteRequest();
	return next({ context: { userId: await requireUserId(context.bearerToken) } });
});
var NGN = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	maximumFractionDigits: 0
});
var NGN_COMPACT = new Intl.NumberFormat("en-NG", {
	style: "currency",
	currency: "NGN",
	notation: "compact",
	maximumFractionDigits: 1
});
function formatNgn(amount) {
	return NGN.format(amount);
}
function formatNgnCompact(amount) {
	return NGN_COMPACT.format(amount);
}
function todayWAT() {
	return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(/* @__PURE__ */ new Date());
}
function weekdayIndex(isoDate) {
	const [y, m, day] = isoDate.split("-").map(Number);
	if (!y || !m || !day) return 0;
	return new Date(Date.UTC(y, m - 1, day)).getUTCDay();
}
function isWeekend(isoDate) {
	const d = weekdayIndex(isoDate);
	return d === 0 || d === 6;
}
function formatDate(iso) {
	if (!iso) return "—";
	const [y, m, day] = iso.slice(0, 10).split("-").map(Number);
	if (!y || !m || !day) return iso;
	return new Intl.DateTimeFormat("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	}).format(new Date(Date.UTC(y, m - 1, day)));
}
function formatTimeWAT(iso) {
	if (!iso) return "—";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "—";
	return new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: false,
		timeZone: "Africa/Lagos"
	}).format(d);
}
function monthLabel(year, month) {
	return new Intl.DateTimeFormat("en-GB", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(new Date(Date.UTC(year, month - 1, 1)));
}
var ONES = [
	"",
	"One",
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Eleven",
	"Twelve",
	"Thirteen",
	"Fourteen",
	"Fifteen",
	"Sixteen",
	"Seventeen",
	"Eighteen",
	"Nineteen"
];
var TENS = [
	"",
	"",
	"Twenty",
	"Thirty",
	"Forty",
	"Fifty",
	"Sixty",
	"Seventy",
	"Eighty",
	"Ninety"
];
function chunkToWords(n) {
	if (n === 0) return "";
	if (n < 20) return ONES[n] ?? "";
	if (n < 100) {
		const rest = n % 10;
		return `${TENS[Math.floor(n / 10)]}${rest ? `-${ONES[rest]}` : ""}`;
	}
	const rest = n % 100;
	return `${ONES[Math.floor(n / 100)]} Hundred${rest ? ` and ${chunkToWords(rest)}` : ""}`;
}
function nairaToWords(amount) {
	const n = Math.round(Math.abs(amount));
	if (n === 0) return "Zero Naira Only";
	const billion = Math.floor(n / 1e9);
	const million = Math.floor(n % 1e9 / 1e6);
	const thousand = Math.floor(n % 1e6 / 1e3);
	const rest = n % 1e3;
	const parts = [];
	if (billion) parts.push(`${chunkToWords(billion)} Billion`);
	if (million) parts.push(`${chunkToWords(million)} Million`);
	if (thousand) parts.push(`${chunkToWords(thousand)} Thousand`);
	if (rest) parts.push(chunkToWords(rest));
	return `${parts.join(" ")} Naira Only`;
}
function initials(name) {
	const bits = name.trim().split(/\s+/).filter(Boolean);
	if (bits.length === 0) return "AT";
	if (bits.length === 1) return bits[0].slice(0, 2).toUpperCase();
	return `${bits[0][0] ?? ""}${bits[bits.length - 1][0] ?? ""}`.toUpperCase();
}
function asNumber(value) {
	if (typeof value === "number") return value;
	if (typeof value === "string") return Number(value);
	if (typeof value === "bigint") return Number(value);
	return 0;
}
//#endregion
export { formatNgnCompact as a, isWeekend as c, todayWAT as d, formatNgn as i, monthLabel as l, authMiddleware as n, formatTimeWAT as o, formatDate as r, initials as s, asNumber as t, nairaToWords as u };
