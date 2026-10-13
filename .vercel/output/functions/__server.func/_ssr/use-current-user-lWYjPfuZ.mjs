import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as supabase } from "./supabase-CCDJo-Xx.mjs";
import { n as setBearerToken } from "./client-WGoQWNp1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-current-user-lWYjPfuZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Current user + loading state powered by Supabase Auth.
* Automatically synchronizes bearer tokens and listens for auth changes.
*/
function useCurrentUserState() {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isPending, setIsPending] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		supabase.auth.getSession().then(({ data: { session } }) => {
			if (!mounted) return;
			if (session?.user) {
				setBearerToken(session.access_token);
				const meta = session.user.user_metadata || {};
				setUser({
					id: session.user.id,
					displayName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Staff",
					primaryEmail: session.user.email || null,
					profileImageUrl: meta.avatar_url || null,
					isDevFallback: false
				});
			} else {
				setBearerToken(null);
				setUser(null);
			}
			setIsPending(false);
		}).catch(() => {
			if (mounted) setIsPending(false);
		});
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
			if (!mounted) return;
			if (session?.user) {
				setBearerToken(session.access_token);
				const meta = session.user.user_metadata || {};
				setUser({
					id: session.user.id,
					displayName: meta.full_name || meta.name || session.user.email?.split("@")[0] || "Staff",
					primaryEmail: session.user.email || null,
					profileImageUrl: meta.avatar_url || null,
					isDevFallback: false
				});
			} else {
				setBearerToken(null);
				setUser(null);
			}
			setIsPending(false);
		});
		return () => {
			mounted = false;
			subscription.unsubscribe();
		};
	}, []);
	return {
		user,
		isPending
	};
}
function useCurrentUser() {
	return useCurrentUserState().user;
}
//#endregion
export { useCurrentUserState as n, useCurrentUser as t };
