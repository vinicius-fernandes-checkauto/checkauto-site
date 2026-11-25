import { useCallback, useState } from "react";

import { renderRecaptchaV2 } from "~/features/auth/lib/recaptcha";
import { FieldError } from "~/shared/components/ui/field";

type RecaptchaV2Props = {
	action: string;
	onChange: (token: string | null) => void;
};

export function RecaptchaV2({ action, onChange }: RecaptchaV2Props) {
	const [failed, setFailed] = useState(false);

	const mount = useCallback(
		(node: HTMLDivElement | null) => {
			if (!node) return;
			const widget = document.createElement("div");
			node.append(widget);
			renderRecaptchaV2(widget, action, onChange).catch(() => setFailed(true));
			return () => widget.remove();
		},
		[action, onChange],
	);

	return (
		<div className="flex flex-col items-center gap-2">
			<div ref={mount} className="min-h-20" />
			{failed && (
				<FieldError className="text-center">
					Não foi possível carregar a verificação. Recarregue a página e tente
					de novo.
				</FieldError>
			)}
		</div>
	);
}
