import ring from "~/assets/brand/symbol-ring-blue.webp";
import type { OrderView } from "~/domains/account/types/account.types";
import { formatAmount } from "~/domains/account/utils/queries";
import { ClockIcon, CreditCardIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

type PaymentCardProps = Pick<OrderView, "payment" | "amount" | "expiresAt">;

function BrandArc({ className }: { className: string }) {
	return (
		<span
			aria-hidden="true"
			style={{ maskImage: `url(${ring})` }}
			className={cn(
				"pointer-events-none absolute aspect-896/900 mask-contain mask-no-repeat",
				className,
			)}
		/>
	);
}

function CreditCard({
	brand,
	last4,
	amount,
}: {
	brand: string;
	last4: string;
	amount: string;
}) {
	return (
		<div className="relative flex aspect-[85.6/53.98] w-full flex-col justify-between overflow-hidden rounded-3xl bg-brand-blue p-5 text-white shadow-lg sm:aspect-auto sm:min-h-56 sm:p-6">
			<BrandArc className="-top-16 -right-14 w-52 bg-brand-green/25" />
			<BrandArc className="-bottom-24 -left-20 w-48 bg-white/5" />

			<div className="relative flex items-start justify-between gap-3">
				<span className="text-xs font-medium tracking-widest text-white/80 uppercase">
					Cartão de crédito
				</span>
				<span className="text-base font-semibold tracking-wide italic">
					{brand}
				</span>
			</div>

			<span
				aria-hidden="true"
				className="relative h-7 w-10 rounded-md bg-brand-green/80 ring-1 ring-white/30"
			/>

			<p className="relative text-lg font-medium tracking-[0.2em] tabular-nums">
				<span aria-hidden="true">•••• •••• •••• </span>
				<span className="sr-only">Cartão com final </span>
				{last4 || "••••"}
			</p>

			<div className="relative flex items-end justify-between gap-3">
				<div className="flex flex-col">
					<span className="text-xs text-white/80">Valor pago</span>
					<span className="text-lg font-semibold tabular-nums">{amount}</span>
				</div>
				<span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
					Pago
				</span>
			</div>
		</div>
	);
}

function PixCard({ amount }: { amount: string }) {
	return (
		<div className="relative flex aspect-[85.6/53.98] w-full flex-col justify-between overflow-hidden rounded-3xl border border-brand-green/40 bg-card p-5 sm:aspect-auto sm:min-h-56 sm:p-6">
			<span
				aria-hidden="true"
				className="pointer-events-none absolute -top-10 -right-10 size-36 rotate-45 rounded-3xl border-8 border-brand-green/25"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute top-24 -right-5 size-12 rotate-45 rounded-xl bg-brand-green/15"
			/>

			<div className="relative flex items-center gap-2.5">
				<span
					aria-hidden="true"
					className="flex size-9 items-center justify-center rounded-xl bg-brand-green/15"
				>
					<span className="size-4 rotate-45 rounded-xs border-3 border-highlight" />
				</span>
				<span className="text-2xl font-semibold tracking-tight text-heading">
					Pix
				</span>
			</div>

			<p className="relative text-sm/5 text-muted-foreground">
				Pagamento instantâneo confirmado
			</p>

			<div className="relative flex items-end justify-between gap-3">
				<div className="flex flex-col">
					<span className="text-xs text-muted-foreground">Valor pago</span>
					<span className="text-lg font-semibold text-heading tabular-nums">
						{amount}
					</span>
				</div>
				<span className="rounded-full bg-brand-green/15 px-3 py-1 text-xs font-semibold text-highlight">
					Pago
				</span>
			</div>
		</div>
	);
}

function PendingCard({
	amount,
	expiresAt,
}: {
	amount: string;
	expiresAt: string;
}) {
	return (
		<div className="flex aspect-[85.6/53.98] w-full flex-col justify-between rounded-3xl border-2 border-dashed border-brand-blue/20 p-5 sm:aspect-auto sm:min-h-56 sm:p-6">
			<span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
				<CreditCardIcon aria-hidden="true" className="size-4.5" />
				Pagamento ainda não confirmado
			</span>
			<div className="flex flex-col">
				<span className="text-xs text-muted-foreground">Valor</span>
				<span className="text-2xl font-semibold text-heading tabular-nums">
					{amount}
				</span>
			</div>
			{expiresAt ? (
				<span className="flex items-center gap-2 text-sm text-heading">
					<ClockIcon aria-hidden="true" className="size-4 text-warning" />
					Pague até <strong className="font-semibold">{expiresAt}</strong>
				</span>
			) : (
				<span className="text-sm text-muted-foreground">
					Assim que o pagamento for confirmado, ele aparece aqui.
				</span>
			)}
		</div>
	);
}

export function PaymentCard({ payment, amount, expiresAt }: PaymentCardProps) {
	const value = formatAmount(amount);

	if (payment?.method === "card") {
		return (
			<CreditCard brand={payment.brand} last4={payment.last4} amount={value} />
		);
	}
	if (payment?.method === "pix") return <PixCard amount={value} />;
	if (payment) {
		return (
			<div className="flex flex-col gap-1">
				<span className="text-xs text-muted-foreground">Valor pago</span>
				<span className="text-2xl font-semibold text-heading tabular-nums">
					{value}
				</span>
			</div>
		);
	}
	return <PendingCard amount={value} expiresAt={expiresAt} />;
}
