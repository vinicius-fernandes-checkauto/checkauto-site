import { useId, useState } from "react";

import { AccountSection } from "~/domains/account/components/account-section";
import { ChangeEmailDialog } from "~/domains/account/components/change-email-dialog";
import { ChangePasswordDialog } from "~/domains/account/components/change-password-dialog";
import { canChangePassword } from "~/domains/auth/services/auth.service";
import { LockIcon, MailIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { useSession } from "~/shared/hooks/use-session";

export function AccessSettings({ email }: { email: string }) {
	const id = useId();
	const [currentEmail, setCurrentEmail] = useState(email);
	const [dialog, setDialog] = useState<"email" | "password" | null>(null);

	const { data: session } = useSession();
	const passwordEnabled = canChangePassword(session ?? null);

	const rows = [
		{
			key: "email",
			icon: MailIcon,
			label: "E-mail de acesso",
			value: currentEmail,
		},
		...(passwordEnabled
			? [
					{
						key: "password",
						icon: LockIcon,
						label: "Senha",
						value: "••••••••••",
					} as const,
				]
			: []),
	] as const;

	return (
		<AccountSection
			id={`${id}-acesso`}
			title="Acesso"
			description="E-mail e senha usados para entrar na Checkauto."
		>
			<ul className="flex flex-col divide-y divide-border">
				{rows.map(({ key, icon: Icon, label, value }) => (
					<li
						key={key}
						className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0"
					>
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
							<Icon aria-hidden="true" className="size-4.5" />
						</span>
						<div className="flex min-w-0 flex-1 flex-col">
							<span className="text-xs/5 text-muted-foreground">{label}</span>
							<span className="truncate text-sm/6 font-semibold text-heading">
								{value}
							</span>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-10 text-sm"
							onClick={() => setDialog(key)}
						>
							Alterar
							<span className="sr-only"> {label.toLowerCase()}</span>
						</Button>
					</li>
				))}
			</ul>

			{!passwordEnabled && (
				<p className="mt-4 text-sm text-muted-foreground">
					Você entra com sua conta Google, sem senha da Checkauto.
				</p>
			)}

			<ChangeEmailDialog
				open={dialog === "email"}
				email={currentEmail}
				onOpenChange={(open) => !open && setDialog(null)}
				onChanged={setCurrentEmail}
			/>
			<ChangePasswordDialog
				open={dialog === "password"}
				onOpenChange={(open) => !open && setDialog(null)}
			/>
		</AccountSection>
	);
}
