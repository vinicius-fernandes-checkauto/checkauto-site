import * as accountApi from "~/domains/account/account.api";
import type {
	AccountProfile,
	OrderView,
	QueryFilters,
	QueryPage,
	UserDetail,
	WalletFilters,
	WalletPage,
} from "~/domains/account/types/account.types";
import type { ProfileFormValues } from "~/domains/account/utils/account.schema";
import {
	toAmount,
	toOrderDetail,
	toOrderListParams,
	toVehicleQueries,
} from "~/domains/account/utils/queries";
import { toWalletPage, toWalletParams } from "~/domains/account/utils/wallet";
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

const orderErrors: Record<number, string> = {
	403: "Você não tem acesso a esse pedido.",
	404: "Pedido não encontrado.",
};

function toOrderError(error: unknown) {
	const apiError = toApiError(error);
	const message = apiError.status ? orderErrors[apiError.status] : undefined;
	return message
		? new ApiError(message, apiError.status, apiError.code)
		: apiError;
}

async function callIdOf(orderId: string) {
	const order = await accountApi.getOrder(orderId);
	if (!order.call) {
		throw new ApiError("Esse pedido ainda não tem consulta.", 404);
	}
	return order.call.id;
}

export async function getQueries(filters: QueryFilters): Promise<QueryPage> {
	requireSession();
	const list = await accountApi.listOrders(toOrderListParams(filters));

	const partial = list.results.filter(
		(order) => order.status === "completed_partial",
	);
	const details = await Promise.allSettled(
		partial.map((order) => accountApi.getOrder(order.id)),
	);
	const callStatuses = new Map<string, string>();
	details.forEach((detail, index) => {
		const status =
			detail.status === "fulfilled" ? detail.value.call?.status : null;
		if (status) callStatuses.set(partial[index].id, status);
	});

	return {
		queries: toVehicleQueries(list, callStatuses),
		total: list.count,
	};
}

export async function getOrder(orderId: string): Promise<OrderView> {
	requireSession();
	try {
		return toOrderDetail(await accountApi.getOrder(orderId));
	} catch (error) {
		throw toOrderError(error);
	}
}

export async function cancelOrder(orderId: string) {
	try {
		await accountApi.cancelOrder(orderId);
	} catch (error) {
		const apiError = toOrderError(error);
		if (apiError.status === 409) {
			throw new ApiError(
				"Esse pedido não pode mais ser cancelado.",
				409,
				apiError.code,
			);
		}
		throw apiError;
	}
}

export async function requeryQuery(orderId: string) {
	try {
		await accountApi.requeryCall(await callIdOf(orderId));
	} catch (error) {
		throw toOrderError(error);
	}
}

const STATEMENT_POLL_INTERVAL = 2_500;
const STATEMENT_MAX_TRIES = 40;

const wait = (ms: number) =>
	new Promise<void>((resolve) => {
		setTimeout(resolve, ms);
	});

export async function getStatementUrl(orderId: string) {
	try {
		for (let tries = 0; tries < STATEMENT_MAX_TRIES; tries++) {
			const statement = await accountApi.getOrderStatement(orderId);
			if (statement.pdf_status === "ready" && statement.download_url) {
				return statement.download_url;
			}
			await wait(STATEMENT_POLL_INTERVAL);
		}
	} catch (error) {
		throw toOrderError(error);
	}

	throw new ApiError(
		"O extrato está demorando mais que o normal. Tente de novo em instantes.",
		null,
	);
}

export async function getWallet(filters: WalletFilters): Promise<WalletPage> {
	const { user } = requireSession();
	try {
		const page = toWalletPage(
			await accountApi.listWalletMovements(toWalletParams(filters)),
		);
		if (page.balance !== null) return page;

		const profile = await accountApi.getUser(user.id).catch(() => null);
		return { ...page, balance: toAmount(profile?.balance) };
	} catch (error) {
		const apiError = toApiError(error);
		if (apiError.status === 403) {
			throw new ApiError(
				"Você não tem acesso ao histórico de saldo.",
				403,
				apiError.code,
			);
		}
		throw apiError;
	}
}
