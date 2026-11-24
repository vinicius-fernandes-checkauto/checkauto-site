import { GoogleIcon } from "~/shared/components/icons";

export function SocialSignIn({ action }: { action: string }) {
	return (
		<div className="flex flex-col items-center gap-4">
			<p className="text-sm text-muted-foreground">ou continue com</p>
			<div className="flex gap-3">
				<button
					type="button"
					aria-label={`${action} com Google`}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card transition-colors hover:border-slate-300"
				>
					<GoogleIcon className="size-5" />
				</button>
				{/* <button
					type="button"
					aria-label={`${action} com Facebook`}
					className="flex size-12 items-center justify-center rounded-full border border-border bg-card text-[#1877F2] transition-colors hover:border-slate-300"
				>
					<FacebookIcon className="size-5" />
				</button> */}
			</div>
		</div>
	);
}
