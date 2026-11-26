import type {
	UpdateUserBody,
	UserDetail,
} from "~/domains/account/types/account.types";
import { userDetailSchema } from "~/domains/account/utils/account.schema";
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
