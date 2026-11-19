import { type ComponentProps, type ReactNode, useId, useState } from "react";
import { Link } from "react-router";

import {
	EyeIcon,
	EyeOffIcon,
	FacebookIcon,
	GoogleIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

const inputClassName =
	"h-12 w-full rounded-full border border-border bg-card px-5 text-[0.9375rem] text-heading outline-none placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid";

export function AuthHeading({
	title,
	description,
}: {
	title: string;
	description: ReactNode;
}) {
	return (
		<div className="flex flex-col items-center gap-2 text-center">
			<h1 className="text-[1.75rem]/tight font-semibold tracking-tight text-heading lg:text-3xl/tight">
				{title}
			</h1>
			<p className="text-sm/5.5 text-muted-foreground">{description}</p>
		</div>
	);
}

type AuthFieldProps = ComponentProps<"input"> & {
	label: string;
};

export function AuthField({ label, className, ...props }: AuthFieldProps) {
	const id = useId();

	return (
		<div>
			<label htmlFor={id} className="sr-only">
				{label}
			</label>
			<input
				id={id}
				placeholder={label}
				className={cn(inputClassName, className)}
				{...props}
			/>
		</div>
	);
}

export function PasswordField({
	label = "Senha",
	...props
}: Omit<AuthFieldProps, "type" | "label"> & { label?: string }) {
	const id = useId();
	const [visible, setVisible] = useState(false);
	const Icon = visible ? EyeIcon : EyeOffIcon;

	return (
		<div className="relative">
			<label htmlFor={id} className="sr-only">
				{label}
			</label>
			<input
				id={id}
				type={visible ? "text" : "password"}
				placeholder={label}
				className={cn(inputClassName, "pr-14")}
				{...props}
			/>
			<button
				type="button"
				aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
				aria-pressed={visible}
				onClick={() => setVisible((value) => !value)}
				className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-heading focus-visible:outline-2 focus-visible:outline-ring"
			>
				<Icon aria-hidden="true" className="size-4.5" />
			</button>
		</div>
	);
}

export function TermsCheckbox({ children }: { children: ReactNode }) {
	const id = useId();

	return (
		<div className="flex items-center justify-center gap-2.5 text-sm/5.5 text-muted-foreground">
			<input
				id={id}
				type="checkbox"
				required
				className="size-4.5 shrink-0 cursor-pointer rounded-md accent-primary"
			/>
			<label htmlFor={id}>{children}</label>
		</div>
	);
}

export function TextLink({
	to,
	children,
}: {
	to: string;
	children: ReactNode;
}) {
	return (
		<Link
			to={to}
			className="font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight"
		>
			{children}
		</Link>
	);
}

export function SocialSignIn({ action }: { action: string }) {
	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-sm text-muted-foreground">ou continue com</p>
			<div className="flex gap-3">
				<button
					type="button"
					aria-label={`${action} com Google`}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-slate-300"
				>
					<GoogleIcon className="size-5" />
				</button>
				<button
					type="button"
					aria-label={`${action} com Facebook`}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-[#1877F2] transition-colors hover:border-slate-300"
				>
					<FacebookIcon className="size-5" />
				</button>
			</div>
		</div>
	);
}

export function AuthSwitch({
	question,
	to,
	children,
}: {
	question: string;
	to: string;
	children: ReactNode;
}) {
	return (
		<p className="text-center text-sm text-muted-foreground">
			{question}{" "}
			<Link
				to={to}
				className="font-medium text-heading hover:underline hover:underline-offset-4"
			>
				{children}
			</Link>
		</p>
	);
}
