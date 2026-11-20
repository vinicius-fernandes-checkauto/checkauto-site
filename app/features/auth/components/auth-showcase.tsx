import { Link } from "react-router";

import carTopGray from "~/assets/auth/car-top-gray.webp";
import carTopGray1000 from "~/assets/auth/car-top-gray-1000.webp";
import logo from "~/assets/brand/checkauto-logo.png";
import { CheckIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

const scanned = [
	{ label: "Leilão", className: "top-[2%] left-[62%]" },
	{
		label: "Roubo e furto",
		className: "top-[44%] right-[-12%] hidden lg:flex",
	},
	{ label: "Gravame", className: "bottom-0 left-[52%]" },
	{
		label: "Ocorrência",
		className: "top-[30%] left-[-10%] hidden lg:flex",
	},
];

const tickRing =
	"absolute inset-[-5%] rounded-full [mask-image:radial-gradient(circle,transparent_63%,#000_63.5%,#000_70%,transparent_70.5%)]";

function Scanner() {
	return (
		<div className="absolute top-[52%] left-1/2 aspect-square w-75 -translate-1/2 lg:top-[66%] lg:left-[62%] lg:w-[min(58%,22rem)]">
			<span className="absolute inset-0 rounded-full border border-brand-blue/10" />
			<span className="absolute inset-[14%] rounded-full border border-brand-blue/8" />
			<span className="absolute inset-[28%] rounded-full border border-dashed border-brand-blue/14" />
			<span
				className={cn(
					tickRing,
					"bg-[repeating-conic-gradient(--alpha(var(--color-brand-blue)/18%)_0_1.6deg,transparent_1.6deg_7.5deg)]",
				)}
			/>
			<span
				className={cn(
					tickRing,
					"bg-[repeating-conic-gradient(from_-60deg,var(--color-brand-green)_0_1.6deg,transparent_1.6deg_7.5deg)] [mask-image:radial-gradient(circle,transparent_63%,#000_63.5%,#000_70%,transparent_70.5%),conic-gradient(from_-60deg,#000_0_120deg,transparent_120deg)] mask-intersect",
				)}
			/>
			<span className="absolute inset-0 rounded-full bg-[conic-gradient(transparent_0deg_300deg,--alpha(var(--color-brand-green)/28%)_358deg,transparent_360deg)]">
				<span className="absolute top-0 left-1/2 -ml-px h-1/2 w-0.5 origin-bottom -rotate-2 bg-linear-to-t from-transparent to-brand-green" />
			</span>

			<img
				src={carTopGray}
				srcSet={`${carTopGray1000} 1000w, ${carTopGray} 1898w`}
				sizes="(min-width: 1024px) 28rem, 15rem"
				alt=""
				width={1898}
				height={867}
				className="absolute top-1/2 left-1/2 w-[80%] max-w-none -translate-1/2 -rotate-24 drop-shadow-[0_30px_34px_--alpha(var(--color-brand-blue-dark)/30%)]"
			/>

			{scanned.map(({ label, className }) => (
				<span
					key={label}
					className={cn(
						"absolute z-10 flex items-center gap-1.5 rounded-full bg-card py-1 pr-2.5 pl-1 text-[0.6875rem] font-medium whitespace-nowrap text-heading shadow-[0_8px_20px_-10px_--alpha(var(--color-brand-blue-dark)/35%)] lg:gap-2 lg:pr-3 lg:pl-1.5 lg:text-[0.8125rem]",
						className,
					)}
				>
					<span className="flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground lg:size-5">
						<CheckIcon strokeWidth={3.5} className="size-2.5 lg:size-3" />
					</span>
					{label}
				</span>
			))}

			<span className="absolute bottom-[10%] left-[6%] z-10 flex -rotate-6 flex-col overflow-hidden rounded-lg border-2 border-brand-blue-dark bg-white text-xs font-semibold tracking-[0.14em] text-brand-blue-dark shadow-[0_18px_30px_-12px_rgb(0_0_0/0.5)] lg:text-base">
				<span className="flex justify-between bg-brand-blue px-1.5 text-[0.4375rem] tracking-[0.2em] text-white">
					<span>BR</span>
					<span>BRASIL</span>
					<span />
				</span>
				<span className="px-3 pt-0.5 pb-1">ABC1D23</span>
			</span>
		</div>
	);
}

export function AuthShowcase() {
	return (
		<div className="relative flex justify-center pt-6 text-heading lg:block lg:h-[min(44rem,calc(100dvh-4rem))] lg:overflow-hidden lg:rounded-3xl lg:bg-navy-100/70 lg:pt-0">
			<Link
				to="/"
				className="z-20 inline-flex min-h-11 items-center rounded-full lg:absolute lg:top-8 lg:left-11"
			>
				<img
					src={logo}
					alt="Página inicial da Checkauto"
					width={800}
					height={109}
					className="h-6 w-auto"
				/>
			</Link>

			<div aria-hidden="true" className="hidden lg:block">
				<span className="absolute top-[52%] left-1/2 aspect-square w-[70%] -translate-1/2 rounded-full bg-[radial-gradient(circle,--alpha(var(--color-brand-green)/22%),transparent_62%)] lg:top-[66%] lg:left-[62%] lg:w-[56%]" />

				<div className="absolute top-24 left-11 z-10 hidden max-w-[26ch] flex-col gap-3 lg:flex">
					{/* <p className="text-[0.8125rem] font-semibold tracking-[0.16em] text-highlight uppercase">
						Histórico veicular
					</p> */}
					<p className="text-3xl/9 font-normal tracking-tighter">
						Cada placa conta uma história.{" "}
						<span className="text-highlight">
							Descubra a do seu próximo veículo.
						</span>
					</p>
				</div>

				<Scanner />

				<p className="absolute bottom-9 left-11 z-10 hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
					<span className="size-2 rounded-full bg-brand-green shadow-[0_0_0_4px_--alpha(var(--color-brand-green)/22%)]" />
					<strong className="font-semibold text-heading">+250 mil</strong>
					consultas realizadas
				</p>
			</div>
		</div>
	);
}
