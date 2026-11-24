import type { StatusTone } from "~/features/account/components/status-badge";

export type QueryStatus = "done" | "processing" | "error";

export type VehicleQuery = {
	code: string;
	plate: string;
	plan: string;
	date: string;
	status: QueryStatus;
};

export const queryStatus: Record<
	QueryStatus,
	{ label: string; tone: StatusTone }
> = {
	done: { label: "Finalizada", tone: "success" },
	processing: { label: "Em andamento", tone: "warning" },
	error: { label: "Erro", tone: "danger" },
};

export const QUERIES_PER_PAGE = 10;

const plates = [
	"XYZ4E56",
	"ABC1D23",
	"ABC1D23",
	"QRS4T56",
	"FHE8B03",
	"BRA2E19",
	"UPX9028",
	"FMN4212",
	"BRF3P97",
	"GHT7K21",
	"JKL5M88",
	"MNO2P34",
	"RST6U77",
	"VWX8Y90",
	"QWE1R23",
	"ASD4F56",
	"ZXC7V89",
	"POI0U98",
	"LKJ7H65",
	"MNB4V32",
	"TYU1I23",
	"GHJ4K56",
	"CVB7N89",
];

const planNames = ["Checkauto Master", "Checkauto Plus", "Checkauto Standard"];

const linkedToTransactions = [
	{ code: "12320812", plan: "Checkauto Master" },
	{ code: "12320791", plan: "Checkauto Plus" },
	{ code: "12318840", plan: "Checkauto Plus" },
	{ code: "12301177", plan: "Checkauto Standard" },
	{ code: "12287305", plan: "Checkauto Master" },
];

const fixedStatus: Record<number, QueryStatus> = {
	0: "processing",
	2: "error",
	9: "error",
};

export const demoQueries: VehicleQuery[] = plates.map((plate, index) => {
	const date = new Date(Date.UTC(2026, 10, 23, 14, 32));
	date.setUTCDate(date.getUTCDate() - index * 4);
	date.setUTCHours(9 + ((index * 3) % 9), (index * 17) % 60);

	return {
		code: linkedToTransactions[index]?.code ?? String(12280000 - index * 1979),
		plate,
		plan:
			linkedToTransactions[index]?.plan ?? planNames[index % planNames.length],
		date: date.toISOString(),
		status: fixedStatus[index] ?? "done",
	};
});

const dateTime = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	timeZone: "America/Sao_Paulo",
});

export const formatDateTime = (iso: string) =>
	dateTime.format(new Date(iso)).replace(",", " ·");

export type QueryFilters = {
	plate: string;
	from: string;
	to: string;
};

export function filterQueries(
	queries: VehicleQuery[],
	{ plate, from, to }: QueryFilters,
) {
	const term = plate.replace(/[^a-z0-9]/gi, "").toUpperCase();

	return queries.filter((query) => {
		const day = query.date.slice(0, 10);
		return (
			(!term || query.plate.includes(term)) &&
			(!from || day >= from) &&
			(!to || day <= to)
		);
	});
}
