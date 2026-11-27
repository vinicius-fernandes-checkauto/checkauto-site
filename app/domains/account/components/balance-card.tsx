import { useState } from "react";
import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import { formatAmount } from "~/domains/account/utils/queries";
import {
	EyeIcon,
	EyeOffIcon,
	SearchIcon,
	WalletIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "~/shared/components/ui/tooltip";

export function BalanceCard({ balance }: { balance: number | null }) {
	const [hidden, setHidden] = useState(false);
	const toggleLabel = hidden ? "Mostrar saldo" : "Esconder saldo";

	return (
		<section
			aria-labelledby="saldo-disponivel"
			className="relative isolate flex flex-col gap-6 overflow-hidden rounded-4xl bg-brand-blue p-6 text-white sm:flex-row sm:items-end sm:justify-between sm:p-8"
		>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -top-24 -right-16 -z-10 aspect-896/900 w-72 bg-brand-green/25 mask-contain mask-no-repeat"
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className="pointer-events-none absolute -bottom-32 -left-24 -z-10 aspect-896/900 w-64 bg-white/5 mask-contain mask-no-repeat"
			/>

			<div className="flex flex-col gap-3">
				<h2
					id="saldo-disponivel"
					className="flex items-center gap-2 text-sm font-medium text-mist"
				>
					<span className="flex size-8 items-center justify-center rounded-full bg-white/10">
						<WalletIcon
							aria-hidden="true"
							className="size-4 text-brand-green"
						/>
					</span>
					Saldo disponível
				</h2>
				<div className="flex items-center gap-3">
					<p className="text-4xl/none sm:text-5xl/none font-semibold tracking-tight text-white tabular-nums">
						{hidden ? (
							<>
								<span aria-hidden="true">R$ ••••</span>
								<span className="sr-only">Saldo oculto</span>
							</>
						) : (
							formatAmount(balance ?? 0)
						)}
					</p>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								type="button"
								variant="ghost"
								size="icon-sm"
								aria-pressed={hidden}
								onClick={() => setHidden((value) => !value)}
								className="text-white hover:bg-white/10 hover:text-white"
							>
								{hidden ? (
									<EyeIcon aria-hidden="true" />
								) : (
									<EyeOffIcon aria-hidden="true" />
								)}
								<span className="sr-only">{toggleLabel}</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{toggleLabel}</TooltipContent>
					</Tooltip>
				</div>
				<p className="text-sm/5 text-mist">
					Créditos de pedidos e estornos, usados nas próximas consultas.
				</p>
			</div>

			<Button asChild size="sm" className="self-start sm:self-auto">
				<Link to="/conta/nova-consulta">
					<SearchIcon aria-hidden="true" />
					Nova consulta
				</Link>
			</Button>
		</section>
	);
}
