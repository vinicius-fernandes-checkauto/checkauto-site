import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import type { StatusTone } from "~/domains/account/components/status-badge";
import type {
	CallAvailability,
	CallDetail,
	CallList,
	CallListParams,
	QueryFilters,
	QueryStatus,
	VehicleQuery,
} from "~/domains/account/types/account.types";
import { isIsoDay, shiftMonths, toIsoDay } from "~/shared/utils/period";

export const queryStatus: Record<
	QueryStatus,
	{ label: string; tone: StatusTone }
> = {
	queued: { label: "Na fila", tone: "neutral" },
	processing: { label: "Em andamento", tone: "warning" },
	done: { label: "Finalizada", tone: "success" },
	error: { label: "Erro", tone: "danger" },
	unavailable: { label: "Informações indisponíveis", tone: "neutral" },
};

const statusByCode: Record<string, QueryStatus> = {
	"1": "queued",
	"2": "processing",
	"3": "done",
	"4": "error",
	"5": "unavailable",
};

export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];
export const MIN_SEARCH_LENGTH = 2;
export const MAX_QUERY_MONTHS = 12;

export const querySearchParams = {
	busca: parseAsString.withDefault(""),
	de: parseAsString.withDefault(""),
	ate: parseAsString.withDefault(""),
	pagina: parseAsInteger.withDefault(1),
	itens: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export const pageSize = (itens: number) =>
	PAGE_SIZES.find((size) => size === itens) ?? DEFAULT_PAGE_SIZE;

export const loadQuerySearchParams = createLoader(querySearchParams);

export function queryPeriod({ de, ate }: QueryFilters, today = new Date()) {
	const to = isIsoDay(ate) ? ate : toIsoDay(today);
	const earliest = shiftMonths(to, -MAX_QUERY_MONTHS);
	const requested = isIsoDay(de) && de <= to ? de : earliest;
	const exceeded = requested < earliest;

	return { from: exceeded ? earliest : requested, to, exceeded };
}

export function toCallListParams(
	filters: QueryFilters,
	today = new Date(),
): CallListParams {
	const { from, to } = queryPeriod(filters, today);
	const search = filters.busca.trim();

	return {
		initial_date: from,
		final_date: to,
		page: Math.max(1, filters.pagina),
		page_size: pageSize(filters.itens),
		...(search.length >= MIN_SEARCH_LENGTH && { search }),
	};
}

function text(value: unknown) {
	return typeof value === "string" || typeof value === "number"
		? String(value).trim()
		: "";
}

function productName(product: unknown) {
	if (product && typeof product === "object" && "name" in product) {
		return text(product.name);
	}
	return text(product);
}

function findPlate(data: unknown) {
	if (!data || typeof data !== "object") return "";

	const params = Object.entries(data as Record<string, unknown>).map(
		([key, param]) => {
			const record =
				param && typeof param === "object"
					? (param as Record<string, unknown>)
					: { value: param };
			return {
				label: `${key} ${text(record.description)}`,
				value: text(record.value),
			};
		},
	);
	const plate =
		params.find(({ label, value }) => value && /placa|plate/i.test(label)) ??
		params.find(({ value }) => value);

	return plate?.value.toUpperCase() ?? "";
}

const dateTime = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	timeZone: "America/Sao_Paulo",
});

export function formatDateTime(value: string) {
	const formatted = /^\d{2}\/\d{2}\/\d{4}/.test(value);
	const date = formatted ? null : new Date(value);

	if (!date || Number.isNaN(date.getTime())) {
		return value.replace(" às ", " · ");
	}
	return dateTime.format(date).replace(",", " ·");
}

export function toVehicleQueries(
	list: CallList,
	requeryable: ReadonlySet<string> = new Set(),
): VehicleQuery[] {
	return list.results.map((call) => {
		const products = call.products.map(productName).filter(Boolean);

		return {
			id: call.id,
			code: call.query_code ?? "",
			plate: findPlate(call.data),
			plan: products.length > 1 ? "Consulta múltipla" : (products[0] ?? ""),
			date: formatDateTime(call.created_at ?? ""),
			status: statusByCode[call.status] ?? "processing",
			canRequery: requeryable.has(call.id),
		};
	});
}

export const failedStatusCodes = ["4", "5"];

export const canOpenStatement = (status: QueryStatus) =>
	status === "done" || status === "unavailable";

export function isRequeryEligible(availability: CallAvailability) {
	return availability.products.some((product) =>
		product.apis.some((api) => api.requery_eligible),
	);
}

export function statementProductId(call: CallDetail) {
	return (
		call.extrato_products?.find((product) => product.extrato_enabled)?.id ??
		null
	);
}

export const isRunning = (status: QueryStatus) =>
	status === "queued" || status === "processing";
