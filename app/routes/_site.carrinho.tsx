import { useState } from "react";
import { Link, useLocation } from "react-router";

import { AddPlateForm } from "~/features/site/components/add-plate-form";
import { CartItemRow } from "~/features/site/components/cart-item";
import { CartSummary } from "~/features/site/components/cart-summary";
import {
	type AppliedCoupon,
	type CartItem,
	demoCoupons,
	findPlan,
	formatCents,
	priceToCents,
	readCartItem,
} from "~/features/site/lib/cart";
import {
	ChevronRightIcon,
	ShoppingBagIcon,
	TriangleAlertIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/_site.carrinho";

export const meta: Route.MetaFunction = () => [
	{ title: "Carrinho | Checkauto" },
	{ name: "robots", content: "noindex" },
];

const initialItems: CartItem[] = [
	{ plate: "ABC1D23", planId: "checkauto-plus" },
	{ plate: "XYZ4E56", planId: "checkauto-master" },
];

const defaultPlanId = "checkauto-plus";

export default function Cart() {
	const location = useLocation();
	const [items, setItems] = useState(() => {
		const item = readCartItem(location.state);
		return item ? [item] : initialItems;
	});
	const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

	const count = items.length;
	const subtotalCents = items.reduce(
		(total, item) => total + priceToCents(findPlan(item.planId).price),
		0,
	);
	const discountCents = coupon
		? Math.round((subtotalCents * coupon.percent) / 100)
		: 0;
	const totalCents = subtotalCents - discountCents;

	function addPlate(plate: string) {
		if (items.some((item) => item.plate === plate)) {
			return "Essa placa já está no carrinho.";
		}

		setItems((current) => [...current, { plate, planId: defaultPlanId }]);
		return null;
	}

	function applyCoupon(code: string) {
		const percent = demoCoupons[code];
		if (!percent) return "Cupom inválido ou expirado.";

		setCoupon({ code, percent });
		return null;
	}

	return (
		<div className="bg-background">
			<div className="mx-auto w-full max-w-7xl px-4 pt-2 sm:px-8 lg:pb-18">
				<nav aria-label="Você está em">
					<ol className="flex items-center gap-2 text-[0.8125rem] text-muted-foreground">
						<li>
							<Link to="/" className="transition-colors hover:text-heading">
								Início
							</Link>
						</li>
						<li aria-hidden="true">
							<ChevronRightIcon className="size-3.5" />
						</li>
						<li aria-current="page" className="font-medium text-heading">
							Carrinho
						</li>
					</ol>
				</nav>

				<div className="mt-4 grid grid-cols-[minmax(0,1fr)] items-start gap-7 lg:mt-7 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-8">
					<section aria-labelledby="carrinho-titulo">
						<div className="rounded-3xl border border-border bg-card">
							<div className="flex items-center justify-between gap-4 px-4 pt-4.5 pb-3.5 sm:px-7 sm:pt-6 sm:pb-5">
								<h1
									id="carrinho-titulo"
									className="flex items-start gap-1.5 text-2xl/8 font-semibold tracking-tight text-heading lg:text-[1.75rem]"
								>
									Carrinho
									<span className="text-[0.8125rem]/none mt-0.5 font-medium tracking-normal text-muted-foreground">
										<span className="sr-only">, </span>
										{String(count).padStart(2, "0")}
										<span className="sr-only">
											{count === 1 ? " item" : " itens"}
										</span>
									</span>
								</h1>
								{count > 1 && (
									<button
										type="button"
										onClick={() => setItems([])}
										className="min-h-11 text-[0.8125rem] font-medium text-destructive hover:underline hover:underline-offset-4"
									>
										Remover tudo
									</button>
								)}
							</div>

							{count === 0 ? (
								<div className="flex flex-col items-center gap-3 border-t border-border px-6 pt-12 pb-10 text-center">
									<span className="flex size-15 items-center justify-center rounded-full bg-accent text-highlight">
										<ShoppingBagIcon aria-hidden="true" className="size-6.5" />
									</span>
									<h2 className="text-xl font-semibold text-heading">
										Seu carrinho está vazio
									</h2>
									<p className="max-w-[36ch] text-sm text-muted-foreground">
										Digite uma placa abaixo para consultar o histórico do
										veículo.
									</p>
								</div>
							) : (
								<ul>
									{items.map((item) => (
										<CartItemRow
											key={item.plate}
											plate={item.plate}
											planId={item.planId}
											onRemove={() =>
												setItems((current) =>
													current.filter((entry) => entry.plate !== item.plate),
												)
											}
										/>
									))}
								</ul>
							)}

							<AddPlateForm
								label={
									count === 0 ? "Consultar uma placa" : "Consultar outra placa"
								}
								onAdd={addPlate}
							/>
						</div>

						{count > 0 && (
							<p className="mt-3.5 flex items-start gap-2.5 px-2 text-[0.8125rem]/5 text-muted-foreground">
								<TriangleAlertIcon
									aria-hidden="true"
									className="mt-px size-4 shrink-0 text-warning"
								/>
								Confira as placas antes de continuar. Depois do pagamento, a
								consulta não pode ser trocada para outra placa.
							</p>
						)}
					</section>

					<CartSummary
						count={count}
						subtotalCents={subtotalCents}
						discountCents={discountCents}
						coupon={coupon}
						onApplyCoupon={applyCoupon}
						onRemoveCoupon={() => setCoupon(null)}
					/>
				</div>

				<div className="sticky bottom-0 z-30 -mx-4 mt-8 flex items-center gap-3.5 border-t border-border bg-card px-4 pt-3 pb-4 shadow-[0_-10px_24px_-16px_rgb(0_38_71/0.3)] sm:-mx-8 sm:px-8 lg:hidden">
					<p className="flex flex-col text-xs text-muted-foreground">
						Total
						<strong className="text-xl font-semibold text-heading">
							R$ {formatCents(totalCents)}
						</strong>
					</p>
					<Button type="button" disabled={count === 0} className="flex-1">
						Finalizar compra
					</Button>
				</div>
			</div>
		</div>
	);
}
