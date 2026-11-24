import caixa from "~/@assets/clients/caixa.webp";
import randoncorp from "~/@assets/clients/randoncorp.webp";
import rodobens from "~/@assets/clients/rodobens.webp";
import suhai from "~/@assets/clients/suhai.webp";
import tokioMarine from "~/@assets/clients/tokio-marine.webp";
import { cn } from "~/shared/lib/utils";

const clients = [
	{
		name: "Tokio Marine Seguradora",
		src: tokioMarine,
		width: 109,
		height: 96,
		className: "h-11",
	},
	{
		name: "Suhai Seguradora",
		src: suhai,
		width: 180,
		height: 72,
		className: "h-8",
	},
	{ name: "Caixa", src: caixa, width: 308, height: 72, className: "h-6" },
	{
		name: "Rodobens",
		src: rodobens,
		width: 411,
		height: 72,
		className: "h-5",
	},
	{
		name: "Randoncorp",
		src: randoncorp,
		width: 647,
		height: 72,
		className: "h-4",
	},
];

const copies = [0, 1, 2];

export function ClientsSection() {
	return (
		<section
			aria-labelledby="clientes-titulo"
			className="relative isolate w-full overflow-hidden bg-brand-blue/10 text-heading"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:px-8 lg:py-7">
				<h2
					id="clientes-titulo"
					className="text-center text-[0.6875rem] font-semibold tracking-[0.2em] uppercase"
				>
					Alguns dos nossos clientes que confiam em nossos serviços
				</h2>
				<div className="group flex w-full overflow-hidden mask-x-from-90% mask-x-to-100% [--marquee-duration:30s] motion-reduce:mask-none">
					{copies.map((copy) => (
						<ul
							key={copy}
							aria-hidden={copy > 0 || undefined}
							className={cn(
								"flex shrink-0 animate-marquee items-center group-hover:paused motion-reduce:animate-none",
								copy === 0
									? "motion-reduce:shrink motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:gap-y-4"
									: "motion-reduce:hidden",
							)}
						>
							{clients.map((client) => (
								<li key={client.name} className="pr-12 lg:pr-16">
									<span
										role="img"
										aria-label={client.name}
										style={{
											maskImage: `url(${client.src})`,
											aspectRatio: `${client.width} / ${client.height}`,
										}}
										className={cn(
											client.className,
											"block bg-heading mask-contain mask-center mask-no-repeat",
										)}
									/>
								</li>
							))}
						</ul>
					))}
				</div>
			</div>
		</section>
	);
}
