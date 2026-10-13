//#region node_modules/.nitro/vite/services/ssr/assets/format-DRMnNg8r.js
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
export { formatTimeWAT as a, monthLabel as c, formatNgnCompact as i, nairaToWords as l, formatDate as n, initials as o, formatNgn as r, isWeekend as s, asNumber as t, todayWAT as u };
