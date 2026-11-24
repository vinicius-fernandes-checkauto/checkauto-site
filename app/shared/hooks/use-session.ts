import { useSyncExternalStore } from "react";

import {
	getSession,
	type Session,
	subscribeSession,
} from "~/shared/lib/session";

type SessionState =
	| { data: undefined; status: "loading" }
	| { data: Session; status: "authenticated" }
	| { data: null; status: "unauthenticated" };

const getServerSnapshot = () => undefined;

export function useSession(): SessionState {
	const session = useSyncExternalStore(
		subscribeSession,
		getSession,
		getServerSnapshot,
	);

	if (session === undefined) return { data: undefined, status: "loading" };
	if (session === null) return { data: null, status: "unauthenticated" };
	return { data: session, status: "authenticated" };
}
