import { useState } from "react";

export function useRecaptchaChallenge() {
	const [key, setKey] = useState(0);
	const [token, setToken] = useState<string | null>(null);

	return {
		key,
		token,
		setToken,
		active: key > 0,
		missing: key > 0 && !token,
		restart() {
			setToken(null);
			setKey((current) => current + 1);
		},
	};
}
