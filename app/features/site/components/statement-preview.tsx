import logoWhite from "~/assets/brand/checkauto-logo-white.png";
import {
	CarFrontIcon,
	CheckIcon,
	GaugeIcon,
	GavelIcon,
	type LucideIcon,
	WrenchIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

type Status = "ok" | "warn" | "danger" | "off";

const header = [
	["Placa", "ABC1D23", "Marca/Modelo", "JEEP/COMPASS LONG 2.0"],
	["Chassi", "9BD•••••••••04821", "Ano/Fabricação", "2020"],
	["Cor", "PRATA", "Ano/Modelo", "2021"],
];

const meta = [
	["Código da consulta", "48213917"],
	["Consultado por", "consulta avulsa"],
	["Data e Horário", "18/11/2026 14:32"],
	["Chave da consulta", "Placa: ABC1D23"],
];

const summary: { title: string; icon: LucideIcon; status: Status }[] = [
	{ title: "Oferta em leilão", icon: GavelIcon, status: "warn" },
	{ title: "Indício de ocorrência", icon: CarFrontIcon, status: "ok" },
	{ title: "Informação de recall", icon: WrenchIcon, status: "ok" },
	{ title: "Histórico de KM", icon: GaugeIcon, status: "ok" },
];

const legend: { label: string; status: Status }[] = [
	{ label: "Nada consta", status: "ok" },
	{ label: "Atenção", status: "warn" },
	{ label: "Atenção redobrada", status: "danger" },
	{ label: "Sistema indisponível", status: "off" },
];

const vehicleData = [
	["Placa", "ABC1D23", "Número do Motor", "552•••••••9268"],
	["Chassi", "9BD•••••••••04821", "Número da Caixa de Câmbio", "—"],
	["Marca/Modelo", "JEEP/COMPASS LONG 2.0", "Número da Carroceria", "—"],
	["Ano de Fabricação", "2020", "Potência", "166"],
	["Ano do Modelo", "2021", "Cilindradas", "1995"],
	["Cor Predominante", "PRATA", "Capacidade de Passageiros", "5"],
	["Combustível", "Álcool / Gasolina", "Número de Eixos", "2"],
	["Tipo de Veículo", "AUTOMÓVEL", "Capacidade de Carga", "0"],
	["Espécie", "PASSAGEIRO", "Município", "SÃO PAULO"],
	["Nacionalidade", "NACIONAL", "Situação do Chassi", "NORMAL"],
	["Fabricante", "JEEP", "", ""],
];

const history: { title: string; status: Status; text: string }[] = [
	{
		title: "Oferta em leilão",
		status: "warn",
		text: "1 registro encontrado · Lote 214 · 03/2024 · Condição: pequena monta.",
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
	{
		title: "Histórico de KM",
		status: "ok",
		text: "Última leitura: 63.400 km em 09/2025 · sem indício de adulteração.",
	},
];

const statusTone: Record<Status, string> = {
	ok: "bg-brand-green text-white",
	warn: "bg-warning text-white",
	danger: "bg-destructive text-white",
	off: "bg-slate-400 text-white",
};

function StatusDot({
	status,
	className,
}: {
	status: Status;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"flex shrink-0 items-center justify-center rounded-full text-[0.625rem] leading-none font-bold",
				statusTone[status],
				className,
			)}
		>
			{status === "ok" ? (
				<CheckIcon className="size-[70%] stroke-[3.5]" />
			) : status === "off" ? (
				"?"
			) : (
				"!"
			)}
		</span>
	);
}

