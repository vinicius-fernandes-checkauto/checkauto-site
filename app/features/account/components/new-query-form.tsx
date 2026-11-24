import { zodResolver } from "@hookform/resolvers/zod";
import { useId } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";

import { plans } from "~/content/plans";
import { AccountSection } from "~/features/account/components/account-section";
import {
	defaultPlanId,
	type NewQuery,
	type NewQueryValues,
	newQuerySchema,
	readPlanState,
} from "~/features/account/lib/new-query";
import { ArrowRightIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { withMask } from "~/shared/lib/form";
import { normalizePlate } from "~/shared/lib/plate";
import { cn } from "~/shared/lib/utils";

export function NewQueryForm() {
	const baseId = useId();
	const navigate = useNavigate();
	const location = useLocation();
	const plateId = `${baseId}-placa`;
	const plateErrorId = `${plateId}-erro`;
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<NewQueryValues, unknown, NewQuery>({
		resolver: zodResolver(newQuerySchema),
		defaultValues: {
			planId: readPlanState(location.state) ?? defaultPlanId,
			plate: "",
		},
	});
	const selected = plans.find((plan) => plan.id === watch("planId"));

	function submit({ plate, planId }: NewQuery) {
		navigate("/carrinho", { state: { cartItem: { plate, planId } } });
	}

	return (
		<form
			noValidate
			onSubmit={handleSubmit(submit)}
			className="flex flex-col gap-5"
		>
			<AccountSection
				id={`${baseId}-pacote`}
				title="1. Escolha o pacote"
				description="Todos trazem as informações essenciais. O Plus é o mais completo."
			>
				<fieldset className="flex flex-col gap-3">
					<legend className="sr-only">Pacote da consulta</legend>
					<div className="grid gap-3 md:grid-cols-3">
						{plans.map((plan) => (
							<label
								key={plan.id}
								className="relative flex cursor-pointer flex-col gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-brand-blue/25 has-checked:border-primary has-checked:bg-brand-green/8 has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-ring"
							>
								{plan.recommended && (
									<span className="absolute -top-2.5 right-4 rounded-full bg-brand-green px-2.5 py-0.5 text-[0.625rem] font-semibold tracking-wider text-brand-blue uppercase">
										Recomendado
									</span>
								)}
								<span className="flex items-start gap-3">
									<input
										type="radio"
										value={plan.id}
										{...register("planId")}
										className="mt-1 size-4.5 shrink-0 accent-primary focus-visible:outline-none"
									/>
									<span className="flex min-w-0 flex-col gap-0.5">
										<span className="text-[0.6875rem] font-semibold tracking-wider text-highlight uppercase">
											{plan.kicker}
										</span>
										<span className="font-semibold text-heading">
											{plan.name}
										</span>
										<span className="text-xs/5 text-muted-foreground">
											{plan.infoCount} informações
										</span>
									</span>
								</span>
								<span className="flex items-baseline gap-1 pl-7.5 text-heading tabular-nums">
									<span className="text-xs font-medium">R$</span>
									<span className="text-2xl/none font-semibold tracking-tight">
										{plan.price}
									</span>
								</span>
							</label>
						))}
					</div>
					<Link
						to="/conta/pacotes"
						className="w-fit px-1 text-sm font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight hover:decoration-2"
					>
						Comparar o que vem em cada pacote
					</Link>
				</fieldset>
			</AccountSection>

			<AccountSection
				id={`${baseId}-placa-secao`}
				title="2. Informe a placa"
				description="Consulte qualquer veículo, inclusive os que você ainda não comprou."
			>
				<div className="flex max-w-md flex-col gap-1.5">
					<label
						htmlFor={plateId}
						className="px-1 text-[0.8125rem] font-medium text-heading"
					>
						Placa do veículo
					</label>
					<div
						className={cn(
							"flex items-center gap-2 rounded-full border bg-card p-1.5 has-[input:focus-visible]:outline-3 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring has-[input:focus-visible]:outline-solid",
							errors.plate ? "border-destructive" : "border-border",
						)}
					>
						<span
							aria-hidden="true"
							className="flex size-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-navy-50 text-[0.625rem] leading-none font-semibold tracking-wider text-heading"
						>
							<span className="h-0.5 w-3.5 rounded-full bg-brand-blue" />
							BR
						</span>
						<input
							id={plateId}
							type="text"
							autoComplete="off"
							autoCapitalize="characters"
							spellCheck={false}
							maxLength={8}
							placeholder="ABC1D23"
							{...withMask(register("plate"), normalizePlate)}
							aria-invalid={errors.plate ? true : undefined}
							aria-describedby={errors.plate ? plateErrorId : undefined}
							className="h-10 min-w-0 flex-1 bg-transparent px-1 text-base font-semibold tracking-[0.12em] text-heading uppercase outline-none placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none"
						/>
					</div>
					{errors.plate && (
						<p
							id={plateErrorId}
							className="px-1 text-sm/5.5 font-medium text-destructive"
						>
							{errors.plate.message}
						</p>
					)}
				</div>
			</AccountSection>

			<div className="flex flex-col gap-3 rounded-3xl bg-brand-blue p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:px-6">
				<p className="flex flex-col gap-0.5">
					<span className="text-sm text-mist">Total da consulta</span>
					<span className="text-2xl/none font-semibold tabular-nums">
						R$ {selected?.price}
						<span className="ml-2 text-sm font-normal text-mist">
							{selected?.name}
						</span>
					</span>
				</p>
				<Button type="submit" className="sm:min-w-56">
					Continuar para o pagamento
					<ArrowRightIcon aria-hidden="true" />
				</Button>
			</div>
		</form>
	);
}
