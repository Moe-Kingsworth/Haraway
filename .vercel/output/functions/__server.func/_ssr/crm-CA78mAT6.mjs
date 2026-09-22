import { r as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { r as getSql } from "./db-DamQGqw7.mjs";
import { n as authMiddleware } from "./format-Tz25-cit.mjs";
import { a as num, n as dateStr, o as resolveAccess, s as tsStr, t as assertAdmin } from "./access-BBPyLmQY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-CA78mAT6.js
var listClients_createServerFn_handler = createServerRpc({
	id: "c1db5569404235c31597f22f3305a9d5227aef7a96072cb9cbc23397ff1af32e",
	name: "listClients",
	filename: "src/lib/server/crm.ts"
}, (opts) => listClients.__executeServer(opts));
var listClients = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listClients_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select c.id, c.full_name, c.email, c.phone, c.type, c.stage, c.source,
             c.assigned_staff_id, s.full_name as assigned_staff_name, c.notes, c.created_at
      from clients c
      left join staff s on s.id = c.assigned_staff_id
      where c.user_id = ${access.ownerId}
        and (${access.role === "admin"} or c.assigned_staff_id = ${access.staffId ?? 0})
      order by c.created_at desc
    `).map((c) => ({
		id: c.id,
		fullName: c.full_name,
		email: c.email,
		phone: c.phone,
		type: c.type,
		stage: c.stage,
		source: c.source,
		assignedStaffId: c.assigned_staff_id,
		assignedStaffName: c.assigned_staff_name,
		notes: c.notes,
		createdAt: tsStr(c.created_at) ?? ""
	}));
});
var upsertClient_createServerFn_handler = createServerRpc({
	id: "05ab7cbfc47bd5fbf8fe3beeafdffdeb8c9a5da55ec6c0ae60e150d8f643ce75",
	name: "upsertClient",
	filename: "src/lib/server/crm.ts"
}, (opts) => upsertClient.__executeServer(opts));
var upsertClient = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertClient_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	const sql = await getSql();
	const name = data.fullName.trim();
	if (!name || !data.phone.trim()) throw new Error("Name and phone are required.");
	const assigned = access.role === "admin" ? data.assignedStaffId ?? access.staffId : access.staffId;
	if (data.id) {
		await sql`
        update clients set
          full_name = ${name}, email = ${data.email?.trim() || null}, phone = ${data.phone.trim()},
          type = ${data.type}, stage = ${data.stage}, source = ${data.source ?? null},
          assigned_staff_id = ${assigned ?? null}, notes = ${data.notes ?? null}
        where id = ${data.id} and user_id = ${access.ownerId}
          and (${access.role === "admin"} or assigned_staff_id = ${access.staffId ?? 0})
      `;
		return { id: data.id };
	}
	return { id: (await sql`
      insert into clients (user_id, full_name, email, phone, type, stage, source, assigned_staff_id, notes)
      values (
        ${access.ownerId}, ${name}, ${data.email?.trim() || null}, ${data.phone.trim()},
        ${data.type}, ${data.stage}, ${data.source ?? null}, ${assigned ?? null}, ${data.notes ?? null}
      ) returning id
    `)[0].id };
});
var listProperties_createServerFn_handler = createServerRpc({
	id: "f33bbc0e040b4db94f74c4a6ed712eedc1d5b4cd350b1cf7eacdf664f59a5aa5",
	name: "listProperties",
	filename: "src/lib/server/crm.ts"
}, (opts) => listProperties.__executeServer(opts));
var listProperties = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProperties_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select id, title, district, address, type, status, bedrooms, bathrooms, size_sqm, price_ngn, description
      from properties where user_id = ${access.ownerId}
      order by case status when 'available' then 0 when 'reserved' then 1 when 'let' then 2 else 3 end, title
    `).map((p) => ({
		id: p.id,
		title: p.title,
		district: p.district,
		address: p.address,
		type: p.type,
		status: p.status,
		bedrooms: p.bedrooms,
		bathrooms: p.bathrooms,
		sizeSqm: p.size_sqm,
		priceNgn: num(p.price_ngn),
		description: p.description
	}));
});
var upsertProperty_createServerFn_handler = createServerRpc({
	id: "d6fabe816eb76beb35beaeb5ab9838e9a8da2b6e30092bc8c32f1514d20098b4",
	name: "upsertProperty",
	filename: "src/lib/server/crm.ts"
}, (opts) => upsertProperty.__executeServer(opts));
var upsertProperty = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertProperty_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	assertAdmin(access);
	const sql = await getSql();
	const title = data.title.trim();
	if (!title) throw new Error("Title is required.");
	if (data.id) {
		await sql`
        update properties set
          title = ${title}, district = ${data.district}, address = ${data.address.trim()},
          type = ${data.type}, status = ${data.status}, bedrooms = ${data.bedrooms ?? null},
          bathrooms = ${data.bathrooms ?? null}, size_sqm = ${data.sizeSqm ?? null},
          price_ngn = ${Math.round(data.priceNgn)}, description = ${data.description ?? null}
        where id = ${data.id} and user_id = ${access.ownerId}
      `;
		return { id: data.id };
	}
	return { id: (await sql`
      insert into properties (
        user_id, title, district, address, type, status, bedrooms, bathrooms, size_sqm, price_ngn, description
      ) values (
        ${access.ownerId}, ${title}, ${data.district}, ${data.address.trim()}, ${data.type}, ${data.status},
        ${data.bedrooms ?? null}, ${data.bathrooms ?? null}, ${data.sizeSqm ?? null},
        ${Math.round(data.priceNgn)}, ${data.description ?? null}
      ) returning id
    `)[0].id };
});
var listDeals_createServerFn_handler = createServerRpc({
	id: "0bde0df726b74971aa81916f53deb79a915b1b63f391aa282a18aac03a2bd85a",
	name: "listDeals",
	filename: "src/lib/server/crm.ts"
}, (opts) => listDeals.__executeServer(opts));
var listDeals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listDeals_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select d.id, d.reference, d.client_id, c.full_name as client_name,
             d.property_id, p.title as property_title, p.address as property_address,
             d.staff_id, s.full_name as staff_name, d.kind, d.offer_ngn, d.status,
             d.payment_plan, d.issued_at, d.notes,
             coalesce((select sum(amount_ngn) from payments pay where pay.deal_id = d.id), 0) as paid_ngn
      from deals d
      join clients c on c.id = d.client_id
      join properties p on p.id = d.property_id
      left join staff s on s.id = d.staff_id
      where d.user_id = ${access.ownerId}
        and (${access.role === "admin"} or d.staff_id = ${access.staffId ?? 0})
      order by d.created_at desc
    `).map((d) => ({
		id: d.id,
		reference: d.reference,
		clientId: d.client_id,
		clientName: d.client_name,
		propertyId: d.property_id,
		propertyTitle: d.property_title,
		propertyAddress: d.property_address,
		staffId: d.staff_id,
		staffName: d.staff_name,
		kind: d.kind,
		offerNgn: num(d.offer_ngn),
		status: d.status,
		paymentPlan: d.payment_plan,
		issuedAt: d.issued_at ? dateStr(d.issued_at) : null,
		notes: d.notes,
		paidNgn: num(d.paid_ngn)
	}));
});
var upsertDeal_createServerFn_handler = createServerRpc({
	id: "0a0c878cfed22eb620cafc695fe65d67699f879d18bc5a69e0d05b9cc1d8fe40",
	name: "upsertDeal",
	filename: "src/lib/server/crm.ts"
}, (opts) => upsertDeal.__executeServer(opts));
var upsertDeal = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(upsertDeal_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	const sql = await getSql();
	const staffId = access.role === "admin" ? data.staffId ?? access.staffId : access.staffId;
	if (data.id) {
		await sql`
        update deals set
          client_id = ${data.clientId}, property_id = ${data.propertyId}, staff_id = ${staffId ?? null},
          kind = ${data.kind}, offer_ngn = ${Math.round(data.offerNgn)}, status = ${data.status},
          payment_plan = ${data.paymentPlan ?? null}, issued_at = ${data.issuedAt ?? null},
          notes = ${data.notes ?? null}
        where id = ${data.id} and user_id = ${access.ownerId}
          and (${access.role === "admin"} or staff_id = ${access.staffId ?? 0})
      `;
		return { id: data.id };
	}
	const n = ((await sql`
      select count(*)::int as n from deals where user_id = ${access.ownerId}
    `)[0]?.n ?? 0) + 1;
	const reference = `${data.kind === "lease" ? "AT-LEA" : "AT-SAL"}-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(n).padStart(3, "0")}`;
	return {
		id: (await sql`
      insert into deals (
        user_id, reference, client_id, property_id, staff_id, kind, offer_ngn, status, payment_plan, issued_at, notes
      ) values (
        ${access.ownerId}, ${reference}, ${data.clientId}, ${data.propertyId}, ${staffId ?? null},
        ${data.kind}, ${Math.round(data.offerNgn)}, ${data.status}, ${data.paymentPlan ?? null},
        ${data.issuedAt ?? null}, ${data.notes ?? null}
      ) returning id
    `)[0].id,
		reference
	};
});
var getDeal_createServerFn_handler = createServerRpc({
	id: "e2babbf7e7c833fff08a5df87db098ff2fc81e42c4fc82c41859bc2ca7444cab",
	name: "getDeal",
	filename: "src/lib/server/crm.ts"
}, (opts) => getDeal.__executeServer(opts));
var getDeal = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getDeal_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	const d = (await (await getSql())`
      select d.id, d.reference, d.client_id, c.full_name as client_name, c.phone as client_phone, c.email as client_email,
             d.property_id, p.title as property_title, p.address as property_address, p.district as property_district,
             d.staff_id, s.full_name as staff_name, d.kind, d.offer_ngn, d.status, d.payment_plan, d.issued_at, d.notes,
             coalesce((select sum(amount_ngn) from payments pay where pay.deal_id = d.id), 0) as paid_ngn
      from deals d
      join clients c on c.id = d.client_id
      join properties p on p.id = d.property_id
      left join staff s on s.id = d.staff_id
      where d.id = ${data.id} and d.user_id = ${access.ownerId}
        and (${access.role === "admin"} or d.staff_id = ${access.staffId ?? 0})
    `)[0];
	if (!d) throw new Error("Purchase form not found.");
	return {
		id: d.id,
		reference: d.reference,
		clientId: d.client_id,
		clientName: d.client_name,
		clientPhone: d.client_phone,
		clientEmail: d.client_email,
		propertyId: d.property_id,
		propertyTitle: d.property_title,
		propertyAddress: d.property_address,
		propertyDistrict: d.property_district,
		staffId: d.staff_id,
		staffName: d.staff_name,
		kind: d.kind,
		offerNgn: num(d.offer_ngn),
		status: d.status,
		paymentPlan: d.payment_plan,
		issuedAt: d.issued_at ? dateStr(d.issued_at) : null,
		notes: d.notes,
		paidNgn: num(d.paid_ngn),
		workspace: access.workspace
	};
});
var listPayments_createServerFn_handler = createServerRpc({
	id: "d43827848ef3f91cac3c8d697ec73856ec25fcda2175ef55bfbf9e59293e145c",
	name: "listPayments",
	filename: "src/lib/server/crm.ts"
}, (opts) => listPayments.__executeServer(opts));
var listPayments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listPayments_createServerFn_handler, async ({ context }) => {
	const access = await resolveAccess(context.userId);
	return (await (await getSql())`
      select p.id, p.receipt_no, p.deal_id, d.reference as deal_reference, p.client_id,
             c.full_name as client_name, p.amount_ngn, p.method, p.paid_at, p.narration
      from payments p
      join clients c on c.id = p.client_id
      left join deals d on d.id = p.deal_id
      where p.user_id = ${access.ownerId}
        and (${access.role === "admin"} or exists (
          select 1 from clients cx where cx.id = p.client_id and cx.assigned_staff_id = ${access.staffId ?? 0}
        ))
      order by p.paid_at desc, p.id desc
    `).map((p) => ({
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
	}));
});
var createPayment_createServerFn_handler = createServerRpc({
	id: "e7ff071f407541e41e51ee0361709f911fee9a19b9248a7798abf129ac7b4181",
	name: "createPayment",
	filename: "src/lib/server/crm.ts"
}, (opts) => createPayment.__executeServer(opts));
var createPayment = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createPayment_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	if (access.role !== "admin") throw new Error("Only the operations desk can issue receipts.");
	const sql = await getSql();
	const count = await sql`
      select coalesce(max(nullif(substring(receipt_no from '[0-9]+$'), '')::int), 0)::int as n
      from payments where user_id = ${access.ownerId}
    `;
	const receiptNo = `AT-RCP-${(/* @__PURE__ */ new Date()).getFullYear()}-${String((count[0]?.n ?? 0) + 1).padStart(3, "0")}`;
	return {
		id: (await sql`
      insert into payments (user_id, receipt_no, deal_id, client_id, amount_ngn, method, paid_at, narration)
      values (
        ${access.ownerId}, ${receiptNo}, ${data.dealId ?? null}, ${data.clientId},
        ${Math.round(data.amountNgn)}, ${data.method}, ${data.paidAt}::date, ${data.narration ?? null}
      ) returning id
    `)[0].id,
		receiptNo
	};
});
var getPayment_createServerFn_handler = createServerRpc({
	id: "c27d4c67d9b551e7e3d17f895bf95e93275622be48906b0306d07881fa94e5a6",
	name: "getPayment",
	filename: "src/lib/server/crm.ts"
}, (opts) => getPayment.__executeServer(opts));
var getPayment = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(getPayment_createServerFn_handler, async ({ context, data }) => {
	const access = await resolveAccess(context.userId);
	const p = (await (await getSql())`
      select p.id, p.receipt_no, p.deal_id, d.reference as deal_reference, pr.title as property_title,
             p.client_id, c.full_name as client_name, c.phone as client_phone,
             p.amount_ngn, p.method, p.paid_at, p.narration
      from payments p
      join clients c on c.id = p.client_id
      left join deals d on d.id = p.deal_id
      left join properties pr on pr.id = d.property_id
      where p.id = ${data.id} and p.user_id = ${access.ownerId}
    `)[0];
	if (!p) throw new Error("Receipt not found.");
	return {
		id: p.id,
		receiptNo: p.receipt_no,
		dealId: p.deal_id,
		dealReference: p.deal_reference,
		propertyTitle: p.property_title,
		clientId: p.client_id,
		clientName: p.client_name,
		clientPhone: p.client_phone,
		amountNgn: num(p.amount_ngn),
		method: p.method,
		paidAt: dateStr(p.paid_at),
		narration: p.narration,
		workspace: access.workspace
	};
});
//#endregion
export { createPayment_createServerFn_handler, getDeal_createServerFn_handler, getPayment_createServerFn_handler, listClients_createServerFn_handler, listDeals_createServerFn_handler, listPayments_createServerFn_handler, listProperties_createServerFn_handler, upsertClient_createServerFn_handler, upsertDeal_createServerFn_handler, upsertProperty_createServerFn_handler };
