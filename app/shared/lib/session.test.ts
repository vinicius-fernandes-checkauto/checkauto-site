import { describe, expect, it, vi } from "vitest";

import {
	createSessionStore,
	SESSION_STORAGE_KEY,
	type Session,
} from "./session";

function memoryStorage(): Storage {
	const data = new Map<string, string>();
	return {
		get length() {
			return data.size;
		},
		clear: () => data.clear(),
		getItem: (key) => data.get(key) ?? null,
		key: (index) => [...data.keys()][index] ?? null,
		removeItem: (key) => {
			data.delete(key);
		},
		setItem: (key, value) => {
			data.set(key, value);
		},
	};
}

function jwt(exp: number) {
	const payload = Buffer.from(JSON.stringify({ exp })).toString("base64url");
	return `h.${payload}.s`;
}

const session: Session = {
	tokens: { access: "access-1", refresh: jwt(4_000_000_000) },
	user: {
		id: "u1",
		email: "cliente@exemplo.com",
		name: "Cliente Teste",
		profile: "4",
		firstLogin: false,
		corporateId: null,
		corporateName: null,
	},
};

describe("sessionStore", () => {
	it("guarda, lê e avisa quem está escutando", () => {
		const storage = memoryStorage();
		const store = createSessionStore(() => storage);
		const listener = vi.fn();
		store.subscribe(listener);

		store.set(session);

		expect(store.get()).toEqual(session);
		expect(store.get()).toBe(store.get());
		expect(listener).toHaveBeenCalledTimes(1);
	});

	it("troca os tokens mantendo o usuário", () => {
		const storage = memoryStorage();
		const store = createSessionStore(() => storage);
		store.set(session);
		store.updateTokens({ access: "access-2" });

		expect(store.get()?.tokens).toEqual({
			access: "access-2",
			refresh: session.tokens.refresh,
		});
		expect(store.get()?.user).toEqual(session.user);
	});

	it("ignora conteúdo inválido no storage", () => {
		const storage = memoryStorage();
		storage.setItem(SESSION_STORAGE_KEY, "{quebrado");
		expect(createSessionStore(() => storage).get()).toBeNull();
	});

	it("só é ativa enquanto o refresh não expirou", () => {
		const storage = memoryStorage();
		const store = createSessionStore(() => storage);
		store.set(session);
		expect(store.isActive()).toBe(true);

		store.updateTokens({ access: "a", refresh: jwt(1) });
		expect(store.isActive()).toBe(false);

		store.clear();
		expect(store.get()).toBeNull();
	});

	it("funciona sem storage (prerender)", () => {
		const store = createSessionStore(() => null);
		store.set(session);
		expect(store.get()).toBeNull();
	});
});
