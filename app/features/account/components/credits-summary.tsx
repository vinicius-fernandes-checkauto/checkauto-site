import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import {
	type CreditEntry,
	formatCurrency,
	formatDate,
} from "~/features/account/lib/credits";
import { ClockIcon, SearchIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";

type CreditsSummaryProps = {
	balance: number;
	nextExpiring?: CreditEntry;
};

export function CreditsSummary({ balance, nextExpiring }: CreditsSummaryProps) {
	return (
		<section aria-labelledby="creditos-saldo">
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
		</section>
	);
}
