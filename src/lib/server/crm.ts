import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { Client, Deal, Payment, Property } from "@/lib/types";
import { assertAdmin, dateStr, num, resolveAccess, tsStr } from "./access";

export const listClients = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      full_name: string;
      email: string | null;
      phone: string;
      type: string;
      stage: string;
      source: string | null;
      assigned_staff_id: number | null;
      assigned_staff_name: string | null;
      notes: string | null;
      created_at: unknown;
    }>`
      select c.id, c.full_name, c.email, c.phone, c.type, c.stage, c.source,
             c.assigned_staff_id, s.full_name as assigned_staff_name, c.notes, c.created_at
      from clients c
      left join staff s on s.id = c.assigned_staff_id
      where c.user_id = ${access.ownerId}
        and (${access.role === "admin"} or c.assigned_staff_id = ${access.staffId ?? 0})
      order by c.created_at desc
    `;
    return rows.map(
      (c): Client => ({
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
        createdAt: tsStr(c.created_at) ?? "",
      }),
    );
  });

export const upsertClient = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    fullName: string;
    email?: string;
    phone: string;
    type: string;
    stage: string;
    source?: string;
    assignedStaffId?: number | null;
    notes?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const name = data.fullName.trim();
    if (!name || !data.phone.trim()) throw new Error("Name and phone are required.");
    const assigned =
      access.role === "admin" ? (data.assignedStaffId ?? access.staffId) : access.staffId;
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
    const inserted = await sql<{ id: number }>`
      insert into clients (user_id, full_name, email, phone, type, stage, source, assigned_staff_id, notes)
      values (
        ${access.ownerId}, ${name}, ${data.email?.trim() || null}, ${data.phone.trim()},
        ${data.type}, ${data.stage}, ${data.source ?? null}, ${assigned ?? null}, ${data.notes ?? null}
      ) returning id
    `;
    return { id: inserted[0]!.id };
  });

export const listProperties = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      title: string;
      district: string;
      address: string;
      type: string;
      status: string;
      bedrooms: number | null;
      bathrooms: number | null;
      size_sqm: number | null;
      price_ngn: unknown;
      description: string | null;
    }>`
      select id, title, district, address, type, status, bedrooms, bathrooms, size_sqm, price_ngn, description
      from properties where user_id = ${access.ownerId}
      order by case status when 'available' then 0 when 'reserved' then 1 when 'let' then 2 else 3 end, title
    `;
    return rows.map(
      (p): Property => ({
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
        description: p.description,
      }),
    );
  });

export const upsertProperty = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    title: string;
    district: string;
    address: string;
    type: string;
    status: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    sizeSqm?: number | null;
    priceNgn: number;
    description?: string;
  }) => input)
  .handler(async ({ context, data }) => {
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
    const inserted = await sql<{ id: number }>`
      insert into properties (
        user_id, title, district, address, type, status, bedrooms, bathrooms, size_sqm, price_ngn, description
      ) values (
        ${access.ownerId}, ${title}, ${data.district}, ${data.address.trim()}, ${data.type}, ${data.status},
        ${data.bedrooms ?? null}, ${data.bathrooms ?? null}, ${data.sizeSqm ?? null},
        ${Math.round(data.priceNgn)}, ${data.description ?? null}
      ) returning id
    `;
    return { id: inserted[0]!.id };
  });

export const listDeals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      reference: string;
      client_id: number;
      client_name: string;
      property_id: number;
      property_title: string;
      property_address: string;
      staff_id: number | null;
      staff_name: string | null;
      kind: string;
      offer_ngn: unknown;
      status: string;
      payment_plan: string | null;
      issued_at: unknown;
      notes: string | null;
      paid_ngn: unknown;
    }>`
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
    `;
    return rows.map(
      (d): Deal => ({
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
        paidNgn: num(d.paid_ngn),
      }),
    );
  });

