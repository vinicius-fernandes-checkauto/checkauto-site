import { CheckIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

export function IncludedMark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"flex size-5 shrink-0 items-center justify-center rounded-full bg-highlight text-white",
				className,
			)}
		>
			<CheckIcon aria-hidden="true" className="size-3" strokeWidth={3.2} />
		</span>
	);
}

export function MissingMark({ className }: { className?: string }) {
	return (
		<span
			className={cn(
				"size-5 shrink-0 rounded-full border-[1.5px] border-dashed border-current opacity-40",
				className,
			)}
		/>
	);
}
