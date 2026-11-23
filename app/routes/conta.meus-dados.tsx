import { AccessSettings } from "~/features/account/components/access-settings";
import { AccountPageHeader } from "~/features/account/components/account-page-header";
import { ProfileForm } from "~/features/account/components/profile-form";
import { demoProfile } from "~/features/account/lib/profile";

import type { Route } from "./+types/conta.meus-dados";

export const meta: Route.MetaFunction = () => [
	{ title: "Meus dados | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountProfile() {
	return (
		<div className="flex flex-col gap-8">
			<AccountPageHeader
				title="Meus dados"
				description="Mantenha seus dados de cadastro e de acesso atualizados."
			/>
			<AccessSettings email={demoProfile.email} />
			<ProfileForm profile={demoProfile} />
		</div>
	);
}
