export const DISTRICTS = [
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
  "Apo",
] as const;

export const PROPERTY_TYPES = [
  "Mansion",
  "Duplex",
  "Terrace",
  "Apartment",
  "Penthouse",
  "Plot",
  "Commercial",
] as const;

export const PROPERTY_STATUSES = ["available", "reserved", "sold", "let"] as const;
export const CLIENT_TYPES = ["buyer", "seller", "tenant", "landlord", "investor"] as const;
export const CLIENT_STAGES = ["lead", "viewing", "offer", "due_diligence", "closed", "lost"] as const;
export const CLIENT_STAGE_LABELS: Record<(typeof CLIENT_STAGES)[number], string> = {
  lead: "Lead",
  viewing: "Viewing",
  offer: "Offer",
  due_diligence: "Search",
  closed: "Closed",
  lost: "Lost",
};
export const DEPARTMENTS = ["Leadership", "Sales", "Legal", "Finance", "Operations"] as const;
export const STAFF_STATUSES = ["active", "on_leave", "exited"] as const;
export const TASK_STATUSES = ["todo", "doing", "done", "blocked"] as const;
export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export const ATTENDANCE_STATUSES = ["present", "late", "absent", "leave", "remote"] as const;
export const LEAVE_TYPES = ["annual", "sick", "casual", "unpaid"] as const;
export const PAYMENT_METHODS = ["transfer", "cash", "cheque", "pos"] as const;
export const DEAL_KINDS = ["sale", "lease"] as const;
export const DEAL_STATUSES = ["draft", "issued", "accepted", "completed", "cancelled"] as const;
export const PAYMENT_PLANS = ["outright", "mortgage", "instalment"] as const;
export const BANKS = ["GTBank", "Access Bank", "Zenith Bank", "UBA", "First Bank", "Stanbic IBTC"] as const;

export const AVATAR_TONES = [
  "bg-primary text-primary-foreground",
  "bg-accent text-accent-foreground",
  "bg-foreground text-background",
  "bg-muted-foreground text-background",
  "bg-sidebar text-sidebar-foreground",
] as const;

export function avatarTone(id: number): string {
  return AVATAR_TONES[Math.abs(id) % AVATAR_TONES.length] ?? AVATAR_TONES[0];
}
