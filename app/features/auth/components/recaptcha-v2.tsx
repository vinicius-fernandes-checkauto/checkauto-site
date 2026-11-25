import { useCallback } from "react";

import { renderRecaptchaV2 } from "~/features/auth/lib/recaptcha";

type RecaptchaV2Props = {
	onChange: (token: string | null) => void;
	onError: () => void;
};

export function RecaptchaV2({ onChange, onError }: RecaptchaV2Props) {
	const mount = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return;
			renderRecaptchaV2(node, onChange).catch(onError);
			return () => node.replaceChildren();
		},
		[onChange, onError],
	);

	return <div ref={mount} className="flex min-h-20 justify-center" />;
}
