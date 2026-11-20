import ring from "~/assets/brand/symbol-ring-blue.webp";
import { cn } from "~/shared/lib/utils";

import { WhyNumbers } from "./why-numbers";
import { WhyReasons } from "./why-reasons";

const arc =
	"pointer-events-none absolute -z-10 aspect-896/900 mask-contain mask-no-repeat";

export function WhySection() {
	return (
		<div className="relative isolate overflow-hidden bg-background">
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className={cn(
					arc,
					"-top-64 -right-72 w-152 rotate-200 bg-brand-green/15 max-lg:w-96",
				)}
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className={cn(
					arc,
					"top-1/2 -left-64 w-176 -translate-y-1/2 rotate-30 bg-brand-blue/6 max-lg:hidden",
				)}
			/>
			<span
				aria-hidden="true"
				style={{ maskImage: `url(${ring})` }}
				className={cn(
					arc,
					"-right-48 -bottom-72 w-140 rotate-160 bg-brand-green/12 max-lg:hidden",
				)}
			/>
			<WhyReasons />
			<WhyNumbers />
		</div>
	);
}
