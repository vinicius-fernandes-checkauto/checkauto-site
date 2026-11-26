import { useId, useState } from "react";

import { AccountSection } from "~/domains/account/components/account-section";
import { ChangePasswordDialog } from "~/domains/account/components/change-password-dialog";
import { canChangePassword } from "~/domains/auth/services/auth.service";
import { LockIcon, MailIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { useSession } from "~/shared/hooks/use-session";

export function AccessSettings({ email }: { email: string }) {
	const id = useId();
	const [passwordOpen, setPasswordOpen] = useState(false);

	const { data: session } = useSession();
	const passwordEnabled = canChangePassword(session ?? null);

	return (
		<AccountSection
			id={`${id}-acesso`}
			title="Acesso"
			description="E-mail e senha usados para entrar na Checkauto."
		>
			<ul className="flex flex-col divide-y divide-border">
				<li className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
						<MailIcon aria-hidden="true" className="size-4.5" />
					</span>
					<div className="flex min-w-0 flex-1 flex-col">
						<span className="text-xs/5 text-muted-foreground">
							E-mail de acesso
						</span>
						<span className="truncate text-sm/6 font-semibold text-heading">
							{email}
						</span>
						<span className="text-xs/5 text-muted-foreground">
							Para alterar o e-mail, fale com o atendimento.
						</span>
					</div>
					<LockIcon
						aria-hidden="true"
						className="size-4 shrink-0 text-muted-foreground"
					/>
				</li>
				{passwordEnabled && (
					<li className="flex items-center gap-3.5 py-4 first:pt-0 last:pb-0">
						<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-blue/6 text-heading">
							<LockIcon aria-hidden="true" className="size-4.5" />
						</span>
						<div className="flex min-w-0 flex-1 flex-col">
							<span className="text-xs/5 text-muted-foreground">Senha</span>
							<span className="truncate text-sm/6 font-semibold text-heading">
								••••••••••
							</span>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-10 text-sm"
							onClick={() => setPasswordOpen(true)}
						>
							Alterar
							<span className="sr-only"> senha</span>
						</Button>
					</li>
				)}
			</ul>

			{!passwordEnabled && (
				<p className="mt-4 text-sm text-muted-foreground">
					Você entra na Checkauto com a sua conta Google.
				</p>
			)}

			<ChangePasswordDialog
				open={passwordOpen}
				onOpenChange={setPasswordOpen}
			/>
		</AccountSection>
	);
}
