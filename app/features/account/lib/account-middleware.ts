import { redirect } from "react-router";

import {
	clearSession,
	getSession,
	type Session,
	SIGN_IN_PATH,
} from "~/shared/lib/session";

export function requireAccountSession(): Session {
	const session = getSession();

	if (session) return session;

	clearSession();
	throw redirect(SIGN_IN_PATH);
}

export async function accountMiddleware(
	_args: unknown,
	next: () => Promise<Record<string, unknown>>,
) {
	requireAccountSession();
	await next();
}
