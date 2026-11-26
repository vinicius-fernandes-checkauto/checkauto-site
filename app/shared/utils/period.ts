export type Period = { from: string; to: string };

export type PeriodPreset = {
	key: string;
	label: string;
	getRange: (today: Date) => Period;
};

const isoDay = /^\d{4}-\d{2}-\d{2}$/;

export const isIsoDay = (value: string) => isoDay.test(value);

export function toIsoDay(date: Date) {
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	return `${date.getFullYear()}-${month}-${day}`;
}

function shift(day: string, months: number, days: number) {
	const [year, month, date] = day.split("-").map(Number);
	return toIsoDay(new Date(year, month - 1 + months, date + days));
}

export const shiftDays = (day: string, days: number) => shift(day, 0, days);

export const shiftMonths = (day: string, months: number) =>
	shift(day, months, 0);

function lastDays(days: number) {
	return (today: Date): Period => {
		const to = toIsoDay(today);
		return { from: shiftDays(to, 1 - days), to };
	};
}

function lastMonths(months: number) {
	return (today: Date): Period => {
		const to = toIsoDay(today);
		return { from: shift(to, -months, 1), to };
	};
}

export const periodPresets: PeriodPreset[] = [
	{ key: "today", label: "Hoje", getRange: lastDays(1) },
	{
		key: "yesterday",
		label: "Ontem",
		getRange: (today) => {
			const day = shiftDays(toIsoDay(today), -1);
			return { from: day, to: day };
		},
	},
	{ key: "7d", label: "Últimos 7 dias", getRange: lastDays(7) },
	{ key: "30d", label: "Últimos 30 dias", getRange: lastDays(30) },
	{ key: "3m", label: "Últimos 3 meses", getRange: lastMonths(3) },
	{ key: "6m", label: "Últimos 6 meses", getRange: lastMonths(6) },
	{ key: "12m", label: "Últimos 12 meses", getRange: lastMonths(12) },
];

export function findPeriodPreset(period: Period, today = new Date()) {
	return periodPresets.find((preset) => {
		const range = preset.getRange(today);
		return range.from === period.from && range.to === period.to;
	});
}

export function formatDay(day: string) {
	const [year, month, date] = day.split("-");
	return `${date}/${month}/${year}`;
}

export const formatPeriod = ({ from, to }: Period) =>
	from === to ? formatDay(from) : `${formatDay(from)} – ${formatDay(to)}`;

export const isValidPeriod = ({ from, to }: Period) =>
	isIsoDay(from) && isIsoDay(to) && from <= to;

export const exceedsMonths = ({ from, to }: Period, months: number) =>
	from < shiftMonths(to, -months);
