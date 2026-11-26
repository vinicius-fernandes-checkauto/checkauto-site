import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

import {
	CircleCheckIcon,
	InfoIcon,
	LoaderCircleIcon,
	OctagonXIcon,
	TriangleAlertIcon,
} from "~/shared/components/icons";

function Toaster({ ...props }: ToasterProps) {
	return (
		<Sonner
			theme="light"
			position="top-center"
			className="toaster group"
			icons={{
				success: <CircleCheckIcon aria-hidden="true" className="size-4.5" />,
				info: <InfoIcon aria-hidden="true" className="size-4.5" />,
				warning: <TriangleAlertIcon aria-hidden="true" className="size-4.5" />,
				error: <OctagonXIcon aria-hidden="true" className="size-4.5" />,
				loading: (
					<LoaderCircleIcon
						aria-hidden="true"
						className="size-4.5 animate-spin"
					/>
				),
			}}
			style={
				{
					"--normal-bg": "var(--popover)",
					"--normal-text": "var(--popover-foreground)",
					"--normal-border": "var(--border)",
					"--border-radius": "var(--radius)",
				} as CSSProperties
			}
			toastOptions={{
				classNames: {
					toast: "font-sans",
					title: "text-sm font-medium text-heading",
					description: "text-sm text-muted-foreground",
					success: "[&_[data-icon]]:text-highlight",
					error: "[&_[data-icon]]:text-destructive",
				},
			}}
			{...props}
		/>
	);
}

export { Toaster };
