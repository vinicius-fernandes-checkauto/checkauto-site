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
	SIGN_IN_PATH,
	setSession,
} from "~/shared/lib/session";

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

export function authMiddleware({
	context,
}: {
	context: Readonly<RouterContextProvider>;
}) {
	const session = getSession();

	if (!session) throw redirect(SIGN_IN_PATH);

	context.set(sessionContext, session);
}
