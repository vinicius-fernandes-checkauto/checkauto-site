import * as accountApi from "~/domains/account/account.api";
import type {
	AccountProfile,
	QueryFilters,
	QueryPage,
	UserDetail,
} from "~/domains/account/types/account.types";
import type { ProfileFormValues } from "~/domains/account/utils/account.schema";
import {
	failedStatusCodes,
	isRequeryEligible,
	statementProductId,
	toCallListParams,
	toVehicleQueries,
} from "~/domains/account/utils/queries";
import { ApiError, toApiError } from "~/shared/lib/api";
import { getSession } from "~/shared/lib/session";

const digits = (value: string) => value.replace(/\D/g, "");

export function toProfile(user: UserDetail): AccountProfile {
	const company = user.company?.cnpj
		? {
				corporateName: user.company.corporate_name,
				fantasyName: user.company.fantasy_name,
				cnpj: user.company.cnpj,
				stateRegistration: user.company.state_registration,
			}
		: null;

	const address = user.cep || !user.company?.cep ? user : user.company;

	return {
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		cpf: user.cpf,
		company,
		phone: user.phone,
		zip: address.cep,
		street: address.street,
		number: address.number_address,
		complement: address.complement,
		district: address.district,
		city: address.city,
		state: address.uf.toUpperCase(),
		marketingConsent: user.marketing_consent ?? false,
		termsAcceptedVersion: user.terms_accepted_version,
		termsAcceptedAt: user.terms_accepted_at,
	};
}

function requireSession() {
	const session = getSession();
	if (!session) throw new ApiError("Sua sessão expirou. Entre novamente.", 401);
	return session;
}

export async function getProfile() {
	const { user } = requireSession();
	return toProfile(await accountApi.getUser(user.id));
}

export async function saveProfile(
	profile: AccountProfile,
	values: ProfileFormValues,
) {
	const user = await accountApi.updateUser(profile.id, {
		phone: digits(values.phone),
		cep: digits(values.zip),
		street: values.street,
		number_address: values.number,
		complement: values.complement,
		district: values.district,
		city: values.city,
		uf: values.state,
		marketing_consent: values.marketing,
	});

	return toProfile(user);
}

export async function getQueries(filters: QueryFilters): Promise<QueryPage> {
	requireSession();
	const list = await accountApi.listCalls(toCallListParams(filters));

	const failed = list.results.filter((call) =>
		failedStatusCodes.includes(call.status),
	);
	const checks = await Promise.allSettled(
		failed.map((call) => accountApi.getCallAvailability(call.id)),
	);
	const requeryable = new Set(
		failed
			.filter((_, index) => {
				const check = checks[index];
				return check.status === "fulfilled" && isRequeryEligible(check.value);
			})
			.map((call) => call.id),
	);

	return { queries: toVehicleQueries(list, requeryable), total: list.count };
}

export function requeryQuery(id: string) {
	return accountApi.requeryCall(id);
}

const statementErrors: Record<number, string> = {
	403: "Essa consulta não pertence à sua conta.",
	404: "Essa consulta não tem extrato disponível.",
	503: "Não foi possível carregar o extrato agora. Tente de novo em instantes.",
};

function toStatementError(error: unknown) {
	const apiError = toApiError(error);
	const message = apiError.status
		? statementErrors[apiError.status]
		: undefined;
	return message
		? new ApiError(message, apiError.status, apiError.code)
		: apiError;
}

const STATEMENT_POLL_INTERVAL = 3_000;
const STATEMENT_MAX_TRIES = 30;

const wait = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});

export async function getStatementUrl(callId: string) {
	try {
		const productId = statementProductId(await accountApi.getCall(callId));
		if (!productId) {
			throw new ApiError("Essa consulta não tem extrato disponível.", 404);
		}

		for (let tries = 0; tries < STATEMENT_MAX_TRIES; tries++) {
			const report = await accountApi.getReportPdf(callId, productId);
			if (report.pdf_status === "ready" && report.download_url) {
				return report.download_url;
			}
			await wait(STATEMENT_POLL_INTERVAL);
		}
	} catch (error) {
		throw toStatementError(error);
	}

	throw new ApiError(
		"O extrato está demorando mais que o normal. Tente de novo em instantes.",
		null,
	);
}
