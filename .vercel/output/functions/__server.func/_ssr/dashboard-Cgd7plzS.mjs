import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-DamQGqw7.mjs";
import { d as todayWAT, n as authMiddleware } from "./format-Tz25-cit.mjs";
import { a as num, n as dateStr, o as resolveAccess, s as tsStr } from "./access-BBPyLmQY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Cgd7plzS.js
var getDashboard_createServerFn_handler = createServerRpc({
	id: "9db85427a1c24a4946624e0d3df9e6cbf4f6db0a0617124b39eec33b6ee26c12",
	name: "getDashboard",
	filename: "src/lib/server/dashboard.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	const sql = await getSql();
	const ownerId = access.ownerId;
	const today = todayWAT();
	const monthStart = `${today.slice(0, 7)}-01`;
	const staffCount = await sql`
      select count(*)::int as n from staff where user_id = ${ownerId} and status = ${"active"}
    `;
	const present = await sql`
      select count(*)::int as n from attendance
      where user_id = ${ownerId} and work_date = ${today}::date
        and status in (${"present"}, ${"late"}, ${"remote"})
    `;
	const openTasks = await sql`
      select count(*)::int as n from tasks
      where user_id = ${ownerId} and status in (${"todo"}, ${"doing"}, ${"blocked"})
        and (${access.role === "admin"} or staff_id = ${access.staffId ?? 0})
    `;
	const overdue = await sql`
      select count(*)::int as n from tasks
      where user_id = ${ownerId} and status in (${"todo"}, ${"doing"}, ${"blocked"})
        and due_date < ${today}::date
        and (${access.role === "admin"} or staff_id = ${access.staffId ?? 0})
    `;
	const pipeline = await sql`
      select coalesce(sum(offer_ngn), 0) as n from deals
      where user_id = ${ownerId} and status in (${"issued"}, ${"accepted"}, ${"draft"})
    `;
	const monthReceipts = await sql`
      select coalesce(sum(amount_ngn), 0) as n from payments
      where user_id = ${ownerId} and paid_at >= ${monthStart}::date
    `;
	const pendingLeave = await sql`
      select count(*)::int as n from leave_requests
      where user_id = ${ownerId} and status = ${"pending"}
    `;
	const reserved = await sql`
      select count(*)::int as n from properties
      where user_id = ${ownerId} and status = ${"reserved"}
    `;
	const inOffice = await sql`
      select s.id, s.full_name as name, s.role, a.status, a.clock_in
      from attendance a
      join staff s on s.id = a.staff_id
      where a.user_id = ${ownerId} and a.work_date = ${today}::date
        and a.status in (${"present"}, ${"late"}, ${"remote"})
      order by a.clock_in
    `;
	const collections = await sql`
      select to_char(date_trunc('month', paid_at), 'YYYY-MM') as month,
             coalesce(sum(amount_ngn), 0) as amount
      from payments
      where user_id = ${ownerId}
      group by 1
      order by 1
    `;
	const recent = await sql`
      select p.id, p.receipt_no, p.deal_id, d.reference as deal_reference, p.client_id,
             c.full_name as client_name, p.amount_ngn, p.method, p.paid_at, p.narration
      from payments p
      join clients c on c.id = p.client_id
      left join deals d on d.id = p.deal_id
      where p.user_id = ${ownerId}
      order by p.paid_at desc, p.id desc
      limit 5
    `;
	const attention = [];
	if ((pendingLeave[0]?.n ?? 0) > 0) attention.push({
		kind: "leave",
		title: `${pendingLeave[0].n} leave request${pendingLeave[0].n === 1 ? "" : "s"} waiting`,
		href: "/attendance"
	});
	if ((overdue[0]?.n ?? 0) > 0) attention.push({
		kind: "task",
		title: `${overdue[0].n} overdue task${overdue[0].n === 1 ? "" : "s"}`,
		href: "/tasks"
	});
	if ((reserved[0]?.n ?? 0) > 0) attention.push({
		kind: "property",
		title: `${reserved[0].n} reserved listing${reserved[0].n === 1 ? "" : "s"} still open`,
		href: "/properties"
	});
	const monthNames = {
		"01": "Jan",
		"02": "Feb",
		"03": "Mar",
		"04": "Apr",
		"05": "May",
		"06": "Jun",
		"07": "Jul",
		"08": "Aug",
		"09": "Sep",
		"10": "Oct",
		"11": "Nov",
		"12": "Dec"
	};
	return {
		presentToday: present[0]?.n ?? 0,
		staffCount: staffCount[0]?.n ?? 0,
		openTasks: openTasks[0]?.n ?? 0,
		overdueTasks: overdue[0]?.n ?? 0,
		pipelineNgn: num(pipeline[0]?.n),
		monthReceiptsNgn: num(monthReceipts[0]?.n),
		pendingLeave: pendingLeave[0]?.n ?? 0,
		reservedProperties: reserved[0]?.n ?? 0,
		inOffice: inOffice.map((r) => ({
			id: r.id,
			name: r.name,
			role: r.role,
			status: r.status,
			clockIn: tsStr(r.clock_in)
		})),
		collections: collections.map((c) => ({
			month: monthNames[c.month.slice(5, 7)] ?? c.month,
			amount: num(c.amount)
		})),
		recentPayments: recent.map((p) => ({
			id: p.id,
			receiptNo: p.receipt_no,
			dealId: p.deal_id,
			dealReference: p.deal_reference,
			clientId: p.client_id,
			clientName: p.client_name,
			amountNgn: num(p.amount_ngn),
			method: p.method,
			paidAt: dateStr(p.paid_at),
			narration: p.narration
		})),
		attention
	};
});
//#endregion
export { getDashboard_createServerFn_handler };
