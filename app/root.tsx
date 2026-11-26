import { NuqsAdapter } from "nuqs/adapters/react-router/v8";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";

import logo from "~/assets/brand/checkauto-logo.png";
import { ErrorPage } from "~/shared/components/error-page";
import { Toaster } from "~/shared/components/ui/sonner";
import { TooltipProvider } from "~/shared/components/ui/tooltip";
import { jsonLdScript, organizationJsonLd } from "~/shared/lib/seo";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="pt-BR">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="theme-color" content="#002e55" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
				<Meta />
				<Links />
				<script
					type="application/ld+json"
					// biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD estático, gerado a partir de content e com "<" escapado
					dangerouslySetInnerHTML={{
						__html: jsonLdScript(organizationJsonLd(logo)),
					}}
				/>
			</head>
			<body>
				{children}
				<Toaster closeButton />
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return (
		<NuqsAdapter>
			<TooltipProvider>
				<Outlet />
			</TooltipProvider>
		</NuqsAdapter>
	);
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	const isNotFound = isRouteErrorResponse(error) && error.status === 404;
	return <ErrorPage error={error} isNotFound={isNotFound} />;
}
