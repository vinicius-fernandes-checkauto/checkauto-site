import authShowcase from "~/@assets/auth-showcase.svg";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";

export function AuthShowcase() {
	return (
		<div className="relative flex justify-center pt-6 text-heading lg:h-[min(44rem,calc(100dvh-4rem))] lg:flex-col lg:justify-start lg:gap-6 lg:overflow-hidden lg:rounded-3xl lg:bg-brand-blue/6 lg:px-11 lg:pt-8 lg:pb-9">
			<CheckautoLogo />

			<div
				aria-hidden="true"
				className="hidden min-h-0 flex-1 flex-col gap-4 lg:flex"
			>
				<div className="relative z-10 flex max-w-[26ch] flex-col gap-3">
					<p className="text-3xl/9 font-normal tracking-tighter [@media(max-height:720px)]:text-2xl/7.5">
						Cada placa conta uma história.{" "}
						<span className="text-highlight">
							Descubra a do seu próximo veículo.
						</span>
					</p>
				</div>

				<div className="@container-size relative min-h-0 flex-1">
					<img
						src={authShowcase}
						alt=""
						width={560}
						height={520}
						className="absolute inset-0 size-full object-contain"
					/>
				</div>

				<p className="relative z-10 flex items-center gap-2 text-sm text-muted-foreground">
					<span className="size-2 rounded-full bg-brand-green ring-4 ring-brand-green/20" />
					<strong className="font-semibold text-heading">+13 milhões</strong>
					consultas realizadas
				</p>
			</div>
		</div>
	);
}
