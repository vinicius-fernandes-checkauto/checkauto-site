import { useRevalidator } from "react-router";

import { AccessSettings } from "~/domains/account/components/access-settings";
import { AccountPageHeader } from "~/domains/account/components/account-page-header";
import { ProfileForm } from "~/domains/account/components/profile-form";
import { getProfile } from "~/domains/account/services/account.service";
import { Button } from "~/shared/components/ui/button";
import { toApiError } from "~/shared/lib/api";

import type { Route } from "./+types/conta.meus-dados";

export const meta: Route.MetaFunction = () => [
	{ title: "Meus dados | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export async function clientLoader() {
	try {
		return { profile: await getProfile(), error: null };
	} catch (error) {
		return { profile: null, error: toApiError(error).message };
	}
}

export function HydrateFallback() {
	return (
		<p role="status" className="text-sm text-muted-foreground">
			Carregando seus dados…
		</p>
	);
}

export default function AccountProfile({ loaderData }: Route.ComponentProps) {
	const { profile, error } = loaderData;
	const revalidator = useRevalidator();

	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Meus dados"
				description="Mantenha seus dados de cadastro e de acesso atualizados."
			/>
			{profile ? (
				<>
					<AccessSettings email={profile.email} />
					<ProfileForm key={profile.id} profile={profile} />
				</>
			) : (
				<div
					role="alert"
					className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-card p-5 sm:p-7"
				>
					<p className="text-sm/6 text-heading">
						Não foi possível carregar seus dados. {error}
					</p>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={revalidator.state === "loading"}
						onClick={() => void revalidator.revalidate()}
					>
						Tentar novamente
					</Button>
				</div>
			)}
		</div>
	);
}
