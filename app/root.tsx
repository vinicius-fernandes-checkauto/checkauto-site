import {
	isRouteErrorResponse,
	Link,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import {
	ErrorPage,
	ErrorPageActions,
	ErrorPageArt,
	ErrorPageContent,
	ErrorPageDescription,
	ErrorPageDetails,
	ErrorPageTitle,
} from "~/shared/components/error-page";
import { Button } from "~/shared/components/ui/button";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="darkreader-lock" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	if (isRouteErrorResponse(error) && error.status === 404) {
		return (
			<>
				<title>Página não encontrada | Checkauto</title>
				<meta name="robots" content="noindex" />
				<ErrorPage>
					<ErrorPageContent>
						<ErrorPageTitle>
							Esta página não existe ou mudou de endereço
						</ErrorPageTitle>
						<ErrorPageDescription>
							Confira se o endereço foi digitado corretamente. Se você chegou
							aqui por um link, ele pode estar desatualizado.
						</ErrorPageDescription>
						<ErrorPageActions>
							<Button asChild>
								<Link to="/">Ir para o início</Link>
							</Button>
						</ErrorPageActions>
					</ErrorPageContent>
					<ErrorPageArt />
				</ErrorPage>
			</>
		);
	}

	const details =
		import.meta.env.DEV && error instanceof Error
			? (error.stack ?? error.message)
			: undefined;

	return (
		<>
			<title>Algo deu errado | Checkauto</title>
			<meta name="robots" content="noindex" />
			<ErrorPage>
				<ErrorPageContent>
					<ErrorPageTitle>Não foi possível carregar esta página</ErrorPageTitle>
					<ErrorPageDescription>
						Tivemos um problema do nosso lado. Tente novamente em alguns
						instantes. Se continuar, fale com o nosso atendimento.
					</ErrorPageDescription>
					<ErrorPageActions>
						<Button type="button" onClick={() => window.location.reload()}>
							Tentar novamente
						</Button>
						<Button asChild variant="outline">
							<Link to="/">Voltar ao início</Link>
						</Button>
					</ErrorPageActions>
					{details && <ErrorPageDetails>{details}</ErrorPageDetails>}
				</ErrorPageContent>
				<ErrorPageArt />
			</ErrorPage>
		</>
	);
}