export const upsertDeal = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    id?: number;
    clientId: number;
    propertyId: number;
    staffId?: number | null;
    kind: string;
    offerNgn: number;
    status: string;
    paymentPlan?: string;
    issuedAt?: string | null;
    notes?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const staffId = access.role === "admin" ? (data.staffId ?? access.staffId) : access.staffId;
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
    const count = await sql<{ n: number }>`
      select count(*)::int as n from deals where user_id = ${access.ownerId}
    `;
    const n = (count[0]?.n ?? 0) + 1;
    const prefix = data.kind === "lease" ? "AT-LEA" : "AT-SAL";
    const year = new Date().getFullYear();
    const reference = `${prefix}-${year}-${String(n).padStart(3, "0")}`;
    const inserted = await sql<{ id: number }>`
      insert into deals (
        user_id, reference, client_id, property_id, staff_id, kind, offer_ngn, status, payment_plan, issued_at, notes
      ) values (
        ${access.ownerId}, ${reference}, ${data.clientId}, ${data.propertyId}, ${staffId ?? null},
        ${data.kind}, ${Math.round(data.offerNgn)}, ${data.status}, ${data.paymentPlan ?? null},
        ${data.issuedAt ?? null}, ${data.notes ?? null}
      ) returning id
    `;
    return { id: inserted[0]!.id, reference };
  });

export const getDeal = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      reference: string;
      client_id: number;
      client_name: string;
      client_phone: string;
      client_email: string | null;
      property_id: number;
      property_title: string;
      property_address: string;
      property_district: string;
      staff_id: number | null;
      staff_name: string | null;
      kind: string;
      offer_ngn: unknown;
      status: string;
      payment_plan: string | null;
      issued_at: unknown;
      notes: string | null;
      paid_ngn: unknown;
    }>`
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
    `;
    const d = rows[0];
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
      workspace: access.workspace,
    };
  });

export const listPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      receipt_no: string;
      deal_id: number | null;
      deal_reference: string | null;
      client_id: number;
      client_name: string;
      amount_ngn: unknown;
      method: string;
      paid_at: unknown;
      narration: string | null;
    }>`
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
    `;
    return rows.map(
      (p): Payment => ({
        id: p.id,
        receiptNo: p.receipt_no,
        dealId: p.deal_id,
        dealReference: p.deal_reference,
        clientId: p.client_id,
        clientName: p.client_name,
        amountNgn: num(p.amount_ngn),
        method: p.method,
        paidAt: dateStr(p.paid_at),
        narration: p.narration,
      }),
    );
  });

export const createPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: {
    clientId: number;
    dealId?: number | null;
    amountNgn: number;
    method: string;
    paidAt: string;
    narration?: string;
  }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    if (access.role !== "admin") {
      throw new Error("Only the operations desk can issue receipts.");
    }
    const sql = await getSql();
    const count = await sql<{ n: number }>`
      select coalesce(max(nullif(substring(receipt_no from '[0-9]+$'), '')::int), 0)::int as n
      from payments where user_id = ${access.ownerId}
    `;
    const year = new Date().getFullYear();
    const receiptNo = `AT-RCP-${year}-${String((count[0]?.n ?? 0) + 1).padStart(3, "0")}`;
    const inserted = await sql<{ id: number }>`
      insert into payments (user_id, receipt_no, deal_id, client_id, amount_ngn, method, paid_at, narration)
      values (
        ${access.ownerId}, ${receiptNo}, ${data.dealId ?? null}, ${data.clientId},
        ${Math.round(data.amountNgn)}, ${data.method}, ${data.paidAt}::date, ${data.narration ?? null}
      ) returning id
    `;
    return { id: inserted[0]!.id, receiptNo };
  });

export const getPayment = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: { id: number }) => input)
  .handler(async ({ context, data }) => {
    const access = await resolveAccess(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: number;
      receipt_no: string;
      deal_id: number | null;
      deal_reference: string | null;
      property_title: string | null;
      client_id: number;
      client_name: string;
      client_phone: string;
      amount_ngn: unknown;
      method: string;
      paid_at: unknown;
      narration: string | null;
    }>`
      select p.id, p.receipt_no, p.deal_id, d.reference as deal_reference, pr.title as property_title,
             p.client_id, c.full_name as client_name, c.phone as client_phone,
             p.amount_ngn, p.method, p.paid_at, p.narration
      from payments p
      join clients c on c.id = p.client_id
      left join deals d on d.id = p.deal_id
      left join properties pr on pr.id = d.property_id
      where p.id = ${data.id} and p.user_id = ${access.ownerId}
    `;
    const p = rows[0];
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
      workspace: access.workspace,
    };
  });
