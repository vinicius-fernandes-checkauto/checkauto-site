import { Link } from "react-router";

import logoWhite from "~/assets/brand/checkauto-logo-white.png";
import {
	FacebookIcon,
	InstagramIcon,
	MailIcon,
	PhoneIcon,
	YoutubeIcon,
} from "~/shared/components/icons";
import {
	company,
	contact,
	institutionalNav,
	socialLinks,
} from "~/shared/config/navigation";
import { cn } from "~/shared/lib/utils";

const socialIcons = {
	Facebook: FacebookIcon,
	Instagram: InstagramIcon,
	YouTube: YoutubeIcon,
};

const linkClassName =
	"inline-flex min-h-11 items-center text-small text-muted-foreground transition-colors hover:text-highlight";

export function SiteFooter() {
	const year = new Date().getFullYear();

	return (
		<footer className="surface-inverse">
			<div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 pt-16 pb-10 sm:px-8">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
					<div className="flex flex-col gap-6">
						<Link
							to="/"
							className="inline-flex min-h-11 w-fit items-center rounded-full"
						>
							<img
								src={logoWhite}
								alt="Página inicial da Checkauto"
								width={800}
								height={109}
								loading="lazy"
								decoding="async"
								className="h-7 w-auto"
							/>
						</Link>
						<ul className="flex gap-2" aria-label="Redes sociais">
							{socialLinks.map(({ label, href }) => {
								const Icon = socialIcons[label];

								return (
									<li key={label}>
										<a
											href={href}
											target="_blank"
											rel="noopener noreferrer"
											className="flex size-11 items-center justify-center rounded-full bg-accent text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
										>
											<Icon className="size-5" />
											<span className="sr-only">
												{label} (abre em nova aba)
											</span>
										</a>
									</li>
								);
							})}
						</ul>
					</div>

					<nav aria-labelledby="rodape-institucional">
						<h2 id="rodape-institucional" className="mb-3 text-h5 text-heading">
							Institucional
						</h2>
						<ul className="grid grid-cols-1 gap-x-6 min-[400px]:grid-cols-2 sm:grid-cols-1">
							{institutionalNav.map(({ label, to }) => (
								<li key={label}>
									<Link to={to} className={linkClassName}>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					<div>
						<h2 className="mb-3 text-h5 text-heading">Contato</h2>
						<ul>
							<li>
								<a
									href={`mailto:${contact.email}`}
									className={cn(linkClassName, "gap-2 break-all")}
								>
									<MailIcon aria-hidden="true" className="size-4 shrink-0" />
									{contact.email}
								</a>
							</li>
							{contact.phones.map(({ label, href }) => (
								<li key={href}>
									<a href={href} className={cn(linkClassName, "gap-2")}>
										<PhoneIcon aria-hidden="true" className="size-4 shrink-0" />
										{label}
									</a>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="flex flex-col gap-2 border-t pt-8 text-caption text-muted-foreground">
					<p>
						© {year} Checkauto - Todos os direitos reservados.{" "}
						{company.legalName} - CNPJ: {company.cnpj}.
					</p>
					<p>{company.address}</p>
				</div>
			</div>
		</footer>
	);
}
