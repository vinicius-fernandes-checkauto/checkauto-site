import { BadgeCheckIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

const items = [
	"Restrições",
	"Recall",
	"Indício de Sinistro",
	"Histórico de Roubo e Furto",
];

const copies = [0, 1, 2];

export function MarqueeSection() {
	return (
		<section
			aria-label="Itens verificados na consulta"
			className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:py-12"
		>
			<div className="group flex overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:mask-none">
				{copies.map((copy) => (
					<ul
						key={copy}
						aria-hidden={copy > 0 || undefined}
						className={cn(
							"flex shrink-0 animate-marquee items-center group-hover:paused motion-reduce:animate-none",
							copy === 0
								? "motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-3"
								: "motion-reduce:hidden",
						)}
					>
						{items.map((item) => (
							<li
								key={item}
								className="flex items-center gap-3 pr-10 text-xl font-medium whitespace-nowrap text-heading lg:pr-14 lg:text-2xl"
							>
								<BadgeCheckIcon
									aria-hidden="true"
									className="size-7 shrink-0 fill-highlight text-background"
								/>
								{item}
							</li>
						))}
					</ul>
				))}
			</div>
		</section>
	);
}
