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
				"group inline-flex flex-col items-center gap-2 rounded-2xl px-2 py-1 text-xs/4 font-medium text-white",
				"outline-none focus-visible:ring-3 focus-visible:ring-brand-green/60",
			)}
		>
			<span
				aria-hidden="true"
				className="relative flex size-11 items-center justify-center rounded-full bg-brand-green text-brand-blue shadow-[0_0_0_6px_--alpha(var(--color-brand-green)/18%)] transition-transform group-hover:-translate-y-1"
			>
				<span className="absolute inset-0 animate-ping rounded-full bg-brand-green/60 [animation-duration:2s] motion-reduce:animate-none" />
				<ChevronUpIcon className="relative size-5 stroke-[2.5]" />
			</span>
			Voltar ao topo
		</button>
	);
}
