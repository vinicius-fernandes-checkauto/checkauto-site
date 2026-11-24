import { useSyncExternalStore } from "react";

import { sessionStore } from "~/shared/lib/session";

const getServerSnapshot = () => null;

export function useSession() {
	return useSyncExternalStore(
		sessionStore.subscribe,
		sessionStore.get,
		getServerSnapshot,
	);
}
