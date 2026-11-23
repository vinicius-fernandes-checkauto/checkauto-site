import page1 from "~/assets/home/extrato-modelo-1.webp";
import page2 from "~/assets/home/extrato-modelo-2.webp";
import page3 from "~/assets/home/extrato-modelo-3.webp";
import { cn } from "~/shared/lib/utils";

const pages = [page1, page2, page3];

export function StatementPreview({ className }: { className?: string }) {
	return (
		<div
			role="img"
			aria-label="Prévia de um extrato real da Checkauto, com dados pessoais tarjados: resumo da consulta, dados e histórico do veículo"
			className={cn(
				"flex h-92 w-full flex-col overflow-hidden rounded-2xl bg-slate-200 text-secondary",
				className,
			)}
		>
			<div className="flex shrink-0 items-center gap-2 bg-slate-700 px-3 py-1.5 text-[0.625rem] text-white/85">
				<span className="size-2 rounded-full bg-white/30" />
				<span className="truncate font-medium">extrato-checkauto.pdf</span>
				<span className="ml-auto text-white/60 tabular-nums">1 / 8</span>
			</div>

			<div className="min-h-0 flex-1 overflow-hidden px-3 pt-3">
				<div className="flex animate-pdf-scroll flex-col gap-2 pb-3 motion-reduce:animate-none">
					{pages.map((src) => (
						<img
							key={src}
							src={src}
							alt=""
							width={640}
							height={829}
							loading="lazy"
							className="w-full bg-white shadow-[0_2px_10px_rgb(0_0_0/0.18)]"
						/>
					))}
				</div>
			</div>
		</div>
	);
}
