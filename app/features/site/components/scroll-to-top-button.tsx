import { ChevronUpIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

function scrollToTop() {
	const smooth = window.matchMedia(
		"(prefers-reduced-motion: no-preference)",
	).matches;
	window.scrollTo({ top: 0, behavior: smooth ? "smooth" : "auto" });
}

export function ScrollToTopButton() {
	return (
		<button
			type="button"
			onClick={scrollToTop}
			className={cn(
				"group inline-flex min-h-11 items-center gap-2.5 rounded-full border border-white/20 py-1 pr-1 pl-4 text-sm/5.5 font-medium text-white transition-colors hover:bg-white/10",
				"outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
				"focus-visible:ring-brand-green/60",
			)}
		>
			Voltar ao topo
			<span
				aria-hidden="true"
				className="flex size-9 items-center justify-center rounded-full bg-brand-green text-brand-blue transition-transform group-hover:-translate-y-0.5"
			>
				<ChevronUpIcon className="size-4.5" />
			</span>
		</button>
	);
}
