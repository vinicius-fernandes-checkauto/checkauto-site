import { z } from "zod";

const STORAGE_KEY = "checkauto.session";

const sessionSchema = z.object({
	user: z.object({
		id: z.string(),
		name: z.string(),
		email: z.string(),
		profile: z.string(),
	}),
	accessToken: z.string(),
	refreshToken: z.string(),
	expires: z.number(),
});

export type Session = z.infer<typeof sessionSchema>;

const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cachedSession: Session | null = null;

function storage() {
	try {
		return typeof window === "undefined" ? null : window.localStorage;
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

export function getSession(): Session | null {
	const raw = storage()?.getItem(STORAGE_KEY) ?? null;
	if (raw === cachedRaw) {
		if (cachedSession && cachedSession.expires <= Date.now()) {
			cachedSession = null;
		}
		return cachedSession;
	}

	cachedRaw = raw;
	cachedSession = null;
	if (!raw) return null;

	try {
		const parsed = sessionSchema.safeParse(JSON.parse(raw));
		if (parsed.success && parsed.data.expires > Date.now()) {
			cachedSession = parsed.data;
		}
	} catch {}

	return cachedSession;
}

export function setSession(session: Session) {
	storage()?.setItem(STORAGE_KEY, JSON.stringify(session));
	notify();
}

export function clearSession() {
	storage()?.removeItem(STORAGE_KEY);
	notify();
}

export function subscribeSession(listener: () => void) {
	listeners.add(listener);
	const onStorage = (event: StorageEvent) => {
		if (event.key === STORAGE_KEY) listener();
	};
	window.addEventListener("storage", onStorage);

	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}
