import { useEffect, useRef, useState } from "react";

import { renderRecaptchaV2 } from "~/features/auth/lib/recaptcha";

type RecaptchaV2Props = {
	siteKey: string;
	action: string;
	onVerify: (token: string | null) => void;
};

export function RecaptchaV2({ siteKey, action, onVerify }: RecaptchaV2Props) {
	const container = useRef<HTMLDivElement>(null);
	const onVerifyRef = useRef(onVerify);
	onVerifyRef.current = onVerify;
	const [failed, setFailed] = useState(false);

	useEffect(() => {
		const element = container.current;
		if (!element) return;

		let cancelled = false;
		renderRecaptchaV2(element, {
			sitekey: siteKey,
			action,
			callback: (token) => onVerifyRef.current(token),
			"expired-callback": () => onVerifyRef.current(null),
		}).catch(() => {
			if (!cancelled) setFailed(true);
		});

		return () => {
			cancelled = true;
			element.replaceChildren();
		};
	}, [siteKey, action]);

	return (
		<div className="flex flex-col items-center gap-2">
			<div ref={container} />
			{failed && (
				<p role="alert" className="text-sm font-medium text-destructive">
					Não foi possível carregar a verificação. Recarregue a página.
				</p>
			)}
		</div>
	);
}
