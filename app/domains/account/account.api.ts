import type {
	OrderDetail,
	OrderList,
	OrderListParams,
	OrderStatement,
	UpdateUserBody,
	UserDetail,
	WalletListParams,
	WalletMovementList,
} from "~/domains/account/types/account.types";
import {
	orderDetailSchema,
	orderListSchema,
	orderStatementSchema,
	userDetailSchema,
	walletMovementListSchema,
} from "~/domains/account/utils/account.schema";
import { ApiError, api, unwrapContent } from "~/shared/lib/api";

function parseUser(data: unknown): UserDetail {
	const parsed = userDetailSchema.safeParse(unwrapContent(data));
	if (parsed.success) return parsed.data;

	throw new ApiError("Não foi possível ler seus dados. Tente novamente.", null);
}

export async function getUser(id: string) {
	const { data } = await api.get<unknown>(`/user/retrieve/${id}/`);
	return parseUser(data);
}

export async function updateUser(id: string, body: UpdateUserBody) {
	const { data } = await api.put<unknown>(`/user/update/${id}/`, body);
	return parseUser(data);
}

function parse<T>(
	schema: { safeParse: (data: unknown) => { success: boolean; data?: T } },
	data: unknown,
	message: string,
): T {
	const parsed = schema.safeParse(unwrapContent(data));
	if (parsed.success) return parsed.data as T;

	throw new ApiError(message, null);
}

export async function listOrders(params: OrderListParams) {
	const { data } = await api.get<unknown>("/order/list/", { params });
	return parse<OrderList>(
		orderListSchema,
		data,
		"Não foi possível ler suas consultas. Tente novamente.",
	);
}

export async function getOrder(id: string) {
	const { data } = await api.get<unknown>(`/order/retrieve/${id}/`);
	return parse<OrderDetail>(
		orderDetailSchema,
		data,
		"Não foi possível ler esse pedido. Tente novamente.",
	);
}

export async function requeryCall(id: string) {
	await api.post(`/call/requery/${id}/`, {});
}

export async function getOrderStatement(orderId: string) {
	const { data } = await api.get<unknown>(`/order/extrato/${orderId}/`);
	return parse<OrderStatement>(
		orderStatementSchema,
		data,
		"Não foi possível ler o extrato. Tente novamente.",
	);
}

export async function cancelOrder(id: string) {
	await api.post(`/order/cancel/${id}/`, {});
}

export async function listWalletMovements(params: WalletListParams) {
	const { data } = await api.get<unknown>("/wallet/movements/", { params });
	return parse<WalletMovementList>(
		walletMovementListSchema,
		data,
		"Não foi possível ler o histórico de saldo. Tente novamente.",
	);
}
