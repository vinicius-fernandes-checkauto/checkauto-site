import { useState } from "react";
import { toast } from "sonner";

import {
	getStatementUrl,
	requeryQuery,
} from "~/domains/account/services/account.service";
import type { VehicleQuery } from "~/domains/account/types/account.types";
import { toApiError } from "~/shared/lib/api";

export function useQueryActions(onRequeried: () => Promise<unknown>) {
	const [requerying, setRequerying] = useState<string | null>(null);
	const [opening, setOpening] = useState<string | null>(null);

	async function requery(query: VehicleQuery) {
		setRequerying(query.id);
		try {
			await requeryQuery(query.id);
			toast.success("Reconsulta iniciada", {
				description: `Placa ${query.plate}. O resultado aparece aqui em instantes.`,
			});
			await onRequeried();
		} catch (error) {
			toast.error("Não foi possível reconsultar", {
				description: toApiError(error).message,
			});
		} finally {
			setRequerying(null);
		}
	}

	async function openStatement(query: VehicleQuery) {
		setOpening(query.id);
		try {
			const url = await getStatementUrl(query.id);
			const tab = window.open(url, "_blank");
			if (tab) {
				tab.opener = null;
			} else {
				toast.success("Extrato pronto", {
					description: `Placa ${query.plate}. O navegador bloqueou a nova aba.`,
					duration: Number.POSITIVE_INFINITY,
					action: {
						label: "Abrir extrato",
						onClick: () => window.open(url, "_blank", "noopener"),
					},
				});
			}
		} catch (error) {
			toast.error("Não foi possível abrir o extrato", {
				description: toApiError(error).message,
			});
		} finally {
			setOpening(null);
		}
	}

	return { requerying, opening, requery, openStatement };
}
