import { r as __exportAll } from "../_runtime.mjs";
import { s as __exportAll$1 } from "./ssr.mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/client-WGoQWNp1.js
var client_WGoQWNp1_exports = /* @__PURE__ */ __exportAll({
	n: () => setBearerToken,
	r: () => signOut,
	t: () => client_exports
});
var client_exports = /* @__PURE__ */ __exportAll$1({
	authEnabled: () => true,
	getBearerToken: () => getBearerToken,
	setBearerToken: () => setBearerToken,
	signOut: () => signOut
});
var BEARER_KEY = "sb-access-token";
/**
* Get the current Supabase access token (bearer token).
* Synchronously checks memory, sessionStorage, localStorage, or Supabase default storage.
*/
function getBearerToken() {
	if (typeof window === "undefined") return null;
	try {
		const sessionToken = window.sessionStorage.getItem(BEARER_KEY);
		if (sessionToken) return sessionToken;
		const localToken = window.localStorage.getItem(BEARER_KEY);
		if (localToken) return localToken;
		for (let i = 0; i < window.localStorage.length; i++) {
			const key = window.localStorage.key(i);
			if (key && key.startsWith("sb-") && key.endsWith("-auth-token")) {
				const raw = window.localStorage.getItem(key);
				if (raw) {
					const parsed = JSON.parse(raw);
					if (parsed?.access_token) return parsed.access_token;
				}
			}
		}
		return null;
	} catch {
		return null;
	}
}
/**
* Store or clear the bearer token.
*/
function setBearerToken(token) {
	if (typeof window === "undefined") return;
	try {
		if (token) {
			window.sessionStorage.setItem(BEARER_KEY, token);
			window.localStorage.setItem(BEARER_KEY, token);
		} else {
			window.sessionStorage.removeItem(BEARER_KEY);
			window.localStorage.removeItem(BEARER_KEY);
		}
	} catch {}
}
/**
* Sign out of Supabase Auth completely, clear tokens, and redirect.
*/
async function signOut(redirectTo = "/login") {
	try {
		setBearerToken(null);
		await supabase.auth.signOut();
	} catch (err) {
		console.error("Sign out error:", err);
	} finally {
		setBearerToken(null);
		if (typeof window !== "undefined") window.location.href = redirectTo;
	}
}
//#endregion
export { setBearerToken as n, signOut as r, client_WGoQWNp1_exports as t };
