import { Link } from "react-router";

import logo from "~/assets/brand/checkauto-logo.png";
import {
	FacebookIcon,
	InstagramIcon,
	MailIcon,
	PhoneIcon,
	YoutubeIcon,
} from "~/shared/components/icons";
import { company, contact, socialLinks } from "~/shared/config/company";
import { footerNav, legalNav } from "~/shared/config/navigation";
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

const headingClassName =
	"mb-2 text-base/relaxed font-medium text-foreground lg:mb-4";

function SecureSeal() {
	return (
		<svg
			aria-hidden="true"
			width={16}
			height={18}
			viewBox="0 0 32 36"
			className="shrink-0"
		>
			<path
				d="M16 1 3 6v10c0 8.6 5.6 15.6 13 18 7.4-2.4 13-9.4 13-18V6L16 1z"
				className="fill-brand-green"
			/>
			<rect x="10.5" y="16" width="11" height="9" rx="2" fill="#fff" />
			<path
				d="M12.75 16v-2.6a3.25 3.25 0 0 1 6.5 0V16"
				fill="none"
				stroke="#fff"
				strokeWidth={2.4}
			/>
		</svg>
	);
}

function FooterLinks({ title, links }: (typeof footerNav)[number]) {
	const id = `rodape-${title.toLowerCase()}`;

	return (
		<nav aria-labelledby={id}>
			<h2 id={id} className={headingClassName}>
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
					<Link
						to="/"
						className={cn(
							"inline-flex w-fit items-center rounded-md",
							focusRing,
						)}
					>
						<img
							src={logo}
							alt="Página inicial da Checkauto"
							width={800}
							height={109}
							loading="lazy"
							decoding="async"
							className="h-6.5 w-auto lg:h-7"
						/>
					</Link>
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
					<h2 className={headingClassName}>Atendimento</h2>
					<ul className="flex flex-col lg:gap-0.5">
						{contact.phones.map(({ label, href }) => (
							<li key={href}>
								<a href={href} className={cn(linkClassName, "text-foreground")}>
									<PhoneIcon
										aria-hidden="true"
										className="size-4.5 shrink-0 text-brand-green"
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
									className="size-4.5 shrink-0 text-brand-green"
								/>
								{contact.email}
							</a>
						</li>
					</ul>
					<p className="mt-2 flex items-center justify-center gap-2 pt-2 pb-7 text-xs/4.5 text-muted-foreground lg:mt-6 lg:justify-start lg:border-t lg:border-border lg:pt-5 lg:pb-0">
						<SecureSeal />
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
				</div>
			</div>
		</footer>
	);
}
