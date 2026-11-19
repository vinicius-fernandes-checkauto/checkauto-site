import { useEffect, useState } from "react";

import type {
	LegalBlock,
	LegalDocumentContent,
	LegalSectionContent,
} from "~/features/legal/lib/legal";
import {
	ChevronDownIcon,
	MailIcon,
	PhoneIcon,
} from "~/shared/components/icons";
import { PageHeader } from "~/shared/components/layout/page-header";
import { contact } from "~/shared/config/company";
import { cn } from "~/shared/lib/utils";

function useActiveSection(ids: string[]) {
	const [active, setActive] = useState(ids[0]);

	useEffect(() => {
		const visible = new Set<string>();
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) visible.add(entry.target.id);
					else visible.delete(entry.target.id);
				}
				const first = ids.find((id) => visible.has(id));
				if (first) setActive(first);
			},
			{ rootMargin: "-96px 0px -65% 0px" },
		);

		for (const id of ids) {
			const element = document.getElementById(id);
			if (element) observer.observe(element);
		}

		return () => observer.disconnect();
	}, [ids]);

	return active;
}

function LegalBlockView({ block }: { block: LegalBlock }) {
	if (block.kind === "subheading") {
		return (
			<h3 className="pt-2 text-base/6 font-semibold text-heading">
				{block.text}
			</h3>
		);
	}

	if (block.kind === "list") {
		return (
			<ul className="flex flex-col gap-2.5">
				{block.items.map((item) => (
					<li key={item.marker} className="flex gap-3">
						<span className="w-5 shrink-0 font-semibold text-heading">
							{item.marker})
						</span>
						<p className="min-w-0 wrap-break-word">
							{item.term && (
								<strong className="font-semibold text-heading">
									{item.term}:{" "}
								</strong>
							)}
							{item.text}
						</p>
					</li>
				))}
			</ul>
		);
	}

	return (
		<p className="flex gap-3">
			{block.number && (
				<span className="w-8 shrink-0 font-semibold text-heading tabular-nums">
					{block.number}
				</span>
			)}
			<span className="min-w-0 wrap-break-word">{block.text}</span>
		</p>
	);
}

function LegalSection({ section }: { section: LegalSectionContent }) {
	return (
		<section
			id={section.id}
			aria-labelledby={`${section.id}-titulo`}
			className="flex scroll-mt-28 flex-col gap-4"
		>
			<h2
				id={`${section.id}-titulo`}
				className="text-xl/7 font-semibold tracking-tight text-heading lg:text-2xl/8"
			>
				{section.number}. {section.title}
			</h2>
			<div className="flex flex-col gap-4 text-[0.9375rem]/7 text-pretty text-foreground/85">
				{section.blocks.map((block, index) => (
					<LegalBlockView
						key={`${section.id}-${index.toString()}`}
						block={block}
					/>
				))}
			</div>
		</section>
	);
}

function TableOfContents({
	sections,
	active,
}: {
	sections: LegalSectionContent[];
	active?: string;
}) {
	return (
		<ol className="flex flex-col">
			{sections.map((section) => (
				<li key={section.id}>
					<a
						href={`#${section.id}`}
						aria-current={active === section.id ? "location" : undefined}
						className={cn(
							"block py-1 text-[0.8125rem]/5 transition-colors hover:text-heading",
							active === section.id
								? "font-medium text-heading"
								: "text-muted-foreground",
						)}
					>
						{section.title}
					</a>
				</li>
			))}
		</ol>
	);
}

function LegalHelp({ className }: { className?: string }) {
	return (
		<aside
			aria-label="Atendimento"
			className={cn("flex flex-col gap-3 rounded-3xl bg-muted p-6", className)}
		>
			<p className="text-base/6 font-semibold text-heading">
				Ficou com alguma dúvida?
			</p>
			<p className="text-sm/5.5 text-muted-foreground">
				Nosso atendimento explica qualquer cláusula deste documento.
			</p>
			<ul className="flex flex-col text-sm font-medium text-heading">
				<li>
					<a
						href={contact.phones[0].href}
						className="flex min-h-11 items-center gap-2.5 hover:text-highlight"
					>
						<PhoneIcon aria-hidden="true" className="size-4 text-highlight" />
						{contact.phones[0].label}
					</a>
				</li>
				<li>
					<a
						href={`mailto:${contact.email}`}
						className="flex min-h-11 items-center gap-2 text-[0.8125rem] wrap-anywhere hover:text-highlight"
					>
						<MailIcon
							aria-hidden="true"
							className="size-4 shrink-0 text-highlight"
						/>
						{contact.email}
					</a>
				</li>
			</ul>
		</aside>
	);
}

export function LegalDocument({
	label,
	description,
	content,
}: {
	label: string;
	description: string;
	content: LegalDocumentContent;
}) {
	const [ids] = useState(() => content.sections.map(({ id }) => id));
	const active = useActiveSection(ids);
	const hasSections = content.sections.length > 0;

	return (
		<div className="bg-background">
			<div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)] gap-12 px-4 pt-2 pb-18 sm:px-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:pb-24 xl:gap-16">
				<article className="mx-auto flex w-full max-w-3xl min-w-0 flex-col gap-10">
					<PageHeader
						label={label}
						title={content.title}
						description={description}
					/>

					{hasSections && (
						<details className="group rounded-3xl border border-border bg-card lg:hidden">
							<summary className="flex min-h-13 cursor-pointer list-none items-center justify-between gap-3 px-5 text-sm font-semibold text-heading [&::-webkit-details-marker]:hidden">
								Nesta página
								<ChevronDownIcon
									aria-hidden="true"
									className="size-4.5 text-muted-foreground transition-transform group-open:rotate-180"
								/>
							</summary>
							<nav aria-label="Índice do documento" className="px-5 pb-4">
								<TableOfContents sections={content.sections} />
							</nav>
						</details>
					)}

					<div className="flex flex-col gap-4 text-[0.9375rem]/7 text-pretty text-foreground/85">
						{content.intro.map(({ text, emphasis }) =>
							emphasis ? (
								<p
									key={text}
									className="rounded-2xl bg-accent px-5 py-4 text-sm/6 font-medium text-heading"
								>
									{text}
								</p>
							) : (
								<p key={text}>{text}</p>
							),
						)}
					</div>

					{content.sections.map((section) => (
						<LegalSection key={section.id} section={section} />
					))}

					<LegalHelp className="lg:hidden" />
				</article>

				<div className="hidden lg:block">
					<div className="sticky top-24 flex flex-col gap-6 pt-12">
						{hasSections && (
							<nav
								aria-label="Índice do documento"
								className="flex flex-col gap-2"
							>
								<p className="text-[0.8125rem] font-medium text-heading">
									Nesta página
								</p>
								<TableOfContents sections={content.sections} active={active} />
							</nav>
						)}
						<LegalHelp />
					</div>
				</div>
			</div>
		</div>
	);
}
