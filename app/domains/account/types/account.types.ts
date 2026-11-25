import type { Address } from "~/domains/account/utils/account.schema";

export type AccountUser = {
	name: string;
	email: string;
};

export type AccountProfile = {
	personType: "Pessoa física" | "Pessoa jurídica";
	name: string;
	document: string;
	stateRegistration: string;
	stateRegistrationExempt: boolean;
	phone: string;
	secondaryPhone: string;
	email: string;
	address: Address;
	contractAcceptedAt: string;
	shareData: boolean;
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
