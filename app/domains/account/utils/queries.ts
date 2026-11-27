import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import type { StatusTone } from "~/domains/account/components/status-badge";
import type {
	OrderDetail,
	OrderEventView,
	OrderList,
	OrderListParams,
	OrderPayment,
	OrderStatus,
	OrderView,
	QueryFilters,
	QueryStatus,
	VehicleQuery,
} from "~/domains/account/types/account.types";
import { isIsoDay, shiftMonths, toIsoDay } from "~/shared/utils/period";

export const orderStatuses: {
	value: OrderStatus;
	label: string;
	tone: StatusTone;
}[] = [
	{ value: "created", label: "Criado", tone: "neutral" },
	{ value: "awaiting_payment", label: "Aguardando pagamento", tone: "warning" },
	{ value: "paid", label: "Pago", tone: "neutral" },
	{ value: "processing", label: "Em consulta", tone: "warning" },
	{ value: "completed", label: "Concluído", tone: "success" },
	{
		value: "completed_partial",
		label: "Concluído com informações parciais",
		tone: "warning",
	},
	{ value: "failed", label: "Falhou", tone: "danger" },
	{ value: "cancelled", label: "Cancelado", tone: "danger" },
	{ value: "expired", label: "Expirado", tone: "neutral" },
];

const findStatus = (value: string) =>
	orderStatuses.find((status) => status.value === value);

export function statusTone(status: QueryStatus): StatusTone {
	return status === "unknown"
		? "neutral"
		: (findStatus(status)?.tone ?? "neutral");
}

export const PAGE_SIZES = [10, 20, 50] as const;
export const DEFAULT_PAGE_SIZE = PAGE_SIZES[0];
export const MIN_SEARCH_LENGTH = 2;
export const MAX_QUERY_MONTHS = 12;

