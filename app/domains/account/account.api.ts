import type {
	CallList,
	CallListParams,
	UpdateUserBody,
	UserDetail,
} from "~/domains/account/types/account.types";
import {
	callListSchema,
	userDetailSchema,
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

export async function listCalls(params: CallListParams): Promise<CallList> {
	const { data } = await api.get<unknown>("/call/list/", { params });
	const parsed = callListSchema.safeParse(unwrapContent(data));
	if (parsed.success) return parsed.data;

	throw new ApiError(
		"Não foi possível ler suas consultas. Tente novamente.",
		null,
	);
}

export async function requeryCall(id: string) {
	await api.post(`/call/requery/${id}/`, {});
}
