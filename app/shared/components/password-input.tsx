import { type ComponentProps, useState } from "react";

import { EyeIcon, EyeOffIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { cn } from "~/shared/lib/utils";

export function PasswordInput({
	className,
	...props
}: Omit<ComponentProps<typeof Input>, "type">) {
	const [visible, setVisible] = useState(false);
	const Icon = visible ? EyeIcon : EyeOffIcon;

	return (
		<div className="relative w-full">
			<Input
				type={visible ? "text" : "password"}
				className={cn("pr-12", className)}
				{...props}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
				aria-pressed={visible}
				onClick={() => setVisible((value) => !value)}
				className="absolute top-0 right-0 text-muted-foreground hover:text-heading"
			>
				<Icon aria-hidden="true" />
			</Button>
		</div>
	);
}
