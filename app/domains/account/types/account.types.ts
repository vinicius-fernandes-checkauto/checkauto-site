import type { z } from "zod";

import type {
	orderDetailSchema,
	orderListSchema,
	orderStatementSchema,
	userDetailSchema,
	walletMovementListSchema,
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

export type OrderStatus =
	| "created"
	| "awaiting_payment"
	| "paid"
	| "processing"
	| "completed"
	| "completed_partial"
	| "failed"
	| "cancelled"
	| "expired";

export type QueryStatus = OrderStatus | "unknown";

export type VehicleQuery = {
	id: string;
	number: string;
	code: string;
	plate: string;
	plan: string;
	amount: number | null;
	date: string;
	status: QueryStatus;
	statusLabel: string;
	canRequery: boolean;
	requerying: boolean;
};

export type OrderEventView = {
	id: string;
	label: string;
	group: string;
	date: string;
	note: string;
	tone: "success" | "warning" | "danger" | "neutral";
};

export type OrderPayment = {
	method: "card" | "pix" | "other";
	brand: string;
	last4: string;
};

export type OrderView = VehicleQuery & {
	canCancel: boolean;
	expiresAt: string;
	payment: OrderPayment | null;
	events: OrderEventView[];
};

export type QueryFilters = {
	busca: string;
	situacao: string;
	de: string;
	ate: string;
	pagina: number;
	itens: number;
};

export type QueryPage = {
	queries: VehicleQuery[];
	total: number;
};

export type OrderList = z.infer<typeof orderListSchema>;
export type OrderDetail = z.infer<typeof orderDetailSchema>;
export type OrderStatement = z.infer<typeof orderStatementSchema>;

export type OrderListParams = {
	date_from: string;
	date_to: string;
	page: number;
	page_size: number;
	search?: string;
	status?: OrderStatus;
};

export type WalletMovementList = z.infer<typeof walletMovementListSchema>;

export type WalletListParams = {
	date_from: string;
	date_to: string;
	page: number;
	page_size: number;
};

export type WalletFilters = {
	de: string;
	ate: string;
	pagina: number;
	itens: number;
};

export type WalletMovement = {
	id: string;
	date: string;
	label: string;
	reason: string;
	amount: number;
	balanceAfter: number | null;
	direction: "in" | "out" | "none";
};

export type WalletPage = {
	movements: WalletMovement[];
	total: number;
	balance: number | null;
};
