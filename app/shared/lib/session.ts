import { z } from "zod";

const ACCESS_COOKIE = "checkauto.access";
const REFRESH_COOKIE = "checkauto.refresh";
const USER_COOKIE = "checkauto.user";

export const SIGN_IN_PATH = "/entrar";

const sessionUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	profile: z.string(),
});

const sessionSchema = z.object({
	user: sessionUserSchema,
	accessToken: z.string().min(1),
	refreshToken: z.string().min(1),
	expires: z.number(),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type PublicSession = { user: SessionUser };
export type Session = z.infer<typeof sessionSchema>;

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;
let cachedPublicSession: PublicSession | null = null;

function readCookie(name: string) {
	if (typeof document === "undefined") return null;

	const cookie = document.cookie
		.split("; ")
		.find((value) => value.startsWith(`${name}=`));

	if (!cookie) return null;

	try {
		return decodeURIComponent(cookie.slice(name.length + 1));
	} catch {
		return null;
	}
}

function cookieSnapshot() {
	return [
		readCookie(ACCESS_COOKIE),
		readCookie(REFRESH_COOKIE),
		readCookie(USER_COOKIE),
	] as const;
}

function cookieMaxAge(expires: number) {
	return Math.max(0, Math.floor((expires - Date.now()) / 1000));
}

function writeCookie(name: string, value: string, expires: number) {
	if (typeof document === "undefined") return;

	const secure =
		typeof window !== "undefined" && window.location.protocol === "https:"
			? "; Secure"
			: "";

	document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${cookieMaxAge(expires)}; SameSite=Lax${secure}`;
}

function removeCookie(name: string) {
	if (typeof document === "undefined") return;

	const secure =
		typeof window !== "undefined" && window.location.protocol === "https:"
			? "; Secure"
			: "";

	document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
}

function notify() {
	for (const listener of listeners) listener();
}

function invalidateCache() {
	cachedRaw = null;
	cachedSession = null;
	cachedPublicSession = null;
}

export function tokenExpiresAt(token: string) {
	try {
		const payload = token.split(".")[1] ?? "";
		const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
		const { exp } = JSON.parse(json) as { exp?: unknown };
		return typeof exp === "number" ? exp * 1000 : 0;
	} catch {
		return 0;
	}
}

export function getSession(): Session | null {
	const [accessToken, refreshToken, rawUser] = cookieSnapshot();
	const raw = [accessToken, refreshToken, rawUser].join("|");

	if (raw === cachedRaw) {
		if (cachedSession && cachedSession.expires <= Date.now()) {
			invalidateCache();
		} else {
			return cachedSession;
		}
	}

	cachedRaw = raw;
	cachedSession = null;
	cachedPublicSession = null;

	if (!accessToken || !refreshToken || !rawUser) return null;

	let user: unknown;
	try {
		user = JSON.parse(rawUser);
	} catch {
		return null;
	}

	const parsedUser = sessionUserSchema.safeParse(user);
	if (!parsedUser.success) return null;

	const expires = tokenExpiresAt(refreshToken);
	if (expires <= Date.now()) return null;

	cachedSession = {
		user: parsedUser.data,
		accessToken,
		refreshToken,
		expires,
	};
	cachedPublicSession = { user: parsedUser.data };

	return cachedSession;
}

export function getPublicSession(): PublicSession | null {
	return getSession() ? cachedPublicSession : null;
}

export function setSession(session: Session) {
	const parsed = sessionSchema.parse(session);
	if (parsed.expires <= Date.now()) {
		throw new Error("Não é possível salvar uma sessão expirada.");
	}

	writeCookie(ACCESS_COOKIE, parsed.accessToken, parsed.expires);
	writeCookie(REFRESH_COOKIE, parsed.refreshToken, parsed.expires);
	writeCookie(USER_COOKIE, JSON.stringify(parsed.user), parsed.expires);
	invalidateCache();

	if (!getSession()) {
		clearSession();
		throw new Error("Não foi possível persistir a sessão nos cookies.");
	}

	notify();
}

export function clearSession() {
	removeCookie(ACCESS_COOKIE);
	removeCookie(REFRESH_COOKIE);
	removeCookie(USER_COOKIE);
	invalidateCache();
	notify();
}

export function subscribeSession(listener: () => void) {
	listeners.add(listener);

	if (typeof window !== "undefined") {
		window.addEventListener("focus", listener);
	}

	if (typeof document !== "undefined") {
		document.addEventListener("visibilitychange", listener);
	}

	return () => {
		listeners.delete(listener);

		if (typeof window !== "undefined") {
			window.removeEventListener("focus", listener);
		}

		if (typeof document !== "undefined") {
			document.removeEventListener("visibilitychange", listener);
		}
	};
}
