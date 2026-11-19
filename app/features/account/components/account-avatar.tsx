import { getInitials } from "~/features/account/lib/account";
import { cn } from "~/shared/lib/utils";

export function AccountAvatar({
	name,
	className,
}: {
	name: string;
	className?: string;
}) {
	return (
		<span
			aria-hidden="true"
			className={cn(
				"flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold tracking-wide text-secondary-foreground",
				className,
			)}
		>
			{getInitials(name)}
		</span>
	);
}
