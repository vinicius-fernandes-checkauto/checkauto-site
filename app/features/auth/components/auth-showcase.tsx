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
		className: "top-[44%] right-[-12%] @max-[17rem]:hidden",
	},
	{ label: "Gravame", className: "bottom-0 left-[52%]" },
	{
		label: "Ocorrência",
		className: "top-[30%] left-[-10%] @max-[17rem]:hidden",
	},
];

const tickRing =
	"absolute inset-[-5%] rounded-full [mask-image:radial-gradient(circle,transparent_63%,#000_63.5%,#000_70%,transparent_70.5%)]";

function Scanner() {
	return (
		<div className="@container absolute top-1/2 left-[58%] aspect-square w-[min(64cqw,80cqh,22rem)] -translate-1/2">
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
				sizes="28rem"
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
		<div className="relative flex justify-center pt-6 text-heading lg:h-[min(44rem,calc(100dvh-4rem))] lg:flex-col lg:justify-start lg:gap-6 lg:overflow-hidden lg:rounded-3xl lg:bg-navy-100/70 lg:px-11 lg:pt-8 lg:pb-9">
			<Link
				to="/"
				className="z-20 inline-flex min-h-11 w-fit items-center rounded-full"
			>
				<img
					src={logo}
					alt="Página inicial da Checkauto"
					width={800}
					height={109}
					className="h-6 w-auto"
				/>
			</Link>

			<div
				aria-hidden="true"
				className="hidden min-h-0 flex-1 flex-col gap-4 lg:flex"
			>
				<div className="relative z-10 flex max-w-[26ch] flex-col gap-3">
					{/* <p className="text-[0.8125rem] font-semibold tracking-[0.16em] text-highlight uppercase">
						Histórico veicular
					</p> */}
					<p className="text-3xl/9 font-normal tracking-tighter [@media(max-height:720px)]:text-2xl/7.5">
						Cada placa conta uma história.{" "}
						<span className="text-highlight">
							Descubra a do seu próximo veículo.
						</span>
					</p>
				</div>

				<div className="[container-type:size] relative min-h-0 flex-1">
					<span className="absolute top-1/2 left-[58%] aspect-square w-[min(90cqw,110cqh,30rem)] -translate-1/2 rounded-full bg-[radial-gradient(circle,--alpha(var(--color-brand-green)/22%),transparent_62%)]" />
					<Scanner />
				</div>

				<p className="relative z-10 flex items-center gap-2 text-sm text-muted-foreground">
					<span className="size-2 rounded-full bg-brand-green shadow-[0_0_0_4px_--alpha(var(--color-brand-green)/22%)]" />
					<strong className="font-semibold text-heading">+250 mil</strong>
					consultas realizadas
				</p>
			</div>
		</div>
	);
}
