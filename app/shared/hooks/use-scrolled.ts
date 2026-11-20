import { useSyncExternalStore } from "react";

export function useScrolled(threshold = 8) {
	return useSyncExternalStore(
		(onChange) => {
			window.addEventListener("scroll", onChange, { passive: true });
			return () => window.removeEventListener("scroll", onChange);
		},
		() => window.scrollY > threshold,
		() => false,
	);
}
