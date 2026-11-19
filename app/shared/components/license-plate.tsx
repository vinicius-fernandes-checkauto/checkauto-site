import { cn } from "~/shared/lib/utils";

export function LicensePlate({
	plate,
	className,
}: {
	plate: string;
	className?: string;
}) {
	return (
		<span
			className={cn(
				"flex flex-col overflow-hidden rounded-lg border-2 border-brand-blue-dark bg-white text-sm font-semibold tracking-[0.12em] text-brand-blue-dark",
				className,
			)}
		>
			<span className="flex justify-between gap-1.5 bg-brand-blue px-1.5 text-[0.375rem] tracking-[0.2em] text-white">
				<span>BR</span>
				<span>BRASIL</span>
				<span />
			</span>
			<span className="px-2 pt-0.5 pb-1">{plate}</span>
		</span>
	);
}
