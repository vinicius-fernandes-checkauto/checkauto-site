import type { StatusTone } from "~/domains/account/components/status-badge";
import type {
	QueryFilters,
	QueryStatus,
	VehicleQuery,
} from "~/domains/account/types/account.types";

export const queryStatus: Record<
	QueryStatus,
	{ label: string; tone: StatusTone }
> = {
	done: { label: "Finalizada", tone: "success" },
	processing: { label: "Em andamento", tone: "warning" },
	error: { label: "Erro", tone: "danger" },
};

export const QUERIES_PER_PAGE = 10;

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
