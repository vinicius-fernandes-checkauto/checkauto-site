import { findPlan } from "~/features/cart/lib/cart";
import { ChevronDownIcon, Trash2Icon } from "~/shared/components/icons";
import { LicensePlate } from "~/shared/components/license-plate";
import { type Plan, plans } from "~/shared/config/plans";
import { cn } from "~/shared/lib/utils";

type CartItemRowProps = {
	plate: string;
	planId: Plan["id"];
	onPlanChange: (planId: Plan["id"]) => void;
	onRemove: () => void;
};

export function CartItemRow({
	plate,
	planId,
	onPlanChange,
	onRemove,
}: CartItemRowProps) {
	const plan = findPlan(planId);

	return (
		<li className="flex items-start gap-3 border-t border-border p-4 sm:items-center sm:gap-5 sm:px-7 sm:py-5">
			<span
				aria-hidden="true"
				className="flex h-18 w-19 shrink-0 items-center justify-center rounded-2xl bg-muted sm:h-24 sm:w-28"
			>
				<LicensePlate
					plate={plate}
					className="max-sm:rounded-md max-sm:text-[0.6875rem]"
				/>
			</span>

			<div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
				<span
					className={cn(
						"rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-semibold tracking-wider uppercase",
						plan.recommended
							? "border-transparent bg-accent text-highlight"
							: "border-border text-muted-foreground",
					)}
				>
					{plan.kicker}
				</span>
				<h2 className="text-base font-semibold tracking-tight text-heading sm:text-lg">
					{plan.name}
				</h2>
				<div className="flex flex-col gap-0.5 text-[0.8125rem] text-muted-foreground sm:flex-row sm:items-center sm:gap-4.5">
					<span>
						Placa:{" "}
						<strong className="font-semibold tracking-wider text-heading">
							{plate}
						</strong>
					</span>
					<label className="relative inline-flex items-center gap-1">
						Pacote:
						<select
							aria-label={`Pacote da placa ${plate}`}
							value={plan.id}
							onChange={(event) => onPlanChange(event.target.value)}
							className="cursor-pointer appearance-none bg-transparent py-0.5 pr-5 font-semibold text-heading outline-none focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
						>
							{plans.map((option) => (
								<option key={option.id} value={option.id}>
									{option.shortName} · R$ {option.price}
								</option>
							))}
						</select>
						<ChevronDownIcon
							aria-hidden="true"
							className="pointer-events-none absolute right-0 size-3.5"
						/>
					</label>
				</div>
			</div>

			<div className="flex flex-col items-end gap-2 sm:gap-2.5">
				<p className="text-[1.0625rem] font-semibold tracking-tight whitespace-nowrap text-heading sm:text-xl">
					<span className="mr-0.5 text-[0.8125rem] font-medium">R$</span>
					{plan.price}
				</p>
				<button
					type="button"
					aria-label={`Remover consulta da placa ${plate}`}
					onClick={onRemove}
					className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-red-200 hover:text-destructive focus-visible:outline-2 focus-visible:outline-ring"
				>
					<Trash2Icon aria-hidden="true" className="size-4" />
				</button>
			</div>
		</li>
	);
}
