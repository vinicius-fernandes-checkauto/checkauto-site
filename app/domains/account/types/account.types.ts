import type { z } from "zod";

import type { userDetailSchema } from "~/domains/account/utils/account.schema";

export type AccountUser = {
	name: string;
	email: string;
	picture?: string;
};

export type UserDetail = z.infer<typeof userDetailSchema>;

export type UpdateUserBody = {
	phone: string;
	cep: string;
	street: string;
	number_address: string;
	complement: string;
	district: string;
	city: string;
	uf: string;
	marketing_consent: boolean;
};

export type AccountCompany = {
	corporateName: string;
	fantasyName: string;
	cnpj: string;
	stateRegistration: string;
};

export type AccountProfile = {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	cpf: string;
	company: AccountCompany | null;
	phone: string;
	zip: string;
	street: string;
	number: string;
	complement: string;
	district: string;
	city: string;
	state: string;
	marketingConsent: boolean;
	termsAcceptedVersion: string;
	termsAcceptedAt: string;
};

export type QueryStatus = "done" | "processing" | "error";

export type VehicleQuery = {
	code: string;
	plate: string;
	plan: string;
	date: string;
	status: QueryStatus;
};

export type QueryFilters = {
	plate: string;
	from: string;
	to: string;
};

export type TransactionStatus = "paid" | "pending" | "refunded";

export type Transaction = {
	id: string;
	date: string;
	queryCode: string;
	plate: string;
	plan: string;
	amount: number;
	status: TransactionStatus;
};

export type CreditEntryKind = "credit" | "debit";

export type CreditEntry = {
	id: string;
	date: string;
	description: string;
	detail?: string;
	category: string;
	kind: CreditEntryKind;
	amount: number;
	expiresAt?: string;
};
