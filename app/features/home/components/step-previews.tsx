import { useEffect, useState } from "react";

import { plans } from "~/shared/config/plans";
import { cn } from "~/shared/lib/utils";

const PLATE = "ABC1D23";

function prefersReducedMotion() {
	return (
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-reduced-motion: reduce)").matches
	);
}

function useLoop(steps: number[], enabled = true) {
	const [index, setIndex] = useState(steps.length - 1);

	useEffect(() => {
		if (!enabled || prefersReducedMotion()) return;

		let current = 0;
		let timer: ReturnType<typeof setTimeout>;

		function tick() {
			setIndex(current);
			const delay = steps[current];
			current = (current + 1) % steps.length;
			timer = setTimeout(tick, delay);
		}

		setIndex(0);
		timer = setTimeout(tick, steps[0]);
		return () => clearTimeout(timer);
	}, [steps, enabled]);

	return index;
}

const plateTimeline = [
	700,
	...Array.from({ length: PLATE.length - 1 }, () => 170),
	1100,
	500,
	1800,
];

export function PlateTypingPreview() {
	const frame = useLoop(plateTimeline);
	const typed = Math.min(frame, PLATE.length);
	const pressed = frame === PLATE.length + 1;
	const done = frame >= PLATE.length + 2;

	return (
		<div
			role="img"
			aria-label="Animação do campo de placa sendo preenchido com ABC1D23 e o botão Consultar sendo acionado"
			className="flex flex-col gap-3 rounded-3xl bg-white p-4 surface-default text-secondary"
		>
			<p className="flex items-center gap-2 text-xs text-muted-foreground">
				<span className="size-2 rounded-full bg-brand-green" />
				checkauto.com.br
			</p>
			<div className="flex items-center gap-2 rounded-full border border-border bg-card p-1.5">
				<span className="flex size-10 shrink-0 flex-col items-center justify-center gap-0.5 rounded-full bg-navy-50 text-[0.625rem] font-semibold tracking-wider">
					<span className="h-0.5 w-3.5 rounded-full bg-secondary" />
					BR
				</span>
				<span className="flex min-w-0 flex-1 items-center text-base font-semibold tracking-[0.14em]">
					{typed === 0 ? (
						<span className="font-normal tracking-normal text-muted-foreground">
							Informe a placa
						</span>
					) : (
						PLATE.slice(0, typed)
					)}
					{!done && (
						<span className="ml-0.5 h-5 w-0.5 animate-pulse bg-primary" />
					)}
				</span>
				<span
					className={cn(
						"flex h-10 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform duration-150",
						pressed && "scale-95 brightness-90",
					)}
				>
					Consultar
				</span>
			</div>
			<p
				className={cn(
					"flex items-center gap-1.5 px-2 text-xs font-medium text-success transition-opacity duration-300",
					done ? "opacity-100" : "opacity-0",
				)}
			>
				Placa válida · buscando o histórico
			</p>
		</div>
	);
}

const plansTimeline = [900, 900, 2600];

export function PlansPickingPreview() {
	const selected = useLoop(plansTimeline);

	return (
		<div
			role="img"
			aria-label="Animação da escolha de pacote, parando no Checkauto Plus"
			className="flex flex-col gap-3 rounded-3xl bg-white p-4 surface-default text-secondary"
		>
			<p className="px-1 text-sm font-semibold">
				Escolha o pacote para a placa ABC1D23
			</p>
			<div className="grid grid-cols-3 gap-2">
				{plans.map((plan, index) => {
					const active = index === selected;

					return (
						<div
							key={plan.id}
							className={cn(
								"flex flex-col gap-1 rounded-2xl border p-2.5 transition-colors duration-300",
								active
									? "border-secondary bg-secondary text-secondary-foreground"
									: "border-border",
							)}
						>
							<span className="text-sm font-semibold">{plan.shortName}</span>
							<span className="text-xs tabular-nums">R$ {plan.price}</span>
							<span
								className={cn(
									"mt-1.5 flex h-6 items-center justify-center rounded-full text-[0.625rem] font-semibold transition-colors duration-300",
									active ? "bg-brand-green text-secondary" : "bg-muted",
								)}
							>
								{active ? "Selecionado" : "Escolher"}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
