import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

import type {
	WalletFilters,
	WalletListParams,
	WalletMovement,
	WalletMovementList,
	WalletPage,
} from "~/domains/account/types/account.types";
import {
	DEFAULT_PAGE_SIZE,
	formatAmount,
	formatDateTime,
	pageSize,
	queryPeriod,
	toAmount,
} from "~/domains/account/utils/queries";

export const walletSearchParams = {
	de: parseAsString.withDefault(""),
	ate: parseAsString.withDefault(""),
	pagina: parseAsInteger.withDefault(1),
	itens: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
};

export const loadWalletSearchParams = createLoader(walletSearchParams);

export function toWalletParams(
	filters: WalletFilters,
	today = new Date(),
): WalletListParams {
	const { from, to } = queryPeriod(filters, today);

	return {
		date_from: from,
		date_to: to,
		page: Math.max(1, filters.pagina),
		page_size: pageSize(filters.itens),
	};
}

const movementLabels: Record<string, string> = {
	credit_order: "Crédito por pedido",
	credit_manual: "Crédito manual",
	debit_call: "Débito de consulta",
	refund: "Estorno",
	adjustment: "Ajuste",
	limit_change: "Alteração de limite",
	period_reset: "Virada de período",
	opening: "Saldo inicial",
};

type WalletMovementItem = WalletMovementList["results"][number];

export function toWalletMovement(movement: WalletMovementItem): WalletMovement {
	const amount = toAmount(movement.amount) ?? 0;
	const type = movement.type ?? "";
	const reason = movement.reason?.trim() ?? "";

	return {
		id: movement.id,
		date: formatDateTime(movement.created_at ?? ""),
		label: movementLabels[type] ?? type ?? "Movimentação",
		reason: reason || (movement.origin === "manual" ? "Ajuste manual" : ""),
		amount,
		balanceAfter: toAmount(movement.balance_after),
		direction: amount > 0 ? "in" : amount < 0 ? "out" : "none",
	};
}

export function toWalletPage(list: WalletMovementList): WalletPage {
	return {
		movements: list.results.map(toWalletMovement),
		total: list.count,
		balance: toAmount(list.summary?.balance),
	};
}

export function formatSignedAmount(amount: number) {
	const value = formatAmount(Math.abs(amount));
	if (amount > 0) return `+ ${value}`;
	if (amount < 0) return `− ${value}`;
	return value;
}
