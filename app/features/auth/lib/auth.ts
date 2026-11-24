import {
	createContext,
	type RouterContextProvider,
	redirect,
} from "react-router";

import {
	type AuthProvider,
	type ProviderInput,
	providers,
} from "~/features/auth/lib/providers";
import {
	clearSession,
	getSession,
	type Session,
	setSession,
} from "~/shared/lib/session";

export const SIGN_IN_PATH = "/entrar";

export const sessionContext = createContext<Session>();

export async function signIn<P extends AuthProvider>(
	provider: P,
	input: ProviderInput<P>,
) {
	const session = await providers[provider].authorize(input);
	setSession(session);
}

export function signOut() {
	clearSession();
}

export function safeCallbackUrl(value: string | null, fallback = "/conta") {
	if (!value?.startsWith("/") || value.startsWith("//")) return fallback;
	return value;
}

export function authMiddleware({
	request,
	context,
}: {
	request: Request;
	context: Readonly<RouterContextProvider>;
}) {
	const session = getSession();

	if (!session) {
		const { pathname, search } = new URL(request.url);
		const callbackUrl = encodeURIComponent(pathname + search);
		throw redirect(`${SIGN_IN_PATH}?callbackUrl=${callbackUrl}`);
	}

	context.set(sessionContext, session);
}
