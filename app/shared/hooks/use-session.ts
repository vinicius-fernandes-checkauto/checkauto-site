import { useSyncExternalStore } from "react";

import {
	getPublicSession,
	type PublicSession,
	subscribeSession,
} from "~/shared/lib/session";

type SessionState =
	| { data: undefined; status: "loading" }
	| { data: PublicSession; status: "authenticated" }
	| { data: null; status: "unauthenticated" };

const getServerSnapshot = () => undefined;

export function useSession(): SessionState {
	const session = useSyncExternalStore(
		subscribeSession,
		getPublicSession,
		getServerSnapshot,
	);

	if (session === undefined) return { data: undefined, status: "loading" };
	if (session === null) return { data: null, status: "unauthenticated" };
	return { data: session, status: "authenticated" };
}
