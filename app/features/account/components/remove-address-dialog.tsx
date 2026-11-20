import type { Address } from "~/features/account/lib/addresses";
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

type RemoveAddressDialogProps = {
	address: Address | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
};

export function RemoveAddressDialog({
	address,
	onOpenChange,
	onConfirm,
}: RemoveAddressDialogProps) {
	return (
		<Dialog open={address !== null} onOpenChange={onOpenChange}>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Remover “{address?.label}”?</DialogTitle>
					<DialogDescription>
						O endereço sai da sua lista. Pedidos já feitos com ele não mudam.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" size="sm">
							Cancelar
						</Button>
					</DialogClose>
					<Button
						type="button"
						variant="destructive"
						size="sm"
						onClick={onConfirm}
					>
						Remover endereço
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
