import { describe, expect, it } from "vitest";

import {
	exceedsMonths,
	findPeriodPreset,
	formatPeriod,
	isValidPeriod,
	periodPresets,
	shiftMonths,
} from "./period";

const today = new Date(2026, 10, 26);
const range = (key: string) =>
	periodPresets.find((preset) => preset.key === key)?.getRange(today);

describe("periodPresets", () => {
	it("calcula os períodos a partir de hoje", () => {
		expect(range("today")).toEqual({ from: "2026-11-26", to: "2026-11-26" });
		expect(range("yesterday")).toEqual({
			from: "2026-11-25",
			to: "2026-11-25",
		});
		expect(range("7d")).toEqual({ from: "2026-11-20", to: "2026-11-26" });
		expect(range("30d")).toEqual({ from: "2026-10-28", to: "2026-11-26" });
		expect(range("3m")).toEqual({ from: "2026-08-27", to: "2026-11-26" });
		expect(range("12m")).toEqual({ from: "2025-11-27", to: "2026-11-26" });
	});
});

describe("findPeriodPreset", () => {
	it("reconhece um período que bate com um atalho", () => {
		expect(
			findPeriodPreset({ from: "2026-11-20", to: "2026-11-26" }, today)?.key,
		).toBe("7d");
		expect(
			findPeriodPreset({ from: "2026-11-01", to: "2026-11-10" }, today),
		).toBeUndefined();
	});
});

describe("formatPeriod", () => {
	it("mostra um dia só ou o intervalo", () => {
		expect(formatPeriod({ from: "2026-11-26", to: "2026-11-26" })).toBe(
			"26/11/2026",
		);
		expect(formatPeriod({ from: "2026-11-01", to: "2026-11-10" })).toBe(
			"01/11/2026 – 10/11/2026",
		);
	});
});

describe("validação", () => {
	it("recusa data vazia, inválida ou invertida", () => {
		expect(isValidPeriod({ from: "2026-11-01", to: "2026-11-10" })).toBe(true);
		expect(isValidPeriod({ from: "", to: "2026-11-10" })).toBe(false);
		expect(isValidPeriod({ from: "2026-11-11", to: "2026-11-10" })).toBe(false);
	});

	it("aponta período maior que o limite de meses", () => {
		expect(exceedsMonths({ from: "2025-11-26", to: "2026-11-26" }, 12)).toBe(
			false,
		);
		expect(exceedsMonths({ from: "2025-11-25", to: "2026-11-26" }, 12)).toBe(
			true,
		);
		expect(shiftMonths("2026-11-26", -12)).toBe("2025-11-26");
	});
});
