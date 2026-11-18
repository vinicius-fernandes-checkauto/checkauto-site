import logoWhite from "~/assets/brand/checkauto-logo-white.png";
import {
	CarFrontIcon,
	CircleCheckIcon,
	GaugeIcon,
	GavelIcon,
	type LucideIcon,
	TriangleAlertIcon,
	WrenchIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

type Status = "ok" | "warn";

const vehicle = [
	["Placa", "ABC1D23"],
	["Marca/Modelo", "JEEP/COMPASS LONGITUDE"],
	["Chassi", "9BD•••••••••04821"],
	["Ano/Fabricação", "2020"],
	["Cor", "PRATA"],
	["Ano/Modelo", "2021"],
];

const summary: { title: string; icon: LucideIcon; status: Status }[] = [
	{ title: "Oferta em leilão", icon: GavelIcon, status: "warn" },
	{ title: "Indício de ocorrência", icon: CarFrontIcon, status: "ok" },
	{ title: "Informação de recall", icon: WrenchIcon, status: "ok" },
	{ title: "Histórico de KM", icon: GaugeIcon, status: "ok" },
];

const vehicleData = [
	["Combustível", "Álcool / Gasolina", "Potência", "166"],
	["Tipo de Veículo", "AUTOMÓVEL", "Cilindradas", "2000"],
	["Espécie", "PASSAGEIRO", "Município", "SÃO PAULO"],
	["Nacionalidade", "NACIONAL", "Situação do Chassi", "NORMAL"],
];

const history: { title: string; status: Status; text: string }[] = [
	{
		title: "Oferta em leilão",
		status: "warn",
		text: "1 registro encontrado: lote 214, 03/2024, pequena monta.",
	},
	{
		title: "Indício de ocorrência",
		status: "ok",
		text: "Não há registro nas bases consultadas.",
	},
	{
		title: "Informação de recall",
		status: "ok",
		text: "Não há registro nas bases consultadas.",
	},
];

function StatusIcon({
	status,
	className,
}: {
	status: Status;
	className?: string;
}) {
	return status === "ok" ? (
		<CircleCheckIcon className={cn("text-brand-green", className)} />
	) : (
		<TriangleAlertIcon className={cn("text-warning", className)} />
	);
}

function SectionBar({ children }: { children: string }) {
	return (
		<p className="bg-primary py-0.5 text-center text-[0.5rem] font-semibold tracking-wide text-primary-foreground uppercase">
			{children}
		</p>
	);
}

export function StatementPreview({ className }: { className?: string }) {
	return (
		<div
			role="img"
			aria-label="Prévia do extrato da Checkauto com dados fictícios: resumo da consulta, dados e histórico do veículo"
			className={cn(
				"h-92 w-full overflow-hidden rounded-2xl bg-muted px-5 pt-4 surface-default text-secondary",
				className,
			)}
		>
			<div className="flex animate-pdf-scroll flex-col gap-2 rounded-sm bg-white p-3 motion-reduce:animate-none">
				<div className="flex overflow-hidden rounded-md border border-border">
					<div className="flex w-24 shrink-0 items-center justify-center bg-secondary px-2">
						<img
							src={logoWhite}
							alt=""
							width={800}
							height={109}
							className="h-3 w-auto"
						/>
					</div>
					<div className="flex-1">
						<p className="bg-primary px-2 py-0.5 text-[0.5625rem] font-semibold text-primary-foreground">
							JEEP/COMPASS LONGITUDE 2.0
						</p>
						<dl className="grid grid-cols-2 gap-x-3 px-2 py-1 text-[0.4375rem] leading-relaxed">
							{vehicle.map(([label, value]) => (
								<div key={label} className="flex gap-1.5">
									<dt className="w-14 shrink-0 font-semibold">{label}</dt>
									<dd className="truncate text-muted-foreground">{value}</dd>
								</div>
							))}
						</dl>
					</div>
				</div>

				<SectionBar>Resumo da consulta</SectionBar>
				<ul className="grid grid-cols-4 gap-1.5">
					{summary.map(({ title, icon: Icon, status }) => (
						<li
							key={title}
							className="flex flex-col overflow-hidden rounded-md border border-border"
						>
							<span className="flex items-center gap-1 bg-secondary px-1.5 py-1 text-[0.4375rem] leading-tight font-semibold text-secondary-foreground uppercase">
								<Icon aria-hidden="true" className="size-2.5 shrink-0" />
								{title}
							</span>
							<span className="flex justify-center py-1.5">
								<StatusIcon status={status} className="size-4" />
							</span>
						</li>
					))}
				</ul>
				<p className="mx-auto flex items-center gap-2 rounded-full bg-muted px-2.5 py-0.5 text-[0.4375rem] text-muted-foreground">
					Legenda:
					<span className="flex items-center gap-0.5">
						<StatusIcon status="ok" className="size-2" /> Nada consta
					</span>
					<span className="flex items-center gap-0.5">
						<StatusIcon status="warn" className="size-2" /> Atenção
					</span>
				</p>

				<SectionBar>Dados do veículo</SectionBar>
				<div className="overflow-hidden rounded-md border border-border">
					<p className="bg-secondary px-2 py-0.5 text-[0.5rem] font-medium text-secondary-foreground">
						DADOS DO VEÍCULO
					</p>
					<table className="w-full text-[0.4375rem] leading-relaxed">
						<tbody>
							{vehicleData.map(([l1, v1, l2, v2]) => (
								<tr key={l1}>
									<td className="px-2 text-muted-foreground">{l1}</td>
									<td>{v1}</td>
									<td className="text-muted-foreground">{l2}</td>
									<td className="pr-2">{v2}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				<SectionBar>Histórico do veículo</SectionBar>
				{history.map(({ title, status, text }) => (
					<div
						key={title}
						className="overflow-hidden rounded-md border border-border"
					>
						<p className="flex items-center gap-1.5 bg-secondary px-2 py-0.5 text-[0.5rem] font-medium text-secondary-foreground uppercase">
							<StatusIcon status={status} className="size-2.5" />
							{title}
						</p>
						<p className="px-2 py-1 text-[0.4375rem] text-muted-foreground">
							{text}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}
