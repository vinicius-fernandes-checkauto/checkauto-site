import { MailIcon } from "~/shared/components/icons";
import { PageHeader } from "~/shared/components/layout/page-header";
import { Button } from "~/shared/components/ui/button";
import { contact } from "~/shared/config/company";

import type { Route } from "./+types/_site.imprensa";

export const meta: Route.MetaFunction = () => [
	{ title: "Imprensa | Checkauto" },
	{
		name: "description",
		content:
			"Divulgações, releases e contato da assessoria de imprensa da Checkauto.",
	},
];

export default function Press() {
	return (
		<div className="bg-background">
			<div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pt-2 pb-18 sm:px-8 lg:pb-24">
				<PageHeader
					label="Imprensa"
					title="Imprensa"
					description="Confira as últimas divulgações e releases sobre a Checkauto."
				/>

				<section
					aria-labelledby="contato-imprensa-titulo"
					className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between lg:p-8"
				>
					<div className="flex flex-col gap-1.5">
						<h2
							id="contato-imprensa-titulo"
							className="text-lg font-semibold text-heading"
						>
							Contato Marketing
						</h2>
						<p className="max-w-[44ch] text-sm/6 text-muted-foreground">
							Se você precisar de algum material que não tenha encontrado aqui,
							entre em contato conosco. Ficaremos felizes em poder te ajudar.
						</p>
					</div>
					<Button
						asChild
						variant="secondary"
						className="self-start sm:self-auto"
					>
						<a href={`mailto:${contact.email}`}>
							<MailIcon aria-hidden="true" />
							{contact.email}
						</a>
					</Button>
				</section>
			</div>
		</div>
	);
}
