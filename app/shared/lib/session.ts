import { z } from "zod";

export const SIGN_IN_PATH = "/entrar";

const COOKIE_NAME = "checkauto.session-token";

const sessionUserSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	profile: z.string(),
	authProvider: z.enum(["credentials", "google"]).default("credentials"),
	picture: z.string().optional(),
});

const storedSessionSchema = z.object({
	user: sessionUserSchema,
	accessToken: z.string().min(1),
	refreshToken: z.string().min(1),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
export type PublicSession = { user: SessionUser };
export type Session = z.infer<typeof storedSessionSchema> & {
	expires: number;
};

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;
let cachedPublicSession: PublicSession | null = null;

function isSecure() {
	return typeof window !== "undefined" && window.location.protocol === "https:";
}

function cookieName() {
	return isSecure() ? `__Secure-${COOKIE_NAME}` : COOKIE_NAME;
}

function cookieAttributes(maxAge: number) {
	return `; Path=/; Max-Age=${maxAge}; SameSite=Lax${isSecure() ? "; Secure" : ""}`;
}

function readCookie() {
	if (typeof document === "undefined") return null;

	const prefix = `${cookieName()}=`;
	const cookie = document.cookie
		.split("; ")
		.find((value) => value.startsWith(prefix));

	if (!cookie) return null;

	try {
		return decodeURIComponent(cookie.slice(prefix.length));
	} catch {
		return null;
	}
}

function notify() {
	for (const listener of listeners) listener();
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

function parseSession(raw: string): Session | null {
	try {
		const parsed = storedSessionSchema.safeParse(JSON.parse(raw));
		if (!parsed.success) return null;

		const expires = tokenExpiresAt(parsed.data.refreshToken);
		return expires > Date.now() ? { ...parsed.data, expires } : null;
	} catch {
		return null;
	}
}

export function getSession(): Session | null {
	const raw = readCookie();

	if (raw !== cachedRaw) {
		cachedRaw = raw;
		cachedSession = raw ? parseSession(raw) : null;
		cachedPublicSession = cachedSession ? { user: cachedSession.user } : null;
	}

	if (cachedSession && cachedSession.expires <= Date.now()) {
		cachedSession = null;
		cachedPublicSession = null;
	}

	return cachedSession;
}

export function getPublicSession(): PublicSession | null {
	return getSession() ? cachedPublicSession : null;
}

export function setSession({ expires, ...session }: Session) {
	const maxAge = Math.floor((expires - Date.now()) / 1000);
	if (maxAge <= 0) {
		throw new Error("Não é possível salvar uma sessão expirada.");
	}

	const value = encodeURIComponent(JSON.stringify(session));
	document.cookie = `${cookieName()}=${value}${cookieAttributes(maxAge)}`;
	notify();
}

export function clearSession() {
	if (typeof document !== "undefined") {
		document.cookie = `${cookieName()}=${cookieAttributes(0)}`;
	}
	notify();
}

export function subscribeSession(listener: () => void) {
	listeners.add(listener);
	window.addEventListener("focus", listener);
	document.addEventListener("visibilitychange", listener);

	return () => {
		listeners.delete(listener);
		window.removeEventListener("focus", listener);
		document.removeEventListener("visibilitychange", listener);
	};
}
