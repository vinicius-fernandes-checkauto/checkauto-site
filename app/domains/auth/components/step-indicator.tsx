import { cn } from "~/shared/lib/utils";

type StepIndicatorProps = {
	titles: string[];
	current: number;
};

export function StepIndicator({ titles, current }: StepIndicatorProps) {
	return (
		<div className="flex flex-col gap-2.5">
			<p className="text-sm font-medium text-heading">
				<span className="text-muted-foreground">
					Etapa {current + 1} de {titles.length}
				</span>{" "}
				· {titles[current]}
			</p>
			<div aria-hidden="true" className="flex gap-1.5">
				{titles.map((title, index) => (
					<span
						key={title}
						className={cn(
							"h-1.5 flex-1 rounded-full",
							index <= current ? "bg-primary" : "bg-border",
						)}
					/>
				))}
			</div>
		</div>
	);
}
