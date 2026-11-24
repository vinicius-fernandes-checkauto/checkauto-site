import { Link } from "react-router";

import { company, contact, socialLinks } from "~/content/company";
import { footerNav, legalNav } from "~/content/navigation";
import { ScrollToTopButton } from "~/features/site/components/scroll-to-top-button";
import { CheckautoLogo } from "~/shared/components/checkauto-logo";
import {
	FacebookIcon,
	InstagramIcon,
	MailIcon,
	PhoneIcon,
	SecureSealIcon,
	YoutubeIcon,
} from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

const year = new Date().getFullYear();

const socialIcons = {
	Facebook: FacebookIcon,
	Instagram: InstagramIcon,
	YouTube: YoutubeIcon,
};

const focusRing =
	"outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

const linkClassName = cn(
	"inline-flex min-h-11 items-center gap-2.5 rounded-md text-sm/5.5 text-muted-foreground transition-colors hover:text-foreground lg:min-h-9",
	focusRing,
);

function FooterLinks({ title, links }: (typeof footerNav)[number]) {
	const id = `rodape-${title.toLowerCase()}`;

	return (
		<nav aria-labelledby={id}>
			<h2
				id={id}
				className="mb-2 text-base/relaxed font-medium text-foreground lg:mb-4"
			>
				{title}
			</h2>
			<ul className="flex flex-col lg:gap-0.5">
				{links.map(({ label, to }) => (
					<li key={label}>
						<Link to={to} className={linkClassName}>
							{label}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
}

export function SiteFooter() {
	const [consultas, ...rest] = footerNav;

	return (
		<footer className="border-t border-border bg-card text-foreground">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-4 gap-y-7 px-5 pt-10 sm:px-8 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,0.9fr))_minmax(0,1.6fr)] lg:gap-10 lg:pt-18 lg:pb-14">
				<div className="col-span-2 flex flex-col gap-4 lg:col-span-1 lg:gap-5">
					<CheckautoLogo />
					<p className="max-w-[34ch] text-sm/5.5 text-muted-foreground">
						Histórico veicular e inteligência de mercado para decisões mais
						seguras.
					</p>
					<ul className="flex gap-2" aria-label="Redes sociais">
						{socialLinks.map(({ label, href }) => {
							const Icon = socialIcons[label];

							return (
								<li key={label}>
									<a
										href={href}
										target="_blank"
										rel="noopener noreferrer"
										className={cn(
											"flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-muted lg:size-10",
											focusRing,
										)}
									>
										<Icon className="size-4.5" />
										<span className="sr-only">{label} (abre em nova aba)</span>
									</a>
								</li>
							);
						})}
					</ul>
				</div>

				<div className="col-span-2 grid grid-cols-2 gap-x-4 border-t border-border pt-7 lg:contents">
					<FooterLinks {...consultas} />
					<div className="flex flex-col gap-5 lg:contents">
						{rest.map((group) => (
							<FooterLinks key={group.title} {...group} />
						))}
					</div>
				</div>

				<div className="col-span-2 lg:col-span-1">
					<h2 className="mb-2 text-base/relaxed font-medium text-foreground lg:mb-4">
						Atendimento
					</h2>
					<ul className="flex flex-col lg:gap-0.5">
						{contact.phones.map(({ label, href }) => (
							<li key={href}>
								<a href={href} className={cn(linkClassName, "text-foreground")}>
									<PhoneIcon
										aria-hidden="true"
										className="size-4.5 shrink-0 text-brand-green-dark"
									/>
									{label}
								</a>
							</li>
						))}
						<li>
							<a
								href={`mailto:${contact.email}`}
								className={cn(
									linkClassName,
									"whitespace-nowrap text-foreground",
								)}
							>
								<MailIcon
									aria-hidden="true"
									className="size-4.5 shrink-0 text-brand-green-dark"
								/>
								{contact.email}
							</a>
						</li>
					</ul>
					<p className="mt-2 flex items-center justify-center gap-2 pt-2 pb-7 text-xs/4.5 text-muted-foreground lg:mt-6 lg:justify-start lg:border-t lg:border-border lg:pt-5 lg:pb-0">
						<SecureSealIcon />
						Site seguro · Certificado SSL
					</p>
				</div>
			</div>

			<div className="bg-brand-blue text-white">
				<div className="mx-auto flex w-full max-w-7xl flex-col-reverse gap-4 px-5 pt-5 pb-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-6">
					<div className="flex flex-col gap-1 text-xs/4.5 text-mist">
						<p>
							<strong className="font-medium text-white">
								© {year} Checkauto.
							</strong>{" "}
							Todos os direitos reservados.
						</p>
						<p>
							{company.legalName} · CNPJ {company.cnpj}
						</p>
						<p>{company.address}</p>
					</div>
					<div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:justify-end lg:gap-x-8">
						<nav
							aria-label="Documentos legais"
							className="flex flex-wrap gap-x-5 lg:gap-x-6"
						>
							{legalNav.map(({ label, to }) => (
								<Link
									key={label}
									to={to}
									className={cn(
										"inline-flex min-h-11 items-center rounded-md text-sm/5.5 text-white underline decoration-1 underline-offset-4 lg:min-h-9 lg:no-underline lg:hover:underline",
										focusRing,
										"focus-visible:ring-brand-green/60",
									)}
								>
									{label}
								</Link>
							))}
						</nav>

						<ScrollToTopButton />
					</div>
				</div>
			</div>
		</footer>
	);
}
