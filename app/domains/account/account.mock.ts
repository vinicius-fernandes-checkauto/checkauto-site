import type {
	AccountProfile,
	AccountUser,
	CreditEntry,
	QueryStatus,
	Transaction,
	VehicleQuery,
} from "~/domains/account/types/account.types";

export const demoAccount: AccountUser = {
	name: "Teste Veículos Ltda",
	email: "contato@testeveiculos.com.br",
};

export const demoProfile: AccountProfile = {
	personType: "Pessoa jurídica",
	name: "Teste Veículos Ltda",
	document: "01.689.272/0001-03",
	stateRegistration: "",
	stateRegistrationExempt: true,
	phone: "(11) 90000-0000",
	secondaryPhone: "",
	email: "contato@testeveiculos.com.br",
	address: {
		zip: "04543011",
		street: "Avenida Brigadeiro Faria Lima",
		number: "3477",
		complement: "Conjunto 92",
		district: "Itaim Bibi",
		city: "São Paulo",
		state: "SP",
	},
	contractAcceptedAt: "2025-03-12",
	shareData: true,
};

const plates = [
	"XYZ4E56",
	"ABC1D23",
	"ABC1D23",
	"QRS4T56",
	"FHE8B03",
	"BRA2E19",
	"UPX9028",
	"FMN4212",
	"BRF3P97",
	"GHT7K21",
	"JKL5M88",
	"MNO2P34",
	"RST6U77",
	"VWX8Y90",
	"QWE1R23",
	"ASD4F56",
	"ZXC7V89",
	"POI0U98",
	"LKJ7H65",
	"MNB4V32",
	"TYU1I23",
	"GHJ4K56",
	"CVB7N89",
];

const planNames = ["Checkauto Master", "Checkauto Plus", "Checkauto Standard"];

const linkedToTransactions = [
	{ code: "12320812", plan: "Checkauto Master" },
	{ code: "12320791", plan: "Checkauto Plus" },
	{ code: "12318840", plan: "Checkauto Plus" },
	{ code: "12301177", plan: "Checkauto Standard" },
	{ code: "12287305", plan: "Checkauto Master" },
];

const fixedStatus: Record<number, QueryStatus> = {
	0: "processing",
	2: "error",
	9: "error",
};

export const demoQueries: VehicleQuery[] = plates.map((plate, index) => {
	const date = new Date(Date.UTC(2026, 10, 23, 14, 32));
	date.setUTCDate(date.getUTCDate() - index * 4);
	date.setUTCHours(9 + ((index * 3) % 9), (index * 17) % 60);

	return {
		code: linkedToTransactions[index]?.code ?? String(12280000 - index * 1979),
		plate,
		plan:
			linkedToTransactions[index]?.plan ?? planNames[index % planNames.length],
		date: date.toISOString(),
		status: fixedStatus[index] ?? "done",
	};
});

export const demoCreditEntries: CreditEntry[] = [
	{
		id: "l5",
		date: "2026-11-18",
		description: "Consulta da placa ABC1D23",
		detail: "Checkauto Master",
		category: "Consulta",
		kind: "debit",
		amount: 59.9,
	},
	{
		id: "l4",
		date: "2026-11-10",
		description: "Estorno do pedido #48213",
		category: "Estorno",
		kind: "credit",
		amount: 69.9,
		expiresAt: "2027-05-10",
	},
	{
		id: "l3",
		date: "2026-10-28",
		description: "Crédito promocional",
		detail: "Campanha de indicação",
		category: "Bônus",
		kind: "credit",
		amount: 20,
		expiresAt: "2026-12-15",
	},
	{
		id: "l2",
		date: "2026-10-02",
		description: "Consulta da placa QRS4T56",
		detail: "Checkauto Standard",
		category: "Consulta",
		kind: "debit",
		amount: 54.9,
	},
	{
		id: "l1",
		date: "2026-09-20",
		description: "Compra de créditos",
		detail: "Pedido #47790",
		category: "Compra",
		kind: "credit",
		amount: 150,
		expiresAt: "2027-09-20",
	},
];

export const demoTransactions: Transaction[] = [
	{
		id: "t6",
		date: "2026-11-23",
		queryCode: "12320812",
		plate: "XYZ4E56",
		plan: "Checkauto Master",
		amount: 59.9,
		status: "pending",
	},
	{
		id: "t5",
		date: "2026-11-18",
		queryCode: "12320791",
		plate: "ABC1D23",
		plan: "Checkauto Plus",
		amount: 69.9,
		status: "paid",
	},
	{
		id: "t4",
		date: "2026-11-10",
		queryCode: "12318840",
		plate: "ABC1D23",
		plan: "Checkauto Plus",
		amount: 69.9,
		status: "refunded",
	},
	{
		id: "t3",
		date: "2026-10-28",
		queryCode: "12301177",
		plate: "QRS4T56",
		plan: "Checkauto Standard",
		amount: 54.9,
		status: "paid",
	},
	{
		id: "t2",
		date: "2026-10-02",
		queryCode: "12287305",
		plate: "FHE8B03",
		plan: "Checkauto Master",
		amount: 59.9,
		status: "paid",
	},
];
