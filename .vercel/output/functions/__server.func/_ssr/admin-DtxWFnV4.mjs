import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-Yj8VJyDF.mjs";
import { r as getSql } from "./db-BUKlVvsz.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DtxWFnV4.js
async function logAuditEvent(actorName, action, target, details = {}) {
	try {
		await (await getSql())`
      insert into audit_log (actor_name, action, target, timestamp, details)
      values (${actorName}, ${action}, ${target}, now(), ${JSON.stringify(details)}::jsonb)
    `;
	} catch (err) {
		console.error("[audit_log] failed to record event:", err);
	}
}
var getSuperAdminDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("b9560c25616c29988c96cc9fa2d984adcd496a36fd9751c1cca10c77098a3347"));
var listUsers = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8ff428842bb49781522d3045308fc4b9413c4565e4912c7391c8e5ad80c3b07b"));
var createUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("64ea221a9e5cb1d1cc13c71b854471ab66a2865bf645f4fa05ff165b84a8e841"));
var editUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("0c060563768423c0c20455891f0e8994b29b568a07660fc6243713ad323e34ce"));
var suspendUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("d5d56a865f6ffd5858b2087a1366d75d09971025d3a367eae997b5adab9ec704"));
var reactivateUser = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("26b3bd94bbc1be973103ac16fc68cf889a08656eace8ac04ca0c9caaf62c781e"));
var resetUserPassword = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("dcbe79a1566b9bf039eea75f955c6727d3fdc8e144f84bf2b780aec4c1d6f02b"));
var promoteSuperAdmin = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("9a69974c1232130ccbcfe37bf9e490456de619e98937fcac8bc3ed3e7bdaba37"));
var listAuditLogs = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("cefd777af2826db44231a01cba14377bee9dded3bb723f6de53499bba419454e"));
//#endregion
export { listUsers as a, reactivateUser as c, listAuditLogs as i, resetUserPassword as l, editUser as n, logAuditEvent as o, getSuperAdminDashboard as r, promoteSuperAdmin as s, createUser as t, suspendUser as u };
