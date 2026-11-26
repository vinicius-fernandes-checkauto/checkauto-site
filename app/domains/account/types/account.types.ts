import type { z } from "zod";

import type {
	callAvailabilitySchema,
	callDetailSchema,
	callListSchema,
	reportPdfSchema,
	userDetailSchema,
} from "~/domains/account/utils/account.schema";

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

export type QueryStatus =
	| "queued"
	| "processing"
	| "done"
	| "error"
	| "unavailable";

export type VehicleQuery = {
	id: string;
	code: string;
	plate: string;
	plan: string;
	date: string;
	status: QueryStatus;
	canRequery: boolean;
};

export type QueryFilters = {
	busca: string;
	de: string;
	ate: string;
	pagina: number;
	itens: number;
};

export type QueryPage = {
	queries: VehicleQuery[];
	total: number;
};

export type CallList = z.infer<typeof callListSchema>;
export type CallDetail = z.infer<typeof callDetailSchema>;
export type CallAvailability = z.infer<typeof callAvailabilitySchema>;
export type ReportPdf = z.infer<typeof reportPdfSchema>;

export type CallListParams = {
	initial_date: string;
	final_date: string;
	page: number;
	page_size: number;
	search?: string;
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
