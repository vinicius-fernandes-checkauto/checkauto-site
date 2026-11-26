import { ChevronLeftIcon, ChevronRightIcon } from "~/shared/components/icons";
import { cn } from "~/shared/lib/utils";

type PaginationProps = {
	page: number;
	pageCount: number;
	total: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	label?: string;
};

const arrowClassName =
	"flex size-11 items-center justify-center rounded-full border border-border bg-card text-heading transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40";

function pageItems(page: number, pageCount: number) {
	if (pageCount <= 7) {
		return Array.from({ length: pageCount }, (_, index) => index + 1);
	}

	const numbers = [1, page - 1, page, page + 1, pageCount].filter(
		(number, index, list) =>
			number >= 1 && number <= pageCount && list.indexOf(number) === index,
	);
	const items: (number | string)[] = [];
	for (const number of numbers) {
		const previous = items.at(-1);
		if (typeof previous === "number" && number - previous > 1) {
			items.push(`gap-${number}`);
		}
		items.push(number);
	}
	return items;
}

export function Pagination({
	page,
	pageCount,
	total,
	pageSize,
	onPageChange,
	label = "Paginação",
}: PaginationProps) {
	const first = (page - 1) * pageSize + 1;
	const last = Math.min(page * pageSize, total);

	return (
		<nav
			aria-label={label}
			className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between"
		>
			<p className="text-sm text-muted-foreground tabular-nums">
				Mostrando {first}–{last} de {total}
			</p>
			<div className="flex items-center gap-1.5">
				<button
					type="button"
					onClick={() => onPageChange(page - 1)}
					disabled={page === 1}
					className={arrowClassName}
				>
					<ChevronLeftIcon aria-hidden="true" className="size-4.5" />
					<span className="sr-only">Página anterior</span>
				</button>
				{pageItems(page, pageCount).map((item) =>
					typeof item === "string" ? (
						<span
							key={item}
							aria-hidden="true"
							className="flex size-8 items-center justify-center text-sm text-muted-foreground"
						>
							…
						</span>
					) : (
						<button
							key={item}
							type="button"
							onClick={() => onPageChange(item)}
							aria-current={item === page ? "page" : undefined}
							className={cn(
								"flex size-11 items-center justify-center rounded-full text-sm font-medium tabular-nums transition-colors",
								item === page
									? "bg-secondary text-secondary-foreground"
									: "text-muted-foreground hover:bg-muted hover:text-heading",
							)}
						>
							<span className="sr-only">Página </span>
							{item}
						</button>
					),
				)}
				<button
					type="button"
					onClick={() => onPageChange(page + 1)}
					disabled={page === pageCount}
					className={arrowClassName}
				>
					<ChevronRightIcon aria-hidden="true" className="size-4.5" />
					<span className="sr-only">Próxima página</span>
				</button>
			</div>
		</nav>
	);
}
