import { useId, useState } from "react";

import { CalendarDaysIcon, ChevronDownIcon } from "~/shared/components/icons";
import { Button } from "~/shared/components/ui/button";
import { Field, FieldError, FieldLabel } from "~/shared/components/ui/field";
import { Input } from "~/shared/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/shared/components/ui/popover";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "~/shared/components/ui/sheet";
import { useMediaQuery } from "~/shared/hooks/use-media-query";
import { cn } from "~/shared/lib/utils";
import {
	exceedsMonths,
	findPeriodPreset,
	formatPeriod,
	isValidPeriod,
	type Period,
	periodPresets,
} from "~/shared/utils/period";

type PeriodFilterProps = {
	id?: string;
	value: Period | null;
	onChange: (period: Period | null) => void;
	defaultLabel: string;
	maxMonths: number;
	className?: string;
};

const emptyPeriod: Period = { from: "", to: "" };

export function PeriodFilter({
	id,
	value,
	onChange,
	defaultLabel,
	maxMonths,
	className,
}: PeriodFilterProps) {
	const baseId = useId();
	const desktop = useMediaQuery("(min-width: 640px)");
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<Period>(emptyPeriod);

	const label = value
		? (findPeriodPreset(value)?.label ?? formatPeriod(value))
		: defaultLabel;
	const selectedPreset = findPeriodPreset(draft)?.key;
	const filled = Boolean(draft.from && draft.to);
	const error = !filled
		? null
		: !isValidPeriod(draft)
			? "A data inicial deve ser igual ou anterior à final."
			: exceedsMonths(draft, maxMonths)
				? `O período pode ter no máximo ${maxMonths} meses.`
				: null;

	function apply(period: Period | null) {
		onChange(period);
		setOpen(false);
	}

	const trigger = (
		<button
			id={id}
			type="button"
			className={cn(
				"flex h-11 w-full min-w-0 items-center gap-2.5 rounded-full border border-border bg-card pr-4 pl-4.5 text-left text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring data-[state=open]:border-ring",
				className,
			)}
		>
			<CalendarDaysIcon
				aria-hidden="true"
				className="size-4 shrink-0 text-muted-foreground"
			/>
			<span className="min-w-0 flex-1 truncate text-heading">{label}</span>
			<ChevronDownIcon
				aria-hidden="true"
				className="size-4 shrink-0 text-muted-foreground"
			/>
		</button>
	);

	const panel = (
		<>
			<ul className="flex flex-wrap gap-2">
				{periodPresets.map((preset) => (
					<li key={preset.key}>
						<button
							type="button"
							aria-pressed={selectedPreset === preset.key}
							onClick={() => setDraft(preset.getRange(new Date()))}
							className="flex min-h-11 items-center rounded-full bg-muted px-3.5 text-sm font-medium text-heading transition-colors hover:bg-brand-blue/10 aria-pressed:bg-secondary aria-pressed:text-secondary-foreground"
						>
							{preset.label}
						</button>
					</li>
				))}
			</ul>

			<fieldset className="flex flex-col gap-3 border-t border-border pt-4">
				<legend className="sr-only">Período personalizado</legend>
				<p
					aria-hidden="true"
					className="text-sm font-medium text-muted-foreground"
				>
					Personalizado
				</p>
				<div className="grid grid-cols-2 gap-3">
					<Field>
						<FieldLabel htmlFor={`${baseId}-de`}>De</FieldLabel>
						<Input
							id={`${baseId}-de`}
							type="date"
							value={draft.from}
							max={draft.to || undefined}
							aria-invalid={Boolean(error)}
							aria-describedby={error ? `${baseId}-erro` : undefined}
							onChange={(event) =>
								setDraft({ ...draft, from: event.target.value })
							}
							className="px-3"
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor={`${baseId}-ate`}>Até</FieldLabel>
						<Input
							id={`${baseId}-ate`}
							type="date"
							value={draft.to}
							min={draft.from || undefined}
							aria-invalid={Boolean(error)}
							aria-describedby={error ? `${baseId}-erro` : undefined}
							onChange={(event) =>
								setDraft({ ...draft, to: event.target.value })
							}
							className="px-3"
						/>
					</Field>
				</div>
				{error && (
					<FieldError id={`${baseId}-erro`} errors={[{ message: error }]} />
				)}
			</fieldset>

			<div className="flex justify-end gap-2">
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => apply(null)}
				>
					Limpar
				</Button>
				<Button
					type="button"
					size="sm"
					disabled={!filled || Boolean(error)}
					onClick={() => apply(draft)}
				>
					Aplicar
				</Button>
			</div>
		</>
	);

	function handleOpenChange(next: boolean) {
		if (next) setDraft(value ?? emptyPeriod);
		setOpen(next);
	}

	if (!desktop) {
		return (
			<Sheet open={open} onOpenChange={handleOpenChange}>
				<SheetTrigger asChild>{trigger}</SheetTrigger>
				<SheetContent side="bottom" className="gap-4 p-4 pt-5">
					<SheetHeader className="p-0 pr-12">
						<SheetTitle>Período</SheetTitle>
						<SheetDescription className="sr-only">
							Escolha um atalho ou um intervalo de datas.
						</SheetDescription>
					</SheetHeader>
					{panel}
				</SheetContent>
			</Sheet>
		);
	}

	return (
		<Popover open={open} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>{trigger}</PopoverTrigger>
			<PopoverContent className="w-88">{panel}</PopoverContent>
		</Popover>
	);
}
