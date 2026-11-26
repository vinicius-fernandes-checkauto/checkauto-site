import { redirect } from "react-router";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { CompleteProfileForm } from "~/domains/auth/components/complete-profile-form";
import { getCompleteProfileRedirect } from "~/domains/auth/services/auth.service";
import { readPendingGoogleSignUp } from "~/domains/auth/utils/google-identity";
import { getSession } from "~/shared/lib/session";

import type { Route } from "./+types/_auth.completar-cadastro";

export const meta: Route.MetaFunction = () => [
	{ title: "Completar cadastro | Checkauto" },
	{ name: "robots", content: "noindex" },
];

function requireIncompleteProfile() {
	const redirectTo = getCompleteProfileRedirect(
		getSession(),
		Boolean(readPendingGoogleSignUp()),
	);
	if (redirectTo) throw redirect(redirectTo);
}

export const clientMiddleware: Route.ClientMiddlewareFunction[] = [
	() => {
		requireIncompleteProfile();
	},
];

export function clientLoader() {
	requireIncompleteProfile();
	return null;
}

export function HydrateFallback() {
	return (
		<p role="status" className="text-center text-sm text-muted-foreground">
			Carregando…
		</p>
	);
}

export default function CompleteProfile() {
	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Complete seu cadastro</AuthHeadingTitle>
				<AuthHeadingDescription>
					Faltam só alguns dados para você começar a consultar.
				</AuthHeadingDescription>
			</AuthHeading>

			<CompleteProfileForm />
		</>
	);
}
