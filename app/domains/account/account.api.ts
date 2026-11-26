import type {
	CallAvailability,
	CallDetail,
	CallList,
	CallListParams,
	ReportPdf,
	UpdateUserBody,
	UserDetail,
} from "~/domains/account/types/account.types";
import {
	callAvailabilitySchema,
	callDetailSchema,
	callListSchema,
	reportPdfSchema,
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

function parse<T>(
	schema: { safeParse: (data: unknown) => { success: boolean; data?: T } },
	data: unknown,
	message: string,
): T {
	const parsed = schema.safeParse(unwrapContent(data));
	if (parsed.success) return parsed.data as T;

	throw new ApiError(message, null);
}

export async function listCalls(params: CallListParams) {
	const { data } = await api.get<unknown>("/call/list/", { params });
	return parse<CallList>(
		callListSchema,
		data,
		"Não foi possível ler suas consultas. Tente novamente.",
	);
}

export async function getCall(id: string) {
	const { data } = await api.get<unknown>(`/call/retrieve/${id}/`);
	return parse<CallDetail>(
		callDetailSchema,
		data,
		"Não foi possível ler essa consulta. Tente novamente.",
	);
}

export async function getCallAvailability(id: string) {
	const { data } = await api.get<unknown>(`/call/availability/${id}/`);
	return parse<CallAvailability>(
		callAvailabilitySchema,
		data,
		"Não foi possível verificar essa consulta.",
	);
}

export async function requeryCall(id: string) {
	await api.post(`/call/requery/${id}/`, {});
}

export async function getReportPdf(callId: string, productId: string) {
	const { data } = await api.get<unknown>(
		`/product/report/pdf/${callId}/${productId}/`,
	);
	return parse<ReportPdf>(
		reportPdfSchema,
		data,
		"Não foi possível ler o extrato. Tente novamente.",
	);
}
