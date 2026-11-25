import { Link } from "react-router";

import { contact } from "~/content/checkauto";
import { ContactForm } from "~/domains/site/components/contact-form";
import { PageHeader } from "~/domains/site/components/page-header";
import { MailIcon, PhoneIcon } from "~/shared/components/icons";

import type { Route } from "./+types/_site.contato";

export const meta: Route.MetaFunction = () => [
	{ title: "Fale conosco | Checkauto" },
	{
		name: "description",
		content:
			"Fale com a Checkauto: envie sua mensagem ou use nossos canais de atendimento por telefone e e-mail.",
	},
];

export default function Contact() {
	return (
		<div className="bg-background">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pt-2 pb-18 sm:px-8 lg:pb-24">
				<PageHeader
					label="Fale conosco"
					title="Fale conosco"
					description="Preencha os campos abaixo e sua mensagem será encaminhada aos nossos especialistas, ou fale com a gente pelos canais de atendimento."
				/>

				<div className="grid grid-cols-[minmax(0,1fr)] items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
					<ContactForm />

					<aside
						aria-labelledby="canais-titulo"
						className="flex flex-col gap-3 lg:sticky lg:top-24"
					>
						<h2
							id="canais-titulo"
							className="px-1 text-sm font-semibold text-heading"
						>
							Canais de atendimento
						</h2>
						<ul className="flex flex-col gap-3">
							{contact.phones.map(({ label, href }, index) => (
								<li key={href}>
									<a
										href={href}
										className="flex items-center gap-4 rounded-3xl bg-muted p-5 transition-colors hover:bg-navy-100"
									>
										<span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-highlight">
											<PhoneIcon aria-hidden="true" className="size-5" />
										</span>
										<span className="flex flex-col">
											<span className="text-xs text-muted-foreground">
												{index === 0 ? "Ligação gratuita" : "Telefone"}
											</span>
											<span className="text-base font-semibold text-heading">
												{label}
											</span>
										</span>
									</a>
								</li>
							))}
							<li>
								<a
									href={`mailto:${contact.email}`}
									className="flex items-center gap-4 rounded-3xl bg-muted p-5 transition-colors hover:bg-navy-100"
								>
									<span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-card text-highlight">
										<MailIcon aria-hidden="true" className="size-5" />
									</span>
									<span className="flex min-w-0 flex-col">
										<span className="text-xs text-muted-foreground">
											E-mail
										</span>
										<span className="text-sm font-semibold wrap-anywhere text-heading">
											{contact.email}
										</span>
									</span>
								</a>
							</li>
						</ul>
						<p className="px-1 pt-2 text-sm/6 text-muted-foreground">
							Sua dúvida pode já ter resposta nas{" "}
							<Link
								to="/#faq"
								className="font-medium text-heading underline decoration-1 underline-offset-4 hover:text-highlight"
							>
								perguntas frequentes
							</Link>
							.
						</p>
					</aside>
				</div>
			</div>
		</div>
	);
}
