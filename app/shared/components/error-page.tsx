import { Link } from "react-router";

import errorArt from "~/assets/error-art.svg";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import { Button } from "~/shared/components/ui/button";

type ErrorPageProps = {
	error: unknown;
	isNotFound?: boolean;
};

export function ErrorPage({ error, isNotFound = false }: ErrorPageProps) {
	const details =
		!isNotFound && import.meta.env.DEV && error instanceof Error
			? (error.stack ?? error.message)
			: undefined;

	return (
		<>
			<title>
				{isNotFound
					? "Página não encontrada | Checkauto"
					: "Algo deu errado | Checkauto"}
			</title>
			<meta name="robots" content="noindex" />

			<div className="flex min-h-dvh flex-col bg-background">
				<header className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-8 lg:pt-8">
					<CheckautoLogo className="h-6" />
				</header>
				<main
					id="conteudo"
					className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-[minmax(0,1fr)] content-center items-center gap-10 px-4 pt-8 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:py-12"
				>
					<div className="flex flex-col items-start gap-4">
						<h1 className="max-w-[18ch] text-3xl/tight font-medium tracking-tight text-heading lg:text-4xl/tight">
							{isNotFound
								? "Esta página não existe ou mudou de endereço"
								: "Não foi possível carregar esta página"}
						</h1>
						<p className="max-w-[44ch] text-base/7 text-muted-foreground">
							{isNotFound
								? "Confira se o endereço foi digitado corretamente. Se você chegou aqui por um link, ele pode estar desatualizado."
								: "Tivemos um problema do nosso lado. Tente novamente em alguns instantes. Se continuar, fale com o nosso atendimento."}
						</p>
						<div className="flex w-full flex-col gap-3 pt-4 sm:w-auto sm:flex-row">
							{!isNotFound && (
								<Button type="button" onClick={() => window.location.reload()}>
									Tentar novamente
								</Button>
							)}
							<Button asChild variant="outline">
								<Link to="/">Voltar ao início</Link>
							</Button>
						</div>
						{details && (
							<pre className="mt-6 max-h-64 w-full overflow-auto rounded-2xl bg-muted p-4 text-xs/5 text-heading/80">
								<code>{details}</code>
							</pre>
						)}
					</div>

					<img
						src={errorArt}
						alt=""
						width={480}
						height={480}
						className="mx-auto w-full max-w-72 sm:max-w-96 lg:max-w-110"
					/>
				</main>
			</div>
		</>
	);
}
