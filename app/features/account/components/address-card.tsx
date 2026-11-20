import { type Address, formatZip } from "~/features/account/lib/addresses";
import {
	MapPinIcon,
	PencilIcon,
	StarIcon,
	Trash2Icon,
} from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/shared/lib/utils";

type AddressCardProps = {
	address: Address;
	onEdit: () => void;
	onRemove: () => void;
	onMakeDefault: () => void;
};

export function AddressCard({
	address,
	onEdit,
	onRemove,
	onMakeDefault,
}: AddressCardProps) {
	const titleId = `endereco-${address.id}`;

	return (
		<article
			aria-labelledby={titleId}
			className={cn(
				"flex h-full flex-col gap-5 rounded-3xl border bg-card p-5 sm:p-6",
				address.isDefault
					? "border-brand-green/50 shadow-[0_16px_40px_-28px_--alpha(var(--color-brand-blue)/40%)]"
					: "border-border",
			)}
		>
			<div className="flex items-start gap-3.5">
				<span
					className={cn(
						"flex size-11 shrink-0 items-center justify-center rounded-full",
						address.isDefault
							? "bg-brand-green/15 text-highlight"
							: "bg-brand-blue/6 text-heading",
					)}
				>
					<MapPinIcon aria-hidden="true" className="size-5" />
				</span>
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="flex flex-wrap items-center gap-2">
						<h2 id={titleId} className="text-base/6 font-semibold text-heading">
							{address.label}
						</h2>
						{address.isDefault && (
							<span className="rounded-full bg-brand-green/15 px-2.5 text-xs/6 font-semibold text-highlight">
								Principal
							</span>
						)}
					</div>
					<address className="text-sm/6 text-muted-foreground not-italic">
						{address.street}, {address.number}
						{address.complement && ` · ${address.complement}`}
						<br />
						{address.district} · {address.city}/{address.state}
						<br />
						CEP {formatZip(address.zip)}
					</address>
				</div>
			</div>

			<div className="mt-auto flex flex-wrap items-center gap-2 border-t border-border pt-4">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="h-10 px-3.5 text-sm"
					onClick={onEdit}
				>
					<PencilIcon aria-hidden="true" className="size-4" />
					Editar
					<span className="sr-only"> {address.label}</span>
				</Button>
				{!address.isDefault && (
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="h-10 px-3.5 text-sm"
						onClick={onMakeDefault}
					>
						<StarIcon aria-hidden="true" className="size-4" />
						Tornar principal
						<span className="sr-only"> {address.label}</span>
					</Button>
				)}
				<Button
					type="button"
					variant="ghost"
					size="sm"
					className="ml-auto h-10 px-3.5 text-sm text-muted-foreground hover:bg-destructive/8 hover:text-destructive"
					onClick={onRemove}
				>
					<Trash2Icon aria-hidden="true" className="size-4" />
					Remover
					<span className="sr-only"> {address.label}</span>
				</Button>
			</div>
		</article>
	);
}
