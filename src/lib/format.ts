const NGN = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const NGN_COMPACT = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNgn(amount: number): string {
  return NGN.format(amount);
}

export function formatNgnCompact(amount: number): string {
  return NGN_COMPACT.format(amount);
}

export function todayWAT(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Lagos" }).format(new Date());
}

export function weekdayIndex(isoDate: string): number {
  const [y, m, day] = isoDate.split("-").map(Number);
  if (!y || !m || !day) return 0;
  return new Date(Date.UTC(y, m - 1, day)).getUTCDay();
}

export function isWeekend(isoDate: string): boolean {
  const d = weekdayIndex(isoDate);
  return d === 0 || d === 6;
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = iso.slice(0, 10);
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return iso;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(y, m - 1, day)));
}

export function formatTimeWAT(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  }).format(d);
}

export function formatDateTimeWAT(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Lagos",
  }).format(d);
}

export function monthLabel(year: number, month: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

const ONES = [
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
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function chunkToWords(n: number): string {
  if (n === 0) return "";
  if (n < 20) return ONES[n] ?? "";
  if (n < 100) {
    const rest = n % 10;
    return `${TENS[Math.floor(n / 10)]}${rest ? `-${ONES[rest]}` : ""}`;
  }
  const rest = n % 100;
  return `${ONES[Math.floor(n / 100)]} Hundred${rest ? ` and ${chunkToWords(rest)}` : ""}`;
}

export function nairaToWords(amount: number): string {
  const n = Math.round(Math.abs(amount));
  if (n === 0) return "Zero Naira Only";
  const billion = Math.floor(n / 1_000_000_000);
  const million = Math.floor((n % 1_000_000_000) / 1_000_000);
  const thousand = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (billion) parts.push(`${chunkToWords(billion)} Billion`);
  if (million) parts.push(`${chunkToWords(million)} Million`);
  if (thousand) parts.push(`${chunkToWords(thousand)} Thousand`);
  if (rest) parts.push(chunkToWords(rest));
  return `${parts.join(" ")} Naira Only`;
}

export function initials(name: string): string {
  const bits = name.trim().split(/\s+/).filter(Boolean);
  if (bits.length === 0) return "AT";
  if (bits.length === 1) return bits[0]!.slice(0, 2).toUpperCase();
  return `${bits[0]![0] ?? ""}${bits[bits.length - 1]![0] ?? ""}`.toUpperCase();
}

export function asNumber(value: unknown): number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (typeof value === "bigint") return Number(value);
  return 0;
}
