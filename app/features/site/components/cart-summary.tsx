import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { z } from "zod";

import { type AppliedCoupon, formatCents } from "~/features/site/lib/cart";
import { LockIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

type CartSummaryProps = {
	count: number;
	subtotalCents: number;
	discountCents: number;
	coupon: AppliedCoupon | null;
	onApplyCoupon: (code: string) => string | null;
	onRemoveCoupon: () => void;
};

function SummaryRow({
	label,
	value,
	className,
}: {
	label: string;
	value: string;
	className?: string;
}) {
	return (
		<div className="flex justify-between gap-3">
			<dt className="text-muted-foreground">{label}</dt>
			<dd
				className={cn("font-medium whitespace-nowrap text-heading", className)}
			>
				{value}
			</dd>
		</div>
	);
}

const couponSchema = z.object({
	code: z
		.string()
		.trim()
		.toUpperCase()
		.min(1, { error: "Digite o código do cupom." }),
});

function CouponForm({ onApply }: { onApply: (code: string) => string | null }) {
	const inputId = useId();
	const messageId = useId();
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(couponSchema),
		defaultValues: { code: "" },
	});
	const error = errors.code?.message;

	function submit({ code }: z.output<typeof couponSchema>) {
		const message = onApply(code);
		if (message) setError("code", { message }, { shouldFocus: true });
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit(submit)}
			className="flex flex-col gap-2"
		>
			<label htmlFor={inputId} className="sr-only">
				Cupom de desconto
			</label>
			<div
				className={cn(
					"flex items-center gap-1.5 rounded-full border bg-card p-1 pl-4.5 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring has-[input:focus-visible]:outline-solid",
					error ? "border-destructive" : "border-border",
				)}
			>
				<input
					id={inputId}
					type="text"
					autoComplete="off"
					autoCapitalize="characters"
					spellCheck={false}
					placeholder="Cupom de desconto"
					{...register("code")}
					aria-invalid={error ? true : undefined}
					aria-describedby={messageId}
					className="h-11 min-w-0 flex-1 bg-transparent text-sm text-heading uppercase outline-none placeholder:text-muted-foreground placeholder:normal-case"
				/>
				<Button type="submit" variant="secondary" size="sm">
					Aplicar
				</Button>
			</div>
			<p
				id={messageId}
				aria-live="polite"
				className="px-4 text-sm/5.5 font-medium text-destructive empty:hidden"
			>
				{error}
			</p>
		</form>
	);
}

export function CartSummary({
	count,
	subtotalCents,
	discountCents,
	coupon,
	onApplyCoupon,
	onRemoveCoupon,
}: CartSummaryProps) {
	return (
		<aside
			aria-labelledby="resumo-titulo"
			className="flex flex-col gap-3 lg:sticky lg:top-24"
		>
			<h2
				id="resumo-titulo"
				className="px-1 pb-1 text-2xl/8 font-semibold tracking-tight text-heading lg:text-[1.75rem]"
			>
				Resumo
			</h2>

			<div className="overflow-hidden rounded-3xl border border-border bg-card">
				<dl className="flex flex-col gap-3 p-5.5 text-sm sm:px-6">
					<SummaryRow
						label="Consultas"
						value={count === 1 ? "1 consulta" : `${count} consultas`}
					/>
					<SummaryRow
						label="Subtotal"
						value={`R$ ${formatCents(subtotalCents)}`}
					/>
					<SummaryRow
						label="Desconto"
						value={`− R$ ${formatCents(discountCents)}`}
						className="text-highlight"
					/>
					<div className="flex items-baseline justify-between gap-3 border-t border-dashed border-border pt-3">
						<dt className="text-[0.9375rem] font-semibold text-heading">
							Total
						</dt>
						<dd className="text-[1.625rem] font-semibold tracking-tight text-heading">
							<span className="mr-0.5 text-sm font-medium">R$</span>
							{formatCents(subtotalCents - discountCents)}
						</dd>
					</div>
				</dl>

				<div className="border-t border-border bg-muted/50 p-3.5">
					{coupon ? (
						<p className="flex min-h-13 items-center justify-between gap-2 rounded-full bg-accent pr-2 pl-4.5 text-sm font-medium text-heading">
							<span>
								{coupon.code} · {coupon.percent}% de desconto
							</span>
							<button
								type="button"
								onClick={onRemoveCoupon}
								className="min-h-11 rounded-full px-3 text-xs text-muted-foreground underline underline-offset-3 hover:text-heading"
							>
								Remover
							</button>
						</p>
					) : (
						<CouponForm onApply={onApplyCoupon} />
					)}
				</div>
			</div>

			<div className="flex flex-col gap-3 max-lg:hidden">
				<Button type="button" disabled={count === 0}>
					Finalizar compra
				</Button>
				<Button variant="outline" asChild>
					<Link to="/#pacotes">Continuar consultando</Link>
				</Button>
				<p className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
					<LockIcon aria-hidden="true" className="size-3.5 text-highlight" />
					Compra segura
				</p>
			</div>
		</aside>
	);
}
