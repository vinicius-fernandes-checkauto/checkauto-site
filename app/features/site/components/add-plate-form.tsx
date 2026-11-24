import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/shared/components/ui/button";
import { withMask } from "~/shared/lib/form";
import { normalizePlate, plateSchema } from "~/shared/lib/plate";
import { cn } from "~/shared/lib/utils";

const addPlateSchema = z.object({ plate: plateSchema });

type AddPlateFormProps = {
	label: string;
	onAdd: (plate: string) => string | null;
};

export function AddPlateForm({ label, onAdd }: AddPlateFormProps) {
	const inputId = useId();
	const messageId = useId();
	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(addPlateSchema),
		defaultValues: { plate: "" },
	});
	const error = errors.plate?.message;

	function submit({ plate }: z.output<typeof addPlateSchema>) {
		const message = onAdd(plate);

		if (message) {
			setError("plate", { message }, { shouldFocus: true });
			return;
		}

		reset();
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit(submit)}
			className="flex flex-col gap-2 border-t border-border p-4 sm:px-7 sm:pt-4.5 sm:pb-5.5"
		>
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
				<label
					htmlFor={inputId}
					className="text-sm font-medium whitespace-nowrap text-heading"
				>
					{label}
				</label>
				<div
					className={cn(
						"flex min-w-0 flex-1 items-center gap-1.5 rounded-full border border-dashed bg-card p-1 has-[input:focus-visible]:border-solid has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring has-[input:focus-visible]:outline-solid",
						error ? "border-destructive" : "border-slate-300",
					)}
				>
					<span
						aria-hidden="true"
						className="flex size-9 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-navy-50 text-[0.625rem] leading-none font-semibold tracking-wider text-heading"
					>
						<span className="h-0.5 w-3.5 rounded-full bg-brand-blue" />
						BR
					</span>
					<input
						id={inputId}
						type="text"
						autoComplete="off"
						autoCapitalize="characters"
						spellCheck={false}
						maxLength={8}
						placeholder="Digite a placa"
						{...withMask(register("plate"), normalizePlate)}
						aria-invalid={error ? true : undefined}
						aria-describedby={messageId}
						className="h-11 min-w-0 flex-1 bg-transparent px-1 text-[0.9375rem] font-semibold tracking-[0.12em] text-heading uppercase outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-muted-foreground placeholder:normal-case"
					/>
					<Button type="submit" variant="secondary" size="sm">
						Adicionar
					</Button>
				</div>
			</div>
			<p
				id={messageId}
				aria-live="polite"
				className="text-sm/5.5 font-medium text-destructive empty:hidden sm:text-right"
			>
				{error}
			</p>
		</form>
	);
}
