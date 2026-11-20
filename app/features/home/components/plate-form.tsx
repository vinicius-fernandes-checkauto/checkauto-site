import { type FormEvent, useId, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";
import { normalizePlate, plateSchema } from "~/shared/utils/plate";

export const PLATE_STORAGE_KEY = "checkauto:plate";

export const HERO_PLATE_INPUT_ID = "placa";

export function focusHeroPlateInput() {
	const input = document.getElementById(HERO_PLATE_INPUT_ID);
	if (!input) return false;

	input.scrollIntoView({ block: "center" });
	input.focus({ preventScroll: true });
	return true;
}

type PlateFormProps = {
	inputId?: string;
	className?: string;
	onSubmitted?: (plate: string) => void;
};

export function PlateForm({
	inputId: customInputId,
	className,
	onSubmitted,
}: PlateFormProps) {
	const navigate = useNavigate();
	const inputRef = useRef<HTMLInputElement>(null);
	const [plate, setPlate] = useState("");
	const [error, setError] = useState<string | null>(null);
	const generatedInputId = useId();
	const inputId = customInputId ?? generatedInputId;
	const messageId = useId();

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const result = plateSchema.safeParse(plate);

		if (!result.success) {
			setError(result.error.issues[0]?.message ?? null);
			inputRef.current?.focus();
			return;
		}

		setError(null);

		try {
			sessionStorage.setItem(PLATE_STORAGE_KEY, result.data);
		} catch {}

		if (onSubmitted) {
			onSubmitted(result.data);
			return;
		}

		navigate("/#pacotes");
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit}
			className={cn("flex w-full max-w-lg flex-col gap-2", className)}
		>
			<label htmlFor={inputId} className="sr-only">
				Placa do veículo
			</label>
			<div
				className={cn(
					"flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-1.5 sm:rounded-full sm:border sm:bg-card sm:p-1.5 sm:has-[input:focus-visible]:outline-3 sm:has-[input:focus-visible]:outline-offset-2 sm:has-[input:focus-visible]:outline-ring sm:has-[input:focus-visible]:outline-solid",
					error ? "sm:border-destructive" : "sm:border-border",
				)}
			>
				<div
					className={cn(
						"flex min-h-16 min-w-0 flex-1 items-center gap-1.5 rounded-full border bg-card p-1.5 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring has-[input:focus-visible]:outline-solid sm:min-h-0 sm:border-0 sm:bg-transparent sm:p-0 sm:has-[input:focus-visible]:outline-none",
						error ? "border-destructive" : "border-border",
					)}
				>
					<span
						aria-hidden="true"
						className="flex size-12 shrink-0 flex-col items-center justify-center gap-1 rounded-full bg-navy-50 text-[0.6875rem] leading-none font-semibold tracking-wider text-heading"
					>
						<span className="h-0.5 w-4 rounded-full bg-brand-blue" />
						BR
					</span>
					<input
						ref={inputRef}
						id={inputId}
						name="placa"
						type="text"
						inputMode="text"
						autoComplete="off"
						autoCapitalize="characters"
						spellCheck={false}
						maxLength={8}
						placeholder="Informe a placa do veículo"
						value={plate}
						onChange={(event) => {
							setPlate(normalizePlate(event.target.value));
							setError(null);
						}}
						aria-invalid={error ? true : undefined}
						aria-describedby={messageId}
						className="h-12 min-w-0 flex-1 bg-transparent px-1 text-base/relaxed font-semibold tracking-[0.12em] text-heading uppercase outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground placeholder:normal-case focus-visible:outline-none"
					/>
				</div>
				<Button
					type="submit"
					className="h-14 w-full shrink-0 sm:h-12 sm:w-auto"
				>
					Consultar
				</Button>
			</div>
			<p
				id={messageId}
				aria-live="polite"
				className="px-5 text-sm/5.5 font-medium text-destructive empty:hidden"
			>
				{error}
			</p>
		</form>
	);
}
