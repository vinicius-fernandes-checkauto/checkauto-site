import { type FormEvent, type ReactNode, useId, useState } from "react";

import {
	type ContactField,
	contactSchema,
	contactSubjects,
	formatPhone,
} from "~/features/site/lib/contact";
import { ChevronDownIcon, CircleCheckIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

const controlClassName =
	"w-full border bg-card text-[0.9375rem] text-heading outline-none placeholder:text-muted-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid aria-invalid:border-destructive";

type Errors = Partial<Record<ContactField, string>>;

function Field({
	id,
	label,
	error,
	className,
	children,
}: {
	id: string;
	label: string;
	error?: string;
	className?: string;
	children: ReactNode;
}) {
	return (
		<div className={cn("flex flex-col gap-1.5", className)}>
			<label
				htmlFor={id}
				className="px-1 text-[0.8125rem] font-medium text-heading"
			>
				{label}
				<span aria-hidden="true" className="text-destructive">
					{" "}
					*
				</span>
			</label>
			{children}
			{error && (
				<p
					id={`${id}-erro`}
					className="px-1 text-sm/5.5 font-medium text-destructive"
				>
					{error}
				</p>
			)}
		</div>
	);
}

export function ContactForm() {
	const baseId = useId();
	const [phone, setPhone] = useState("");
	const [errors, setErrors] = useState<Errors>({});
	const [sent, setSent] = useState(false);

	const fieldId = (field: ContactField) => `${baseId}-${field}`;
	const describe = (field: ContactField) =>
		errors[field]
			? { "aria-invalid": true, "aria-describedby": `${fieldId(field)}-erro` }
			: {};

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const data = Object.fromEntries(new FormData(event.currentTarget));
		const result = contactSchema.safeParse(data);

		if (!result.success) {
			const next: Errors = {};
			for (const issue of result.error.issues) {
				const field = issue.path[0] as ContactField;
				next[field] ??= issue.message;
			}
			setErrors(next);
			const first = Object.keys(next)[0] as ContactField | undefined;
			if (first) document.getElementById(fieldId(first))?.focus();
			return;
		}

		setErrors({});
		setSent(true);
	}

	if (sent) {
		return (
			<div role="status" className="flex flex-col items-start gap-3 py-4">
				<span className="flex size-14 items-center justify-center rounded-full bg-accent text-highlight">
					<CircleCheckIcon aria-hidden="true" className="size-7" />
				</span>
				<h2 className="text-xl font-semibold text-heading">Mensagem enviada</h2>
				<p className="max-w-[40ch] text-sm/6 text-muted-foreground">
					Recebemos seu contato. Nossa equipe vai responder pelo e-mail
					informado.
				</p>
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="mt-2"
					onClick={() => {
						setSent(false);
						setPhone("");
					}}
				>
					Enviar outra mensagem
				</Button>
			</div>
		);
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit}
			onChange={(event) => {
				const target = event.target;
				if (!(target instanceof HTMLElement) || !("name" in target)) return;
				const field = target.name as ContactField;
				if (errors[field]) setErrors({ ...errors, [field]: undefined });
			}}
			className="flex w-full max-w-2xl flex-col gap-4"
		>
			<Field id={fieldId("subject")} label="Assunto" error={errors.subject}>
				<div className="relative">
					<select
						id={fieldId("subject")}
						name="subject"
						defaultValue=""
						{...describe("subject")}
						className={cn(
							controlClassName,
							"h-11 cursor-pointer appearance-none rounded-full border-border pr-11 pl-4.5 text-sm",
						)}
					>
						<option value="" disabled>
							Selecione o assunto
						</option>
						{contactSubjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>
					<ChevronDownIcon
						aria-hidden="true"
						className="pointer-events-none absolute top-1/2 right-4.5 size-4 -translate-y-1/2 text-muted-foreground"
					/>
				</div>
			</Field>

			<div className="grid grid-cols-[minmax(0,1fr)] gap-4 sm:grid-cols-2">
				<Field
					id={fieldId("name")}
					label="Nome"
					error={errors.name}
					className="sm:col-span-2"
				>
					<input
						id={fieldId("name")}
						name="name"
						autoComplete="name"
						{...describe("name")}
						className={cn(
							controlClassName,
							"h-11 rounded-full border-border px-4.5 text-sm",
						)}
					/>
				</Field>
				<Field id={fieldId("email")} label="E-mail" error={errors.email}>
					<input
						id={fieldId("email")}
						name="email"
						type="email"
						autoComplete="email"
						{...describe("email")}
						className={cn(
							controlClassName,
							"h-11 rounded-full border-border px-4.5 text-sm",
						)}
					/>
				</Field>
				<Field
					id={fieldId("phone")}
					label="Telefone de contato"
					error={errors.phone}
				>
					<input
						id={fieldId("phone")}
						name="phone"
						type="tel"
						inputMode="tel"
						autoComplete="tel-national"
						placeholder="(00) 00000-0000"
						value={phone}
						onChange={(event) => setPhone(formatPhone(event.target.value))}
						{...describe("phone")}
						className={cn(
							controlClassName,
							"h-11 rounded-full border-border px-4.5 text-sm",
						)}
					/>
				</Field>
			</div>

			<Field id={fieldId("message")} label="Comentários" error={errors.message}>
				<textarea
					id={fieldId("message")}
					name="message"
					rows={4}
					{...describe("message")}
					className={cn(
						controlClassName,
						"min-h-28 resize-y rounded-3xl border-border px-4.5 py-3 text-sm leading-6",
					)}
				/>
			</Field>

			<div className="flex flex-col-reverse gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
				<p className="px-1 text-xs text-muted-foreground">
					<span aria-hidden="true" className="text-destructive">
						*
					</span>{" "}
					Campos obrigatórios
				</p>
				<Button type="submit" size="sm" className="sm:min-w-40">
					Enviar mensagem
				</Button>
			</div>
		</form>
	);
}
