import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import {
	type CreditEntry,
	formatCurrency,
	formatDate,
} from "~/features/account/lib/credits";
import {
	ArrowDownLeftIcon,
	ArrowUpRightIcon,
	ClockIcon,
	SearchIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";

type CreditsSummaryProps = {
	balance: number;
	received: number;
	used: number;
	nextExpiring?: CreditEntry;
};

export function CreditsSummary({
	balance,
	received,
	used,
	nextExpiring,
}: CreditsSummaryProps) {
	return (
		<section
			aria-labelledby="creditos-saldo"
			className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
		>
			<div className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-4xl bg-brand-blue p-6 text-white sm:p-8">
				<span
					aria-hidden="true"
					style={{ maskImage: `url(${ring})` }}
					className="pointer-events-none absolute -right-20 -bottom-28 aspect-896/900 w-64 bg-brand-green/25 mask-contain mask-no-repeat"
				/>
				<div className="relative flex flex-col gap-2">
					<h2 id="creditos-saldo" className="text-sm font-medium text-mist">
						Saldo disponível
					</h2>
					<p className="text-4xl/none sm:text-5xl/none font-semibold tracking-tight text-white">
						{formatCurrency(balance)}
					</p>
					{nextExpiring?.expiresAt && (
						<p className="mt-2 flex items-center gap-2 text-sm/5 text-mist">
							<ClockIcon
								aria-hidden="true"
								className="size-4 shrink-0 text-brand-green"
							/>
							<span>
								<strong className="font-semibold text-white">
									{formatCurrency(nextExpiring.amount)}
								</strong>{" "}
								expiram em {formatDate(nextExpiring.expiresAt)}
							</span>
						</p>
					)}
				</div>
				<Button asChild size="sm" className="relative self-start">
					<Link to="/#placa">
						<SearchIcon aria-hidden="true" />
						Usar em uma consulta
					</Link>
				</Button>
			</div>

			<dl className="grid grid-cols-2 gap-4 md:grid-cols-1">
				<div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5">
					<dt className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
						<span className="flex size-8 items-center justify-center rounded-full bg-brand-green/15 text-highlight">
							<ArrowDownLeftIcon aria-hidden="true" className="size-4" />
						</span>
						Entradas
					</dt>
					<dd className="text-2xl/none font-semibold tracking-tight text-heading">
						{formatCurrency(received)}
					</dd>
				</div>
				<div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-5">
					<dt className="flex items-center gap-2.5 text-sm font-medium text-muted-foreground">
						<span className="flex size-8 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
							<ArrowUpRightIcon aria-hidden="true" className="size-4" />
						</span>
						Usados
					</dt>
					<dd className="text-2xl/none font-semibold tracking-tight text-heading">
						{formatCurrency(used)}
					</dd>
				</div>
			</dl>
		</section>
	);
}