export const querySearchParams = {
	busca: parseAsString.withDefault(""),
	situacao: parseAsString.withDefault(""),
	de: parseAsString.withDefault(""),
	ate: parseAsString.withDefault(""),
	pagina: parseAsInteger.withDefault(1),
	itens: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export const pageSize = (itens: number) =>
	PAGE_SIZES.find((size) => size === itens) ?? DEFAULT_PAGE_SIZE;

export const loadQuerySearchParams = createLoader(querySearchParams);

export function queryPeriod(
	{ de, ate }: Pick<QueryFilters, "de" | "ate">,
	today = new Date(),
) {
	const to = isIsoDay(ate) ? ate : toIsoDay(today);
	const earliest = shiftMonths(to, -MAX_QUERY_MONTHS);
	const requested = isIsoDay(de) && de <= to ? de : earliest;
	const exceeded = requested < earliest;

	return { from: exceeded ? earliest : requested, to, exceeded };
}

export function toOrderListParams(
	filters: QueryFilters,
	today = new Date(),
): OrderListParams {
	const { from, to } = queryPeriod(filters, today);
	const search = filters.busca.trim();
	const status = findStatus(filters.situacao)?.value;

	return {
		date_from: from,
		date_to: to,
		page: Math.max(1, filters.pagina),
		page_size: pageSize(filters.itens),
		...(search.length >= MIN_SEARCH_LENGTH && { search }),
		...(status && { status }),
	};
}

function _text(value: unknown) {
	return typeof value === "string" || typeof value === "number"
		? String(value).trim()
		: "";
}

const dateTime = new Intl.DateTimeFormat("pt-BR", {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
	timeZone: "America/Sao_Paulo",
});

export function formatDateTime(value: string, separator = "·") {
	const formatted = value.match(/^(\d{2}\/\d{2}\/\d{4}) às (\d{2}:\d{2})/);
	if (formatted) return `${formatted[1]} ${separator} ${formatted[2]}`;

	const date = new Date(value);
	return Number.isNaN(date.getTime())
		? value
		: dateTime.format(date).replace(",", ` ${separator}`);
}

const currency = new Intl.NumberFormat("pt-BR", {
	style: "currency",
	currency: "BRL",
});

export const formatAmount = (amount: number | null) =>
	amount === null ? "—" : currency.format(amount);

export function toAmount(value: string | null | undefined) {
	const amount = Number(value);
	return value && Number.isFinite(amount) ? amount : null;
}

type OrderItem = Partial<OrderList["results"][number]> & { id: string };

export const REQUERY_AVAILABLE = "5";
export const REQUERY_RUNNING = "2";

export const isRequeryAvailable = (
	status: string | null | undefined,
	callStatus: string | null | undefined,
) => status === "completed_partial" && callStatus === REQUERY_AVAILABLE;

export function toVehicleQuery(
	order: OrderItem,
	callStatus?: string | null,
): VehicleQuery {
	const known = findStatus(order.status ?? "");

	return {
		id: order.id,
		number: order.number ? `#${order.number}` : "",
		code: order.query_code ?? "",
		plate: (order.plate ?? "").toUpperCase(),
		plan: order.product?.name ?? "",
		amount: toAmount(order.amount),
		date: formatDateTime(order.created_at ?? ""),
		status: known?.value ?? "unknown",
		statusLabel: order.status_label || known?.label || "Em análise",
		canRequery: isRequeryAvailable(order.status, callStatus),
		requerying: callStatus === REQUERY_RUNNING,
	};
}

export function toVehicleQueries(
	list: OrderList,
	callStatuses: ReadonlyMap<string, string> = new Map(),
): VehicleQuery[] {
	return list.results.map((order) =>
		toVehicleQuery(order, callStatuses.get(order.id)),
	);
}

const compactLabels: Partial<Record<QueryStatus, string>> = {
	awaiting_payment: "Aguardando",
	completed_partial: "Parcial",
};

export const compactStatusLabel = (status: QueryStatus, label: string) =>
	compactLabels[status] ?? label;

export const canOpenStatement = (status: QueryStatus) =>
	status === "completed" || status === "completed_partial";

const runningStatuses: QueryStatus[] = [
	"created",
	"awaiting_payment",
	"paid",
	"processing",
];

export const isRunning = (status: QueryStatus) =>
	runningStatuses.includes(status);

const cancellable: QueryStatus[] = ["created", "awaiting_payment"];

const groupLabels: Record<string, string> = {
	order: "Pedido",
	payment: "Pagamento",
	query: "Consulta",
	notification: "Notificação",
	fiscal: "Fiscal",
};

const eventTones: Record<string, OrderEventView["tone"]> = {
	payment_paid: "success",
	payment_pending: "warning",
	late_payment: "warning",
	payment_failed: "danger",
	order_cancelled: "danger",
	order_expired: "danger",
};

type OrderEvent = OrderDetail["events"][number];

const statusTones: Partial<Record<string, OrderEventView["tone"]>> = {
	completed: "success",
	completed_partial: "warning",
	awaiting_payment: "warning",
	failed: "danger",
	cancelled: "danger",
	expired: "danger",
};

function eventTone(event: OrderEvent): OrderEventView["tone"] {
	return (
		eventTones[event.type] ?? statusTones[event.status_after ?? ""] ?? "neutral"
	);
}

function failureNote(event: OrderEvent) {
	if (event.type !== "payment_failed" || !event.data) return "";
	if (event.data.reason === "divergence") {
		return "Valor cobrado não confere com o pedido";
	}
	return event.data.error_code ? `Código: ${event.data.error_code}` : "";
}

const capitalize = (value: string) =>
	value ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase() : "";

function paymentOf(events: OrderEvent[]): OrderPayment | null {
	const data = [...events]
		.reverse()
		.find((event) => event.type === "payment_paid")?.data;
	if (!data?.method) return null;

	return {
		method:
			data.method === "card" || data.method === "pix" ? data.method : "other",
		brand: capitalize(data.brand ?? ""),
		last4: data.last4 ?? "",
	};
}

export function toOrderDetail(order: OrderDetail): OrderView {
	const base = toVehicleQuery(order, order.call?.status);
	const canCancel = cancellable.includes(base.status);

	return {
		...base,
		date: formatDateTime(order.created_at ?? "", "às"),
		canCancel,
		expiresAt:
			canCancel && order.expires_at
				? formatDateTime(order.expires_at, "às")
				: "",
		payment: paymentOf(order.events),
		events: order.events
			.map((event, index) => ({
				id: `${event.type}-${index}`,
				label: event.label || event.type,
				group: groupLabels[event.group ?? ""] ?? event.group ?? "",
				date: formatDateTime(event.created_at ?? "", "às"),
				note: failureNote(event),
				tone: eventTone(event),
			}))
			.reverse(),
	};
}
