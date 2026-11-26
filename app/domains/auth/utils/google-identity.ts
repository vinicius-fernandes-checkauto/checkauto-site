import type { GoogleProfile } from "~/domains/auth/types/auth.types";

type GoogleId = {
	initialize: (config: {
		client_id: string;
		callback: (response: { credential?: string }) => void;
	}) => void;
	renderButton: (
		element: HTMLElement,
		options: Record<string, string | number>,
	) => void;
};

declare global {
	interface Window {
		google?: { accounts?: { id?: GoogleId } };
	}
}

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

let loading: Promise<GoogleId> | null = null;

function loadGoogleIdentity() {
	loading ??= new Promise<GoogleId>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.onload = () => {
			const id = window.google?.accounts?.id;
			if (id) resolve(id);
			else reject(new Error("Google indisponível"));
		};
		script.onerror = () => {
			loading = null;
			reject(new Error("Google indisponível"));
		};
		document.head.append(script);
	});

	return loading;
}

export function isGoogleSignInConfigured() {
	return Boolean(clientId);
}

export async function renderGoogleButton(
	element: HTMLElement,
	text: "signin_with" | "signup_with",
	onCredential: (idToken: string) => void,
) {
	if (!clientId) throw new Error("Google não configurado");

	const id = await loadGoogleIdentity();
	id.initialize({
		client_id: clientId,
		callback: ({ credential }) => {
			if (credential) onCredential(credential);
		},
	});
	id.renderButton(element, {
		theme: "outline",
		size: "large",
		shape: "pill",
		text,
		locale: "pt-BR",
		width: Math.min(element.clientWidth || 320, 400),
	});
}

const PENDING_KEY = "checkauto.google-signup";
const PENDING_MAX_AGE = 50 * 60 * 1000;

export type PendingGoogleSignUp = GoogleProfile & {
	idToken: string;
	savedAt: number;
};

function pendingStorage() {
	try {
		return typeof window === "undefined" ? null : window.sessionStorage;
	} catch {
		return null;
	}
}

export function savePendingGoogleSignUp(
	idToken: string,
	profile: GoogleProfile,
) {
	const pending: PendingGoogleSignUp = {
		...profile,
		idToken,
		savedAt: Date.now(),
	};
	pendingStorage()?.setItem(PENDING_KEY, JSON.stringify(pending));
}

export function readPendingGoogleSignUp(): PendingGoogleSignUp | null {
	try {
		const raw = pendingStorage()?.getItem(PENDING_KEY);
		if (!raw) return null;
		const pending = JSON.parse(raw) as PendingGoogleSignUp;
		if (typeof pending.idToken !== "string") return null;
		if (Date.now() - pending.savedAt > PENDING_MAX_AGE) {
			clearPendingGoogleSignUp();
			return null;
		}
		return pending;
	} catch {
		return null;
	}
}

export function clearPendingGoogleSignUp() {
	pendingStorage()?.removeItem(PENDING_KEY);
}
