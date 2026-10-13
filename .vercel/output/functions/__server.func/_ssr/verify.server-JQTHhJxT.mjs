import { o as getRequest } from "./ssr.mjs";
import { n as supabaseAdmin } from "./supabase-CCDJo-Xx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/verify.server-JQTHhJxT.js
var UnauthorizedError = class extends Error {
	status = 401;
	constructor() {
		super("Unauthorized");
		this.name = "UnauthorizedError";
	}
};
/**
* Resolve the verified Supabase user from the bearer token or request Authorization header.
*/
async function getSessionUser(bearerToken) {
	let token = bearerToken;
	if (!token) try {
		const authHeader = getRequest()?.headers?.get("authorization");
		if (authHeader?.startsWith("Bearer ")) token = authHeader.slice(7).trim();
	} catch {}
	if (!token) return null;
	try {
		const { data, error } = await supabaseAdmin.auth.getUser(token);
		if (error || !data?.user) return null;
		return {
			id: data.user.id,
			email: data.user.email ?? null
		};
	} catch {
		return null;
	}
}
/**
* Resolve the verified Supabase user id for a server function, or throw UnauthorizedError.
*/
async function requireUserId(bearerToken) {
	const user = await getSessionUser(bearerToken);
	if (!user) throw new UnauthorizedError();
	return user.id;
}
//#endregion
export { getSessionUser, requireUserId };
