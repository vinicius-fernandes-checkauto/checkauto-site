import { Link } from "react-router";

import {
	AuthHeading,
	AuthHeadingDescription,
	AuthHeadingTitle,
} from "~/domains/auth/components/auth-heading";
import { AuthSwitch } from "~/domains/auth/components/auth-switch";
import { NewPasswordForm } from "~/domains/auth/components/new-password-form";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/_auth.nova-senha";

export const meta: Route.MetaFunction = () => [
	{ title: "Nova senha | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export function clientLoader({ request }: Route.ClientLoaderArgs) {
	return { token: new URL(request.url).searchParams.get("token") };
}

export function HydrateFallback() {
	return (
		<p role="status" className="text-center text-sm text-muted-foreground">
			Carregando…
		</p>
	);
}

export default function NewPassword({ loaderData }: Route.ComponentProps) {
	const { token } = loaderData;

	if (!token) {
		return (
			<>
				<AuthHeading>
					<AuthHeadingTitle>Link inválido ou expirado</AuthHeadingTitle>
					<AuthHeadingDescription>
						Peça um novo link para criar sua senha. Ele chega no e-mail da sua
						conta.
					</AuthHeadingDescription>
				</AuthHeading>
				<Button asChild className="w-full">
					<Link to="/redefinir-senha">Pedir novo link</Link>
				</Button>
				<AuthSwitch question="Lembrou a senha?" to="/entrar">
					Entrar
				</AuthSwitch>
			</>
		);
	}

	return (
		<>
			<AuthHeading>
				<AuthHeadingTitle>Crie uma nova senha</AuthHeadingTitle>
				<AuthHeadingDescription>
					Escolha a senha que você vai usar para entrar na sua conta.
				</AuthHeadingDescription>
			</AuthHeading>

			<NewPasswordForm token={token} />

			<AuthSwitch question="Lembrou a senha?" to="/entrar">
				Entrar
			</AuthSwitch>
		</>
	);
}
