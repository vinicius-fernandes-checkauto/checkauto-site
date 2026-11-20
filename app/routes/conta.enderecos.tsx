import { useState } from "react";

import { AccountPageHeader } from "~/features/account/components/account-page-header";
import { AddressCard } from "~/features/account/components/address-card";
import { AddressFormDialog } from "~/features/account/components/address-form-dialog";
import { RemoveAddressDialog } from "~/features/account/components/remove-address-dialog";
import {
	type Address,
	type AddressInput,
	demoAddresses,
} from "~/features/account/lib/addresses";
import { MapPinIcon, PlusIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/conta.enderecos";

export const meta: Route.MetaFunction = () => [
	{ title: "Endereços | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountAddresses() {
	const [addresses, setAddresses] = useState(demoAddresses);
	const [formOpen, setFormOpen] = useState(false);
	const [editing, setEditing] = useState<Address | null>(null);
	const [removing, setRemoving] = useState<Address | null>(null);

	const ordered = [...addresses].sort(
		(a, b) => Number(b.isDefault) - Number(a.isDefault),
	);

	function openForm(address: Address | null) {
		setEditing(address);
		setFormOpen(true);
	}

	function save(input: AddressInput) {
		setAddresses((current) => {
			const next = editing
				? current.map((item) =>
						item.id === editing.id ? { ...item, ...input } : item,
					)
				: [...current, { ...input, id: crypto.randomUUID() }];
			if (!input.isDefault) return next;
			const savedId = editing?.id ?? next[next.length - 1].id;
			return next.map((item) => ({ ...item, isDefault: item.id === savedId }));
		});
		setFormOpen(false);
	}

	function makeDefault(id: string) {
		setAddresses((current) =>
			current.map((item) => ({ ...item, isDefault: item.id === id })),
		);
	}

	function remove() {
		if (!removing) return;
		setAddresses((current) => {
			const next = current.filter((item) => item.id !== removing.id);
			if (removing.isDefault && next.length > 0) {
				next[0] = { ...next[0], isDefault: true };
			}
			return next;
		});
		setRemoving(null);
	}

	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Endereços"
				description="Usados na emissão da nota fiscal. O endereço principal já vem preenchido nas suas compras."
				action={
					addresses.length > 0 && (
						<Button size="sm" onClick={() => openForm(null)}>
							<PlusIcon aria-hidden="true" />
							Novo endereço
						</Button>
					)
				}
			/>

			{ordered.length > 0 ? (
				<ul className="grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-2">
					{ordered.map((address) => (
						<li key={address.id} className="grid">
							<AddressCard
								address={address}
								onEdit={() => openForm(address)}
								onRemove={() => setRemoving(address)}
								onMakeDefault={() => makeDefault(address.id)}
							/>
						</li>
					))}
				</ul>
			) : (
				<div className="flex flex-col items-center gap-4 rounded-3xl border border-dashed border-brand-blue/20 px-6 py-14 text-center">
					<span className="flex size-14 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
						<MapPinIcon aria-hidden="true" className="size-6" />
					</span>
					<div className="flex flex-col gap-1.5">
						<h2 className="text-lg font-semibold text-heading">
							Nenhum endereço cadastrado
						</h2>
						<p className="max-w-[40ch] text-sm/6 text-muted-foreground">
							Cadastre um endereço para agilizar suas próximas compras.
						</p>
					</div>
					<Button size="sm" onClick={() => openForm(null)}>
						<PlusIcon aria-hidden="true" />
						Adicionar endereço
					</Button>
				</div>
			)}

			<AddressFormDialog
				open={formOpen}
				address={editing}
				forceDefault={addresses.length === 0}
				onOpenChange={setFormOpen}
				onSave={save}
			/>
			<RemoveAddressDialog
				address={removing}
				onOpenChange={(open) => !open && setRemoving(null)}
				onConfirm={remove}
			/>
		</div>
	);
}
