import { z } from "zod";

import { isJwtExpired } from "~/shared/lib/jwt";

export const SESSION_STORAGE_KEY = "checkauto:session";

const sessionSchema = z.object({
	tokens: z.object({ access: z.string(), refresh: z.string() }),
	user: z.object({
		id: z.string(),
		email: z.string(),
		name: z.string(),
		profile: z.string(),
		firstLogin: z.boolean(),
		corporateId: z.string().nullable(),
		corporateName: z.string().nullable(),
	}),
});

export type Session = z.output<typeof sessionSchema>;
export type SessionUser = Session["user"];

type Listener = () => void;

export function createSessionStore(storage: () => Storage | null) {
	const listeners = new Set<Listener>();
	let cachedRaw: string | null | undefined;
	let cached: Session | null = null;

	function read(): Session | null {
		let raw: string | null = null;
		try {
			raw = storage()?.getItem(SESSION_STORAGE_KEY) ?? null;
		} catch {
			raw = null;
		}
		if (raw === cachedRaw) return cached;

		cachedRaw = raw;
		cached = null;
		if (raw) {
			try {
				const result = sessionSchema.safeParse(JSON.parse(raw));
				cached = result.success ? result.data : null;
			} catch {
				cached = null;
			}
		}
		return cached;
	}

	function write(session: Session | null) {
		try {
			const target = storage();
			if (session) {
				target?.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
			} else {
				target?.removeItem(SESSION_STORAGE_KEY);
			}
		} catch {}
		for (const listener of listeners) listener();
	}

	return {
		get: read,

		set(session: Session) {
			write(session);
		},

		updateTokens(tokens: { access: string; refresh?: string }) {
			const current = read();
			if (!current) return;
			write({
				...current,
				tokens: {
					access: tokens.access,
					refresh: tokens.refresh ?? current.tokens.refresh,
				},
			});
		},

		clear() {
			write(null);
		},

		isActive() {
			const current = read();
			return Boolean(current && !isJwtExpired(current.tokens.refresh));
		},

		subscribe(listener: Listener) {
			listeners.add(listener);
			const onStorage = (event: StorageEvent) => {
				if (event.key === SESSION_STORAGE_KEY) listener();
			};
			if (typeof window !== "undefined") {
				window.addEventListener("storage", onStorage);
			}
			return () => {
				listeners.delete(listener);
				if (typeof window !== "undefined") {
					window.removeEventListener("storage", onStorage);
				}
			};
		},
	};
}

export type SessionStore = ReturnType<typeof createSessionStore>;

export const sessionStore = createSessionStore(() =>
	typeof window === "undefined" ? null : window.localStorage,
);
