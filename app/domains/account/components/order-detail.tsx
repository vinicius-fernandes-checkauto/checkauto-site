import { type ReactNode, useEffect, useState } from "react";
import { useRevalidator } from "react-router";
import { toast } from "sonner";

import { AccountSection } from "~/domains/account/components/account-section";
import { PaymentCard } from "~/domains/account/components/payment-card";
import { StatusBadge } from "~/domains/account/components/status-badge";
import { useQueryActions } from "~/domains/account/hooks/use-query-actions";
import { cancelOrder } from "~/domains/account/services/account.service";
import type { OrderView } from "~/domains/account/types/account.types";
import {
	canOpenStatement,
	isRunning,
	statusTone,
} from "~/domains/account/utils/queries";
import {
	CheckIcon,
	ClockIcon,
	FileTextIcon,
	LoaderCircleIcon,
	RefreshCwIcon,
	XIcon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "~/shared/components/ui/dialog";
import { toApiError } from "~/shared/lib/api";
import { cn } from "~/shared/lib/utils";

const POLL_INTERVAL = 4_000;

const runningMessage: Partial<Record<OrderView["status"], string>> = {
	created:
		"Pedido criado. Assim que o pagamento for confirmado, a consulta começa.",
	awaiting_payment:
		"Aguardando a confirmação do pagamento. Esta página se atualiza sozinha.",
	paid: "Pagamento confirmado. A consulta vai começar em instantes.",
	processing: "Consultando o veículo. Esta página se atualiza sozinha.",
};

const markers = {
	success: { icon: CheckIcon, className: "bg-primary text-primary-foreground" },
	warning: { icon: ClockIcon, className: "bg-warning text-white" },
	danger: {
		icon: XIcon,
		className: "bg-destructive text-white shadow-md shadow-destructive/30",
	},
	neutral: { icon: null, className: "bg-card border-2 border-brand-blue/25" },
};

function EventMarker({
	tone,
	latest,
}: {
	tone: keyof typeof markers;
	latest: boolean;
}) {
	const { icon: Icon, className } = markers[tone];

	return (
		<span
			aria-hidden="true"
			className={cn(
				"relative flex size-6 shrink-0 items-center justify-center rounded-full ring-4 ring-background",
				className,
				latest && "outline-2 outline-offset-3 outline-brand-blue/20",
			)}
		>
			{Icon ? (
				<Icon className="size-3.5" strokeWidth={3} />
			) : (
				<span className="size-2 rounded-full bg-brand-blue/40" />
			)}
		</span>
	);
}

type DetailItemProps = { label: string; children: ReactNode };

function DetailItem({ label, children }: DetailItemProps) {
	return (
		<div className="flex flex-col gap-0.5">
			<dt className="text-xs/5 text-muted-foreground">{label}</dt>
			<dd className="text-sm/6 font-semibold text-heading tabular-nums">
				{children}
			</dd>
		</div>
	);
}

function CancelOrderButton({ order }: { order: OrderView }) {
	const revalidator = useRevalidator();
	const [open, setOpen] = useState(false);
	const [cancelling, setCancelling] = useState(false);

	async function confirm() {
		setCancelling(true);
		try {
			await cancelOrder(order.id);
			toast.success("Pedido cancelado");
			setOpen(false);
		} catch (error) {
			const { message, status } = toApiError(error);
			toast.error("Não foi possível cancelar o pedido", {
				description: message,
			});
			if (status === 409) setOpen(false);
		} finally {
			setCancelling(false);
			await revalidator.revalidate();
		}
	}

	return (
		<>
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="max-sm:w-full"
				onClick={() => setOpen(true)}
			>
				Cancelar pedido
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:p-8">
					<DialogHeader className="pr-12">
						<DialogTitle>Cancelar o pedido {order.number}?</DialogTitle>
						<DialogDescription className="text-base/6">
							O pagamento deixa de valer e a consulta da placa {order.plate} não
							será feita.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline" size="sm">
								Voltar
							</Button>
						</DialogClose>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							disabled={cancelling}
							onClick={() => void confirm()}
						>
							{cancelling ? "Cancelando…" : "Cancelar pedido"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
	return (
		<h2 id={id} className="text-lg/tight font-semibold tracking-tight">
			{children}
		</h2>
	);
}

export function OrderDetail({ order }: { order: OrderView }) {
	const revalidator = useRevalidator();
	const { requerying, opening, requery, openStatement } = useQueryActions(() =>
		revalidator.revalidate(),
	);
	const running = isRunning(order.status) || order.requerying;
	const statement = canOpenStatement(order.status);

	useEffect(() => {
		if (!running) return;
		const timer = setInterval(() => {
			void revalidator.revalidate();
		}, POLL_INTERVAL);
		return () => clearInterval(timer);
	}, [running, revalidator]);

	return (
		<div className="flex flex-col gap-6">
			<div className="-mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-col gap-2">
					<div className="flex flex-wrap items-center gap-3">
						<StatusBadge tone={statusTone(order.status)}>
							{order.statusLabel}
						</StatusBadge>
						<span className="text-sm text-muted-foreground tabular-nums">
							{order.date}
						</span>
					</div>
					{running && (
						<p
							role="status"
							className="flex items-start gap-2 text-sm/6 text-muted-foreground"
						>
							<LoaderCircleIcon
								aria-hidden="true"
								className="mt-1 size-4 shrink-0 animate-spin text-highlight"
							/>
							{order.requerying
								? "Reconsultando as informações que faltaram. Esta página se atualiza sozinha."
								: runningMessage[order.status]}
						</p>
					)}
				</div>
				{order.canCancel && <CancelOrderButton order={order} />}
			</div>

			<div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
				<div className="flex flex-col gap-6">
					<section
						aria-labelledby="pedido-pagamento"
						className="flex flex-col gap-4"
					>
						<SectionTitle id="pedido-pagamento">Pagamento</SectionTitle>
						<PaymentCard
							payment={order.payment}
							amount={order.amount}
							expiresAt={order.expiresAt}
						/>
					</section>

					<AccountSection id="pedido-consulta" title="Consulta">
						<dl className="grid gap-4 sm:grid-cols-2">
							<DetailItem label="Placa">
								<span className="tracking-wider">{order.plate || "—"}</span>
							</DetailItem>
							<DetailItem label="Pacote">{order.plan || "—"}</DetailItem>
							<DetailItem label="Código da consulta">
								{order.code || "—"}
							</DetailItem>
						</dl>
						{(statement || order.canRequery || order.requerying) && (
							<div className="flex flex-col gap-2 sm:flex-row">
								{statement && (
									<Button
										type="button"
										size="sm"
										disabled={opening !== null}
										aria-busy={opening === order.id}
										onClick={() => void openStatement(order)}
									>
										{opening === order.id ? (
											<LoaderCircleIcon
												aria-hidden="true"
												className="animate-spin"
											/>
										) : (
											<FileTextIcon aria-hidden="true" />
										)}
										{opening === order.id
											? "Gerando o extrato…"
											: "Ver extrato"}
									</Button>
								)}
								{order.requerying && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled
										aria-busy
									>
										<LoaderCircleIcon
											aria-hidden="true"
											className="animate-spin"
										/>
										Reconsultando…
									</Button>
								)}
								{order.canRequery && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										disabled={requerying !== null}
										onClick={() => void requery(order)}
									>
										<RefreshCwIcon aria-hidden="true" />
										Reconsultar
									</Button>
								)}
							</div>
						)}
					</AccountSection>
				</div>
				<section
					aria-labelledby="pedido-historico"
					className="flex flex-col gap-5 lg:sticky lg:top-6"
				>
					<SectionTitle id="pedido-historico">Histórico do pedido</SectionTitle>
					{order.events.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							Nenhuma movimentação ainda.
						</p>
					) : (
						<ol className="relative flex flex-col gap-6 before:absolute before:top-3 before:bottom-3 before:left-3 before:w-0.5 before:-translate-x-1/2 before:rounded-full before:bg-brand-blue/10">
							{order.events.map((event, index) => (
								<li key={event.id} className="relative flex gap-4">
									<EventMarker tone={event.tone} latest={index === 0} />
									<div className="flex min-w-0 flex-col gap-1">
										<p className="text-sm/5 font-semibold text-heading">
											{event.label}
										</p>
										<p className="text-xs/5 text-muted-foreground tabular-nums">
											{[event.group, event.date].filter(Boolean).join(" · ")}
										</p>
										{event.note && (
											<p className="text-xs/5 text-destructive">{event.note}</p>
										)}
									</div>
								</li>
							))}
							<li className="relative flex items-center gap-5">
								<span
									aria-hidden="true"
									className="relative ml-1 size-4 shrink-0 rounded-full border-2 border-dashed border-brand-blue/30 bg-background"
								/>
								<p className="text-xs/5 font-semibold tracking-widest text-muted-foreground uppercase">
									Início do pedido
								</p>
							</li>
						</ol>
					)}
				</section>
			</div>
		</div>
	);
}