function GreenBar({ children }: { children: string }) {
	return (
		<p className="bg-primary py-1 text-center text-xs font-semibold tracking-wide text-primary-foreground uppercase">
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
				"flex h-92 w-full flex-col overflow-hidden rounded-2xl bg-slate-200 text-secondary",
				className,
			)}
		>
			<div className="flex shrink-0 items-center gap-2 bg-slate-700 px-3 py-1.5 text-[0.625rem] text-white/85">
				<span className="size-2 rounded-full bg-white/30" />
				<span className="truncate font-medium">extrato-ABC1D23.pdf</span>
				<span className="ml-auto text-white/60 tabular-nums">1 / 2</span>
				<span className="rounded-sm bg-white/15 px-1 tabular-nums">60%</span>
			</div>

			<div className="min-h-0 flex-1 overflow-hidden px-3 pt-3">
				<div className="animate-pdf-scroll pb-10 motion-reduce:animate-none">
					<article className="mx-auto flex w-140 zoom-[0.58] flex-col gap-3.5 bg-white px-6 pt-6 pb-5 font-sans text-[0.6875rem] leading-snug text-slate-800 shadow-[0_2px_10px_rgb(0_0_0/0.18)]">
						<div className="flex overflow-hidden rounded-2xl border border-slate-200">
							<div className="flex w-40 shrink-0 items-center justify-center bg-secondary px-4">
								<img
									src={logoWhite}
									alt=""
									width={800}
									height={109}
									className="h-5 w-auto"
								/>
							</div>
							<div className="flex-1">
								<p className="bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
									JEEP/COMPASS LONGITUDE 2.0
								</p>
								<dl className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 px-3 py-2">
									{header.flat().map((item, index) => (
										<span
											key={`${item}-${index.toString()}`}
											className={cn(
												"truncate",
												index % 2 === 0
													? "font-semibold text-slate-900"
													: "text-slate-600",
											)}
										>
											{item}
										</span>
									))}
								</dl>
							</div>
						</div>

						<p className="flex flex-wrap justify-center gap-x-2.5 text-[0.5625rem] text-slate-600">
							{meta.map(([label, value], index) => (
								<span key={label} className="flex gap-1">
									{index > 0 && <span className="text-slate-300">|</span>}
									<b className="font-semibold text-slate-800">{label}:</b>
									{value}
								</span>
							))}
						</p>

						<GreenBar>Resumo da consulta</GreenBar>
						<ul className="grid grid-cols-4 gap-2.5">
							{summary.map(({ title, icon: Icon, status }) => (
								<li
									key={title}
									className="flex flex-col overflow-hidden rounded-xl border border-slate-200"
								>
									<span className="flex min-h-9 items-center gap-1.5 bg-secondary px-2 py-1.5 text-[0.5625rem] leading-tight font-semibold text-secondary-foreground uppercase">
										<Icon aria-hidden="true" className="size-4 shrink-0" />
										{title}
									</span>
									<span className="flex justify-center py-2">
										<StatusDot status={status} className="size-5" />
									</span>
								</li>
							))}
						</ul>
						<p className="mx-auto flex items-center gap-3 rounded-full bg-slate-100 px-4 py-1 text-[0.625rem] text-slate-600">
							Legenda:
							{legend.map(({ label, status }) => (
								<span key={label} className="flex items-center gap-1">
									<StatusDot status={status} className="size-3" />
									{label}
								</span>
							))}
						</p>

						<GreenBar>Dados do veículo</GreenBar>
						<div className="overflow-hidden rounded-2xl border border-slate-200">
							<p className="bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
								DADOS DO VEÍCULO
							</p>
							<div className="grid grid-cols-[7rem_1fr_9.5rem_1fr] gap-x-2 gap-y-1 px-3 py-2.5">
								{vehicleData.flat().map((item, index) => (
									<span
										key={`${item}-${index.toString()}`}
										className={cn(
											"truncate",
											index % 2 === 0 ? "text-slate-500" : "text-slate-800",
										)}
									>
										{item}
									</span>
								))}
							</div>
						</div>

						<div className="overflow-hidden rounded-2xl border border-slate-200">
							<p className="bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
								PRECIFICADOR FIPE
							</p>
							<div className="grid grid-cols-[1fr_1fr_2fr_0.6fr_1fr_1.2fr] gap-x-2 gap-y-1 px-3 py-2.5">
								{[
									"Código FIPE",
									"Fabricante",
									"Modelo",
									"Ano",
									"Combustível",
									"Valor",
								].map((label) => (
									<b key={label} className="font-semibold text-slate-900">
										{label}
									</b>
								))}
								{[
									"010•••-3",
									"Jeep",
									"Compass Longitude 2.0",
									"2021",
									"Flex",
									"R$ 1••.•••,00",
								].map((value) => (
									<span key={value} className="truncate text-slate-600">
										{value}
									</span>
								))}
							</div>
						</div>

						<GreenBar>Histórico do veículo</GreenBar>
						{history.map(({ title, status, text }) => (
							<div key={title} className="relative pt-1.5 pl-1.5">
								<StatusDot
									status={status}
									className="absolute top-0 left-0 z-10 size-5 ring-2 ring-white"
								/>
								<div className="overflow-hidden rounded-2xl border border-slate-200">
									<p className="bg-secondary px-5 py-1.5 text-xs font-medium text-secondary-foreground uppercase">
										{title}
									</p>
									<p className="px-3 py-2 text-slate-600">{text}</p>
								</div>
							</div>
						))}

						<p className="mt-1 flex justify-between rounded-t-xl bg-primary px-4 py-1.5 text-[0.625rem] font-semibold text-primary-foreground">
							<span className="font-normal">V.1.0</span>
							checkauto.com.br
							<span />
						</p>
					</article>
				</div>
			</div>
		</div>
	);
}
