import { useEffect, useRef, useState } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";

export type FormStep<T extends FieldValues> = {
	title: string;
	fields: FieldPath<T>[];
	focus: FieldPath<T>;
};

export function useFormSteps<T extends FieldValues>(
	form: UseFormReturn<T>,
	steps: FormStep<T>[],
) {
	const [step, setStep] = useState(0);
	const shouldFocus = useRef(false);

	useEffect(() => {
		if (shouldFocus.current) form.setFocus(steps[step].focus);
		shouldFocus.current = false;
	}, [step, form, steps]);

	function goToStep(next: number) {
		shouldFocus.current = true;
		setStep(next);
	}

	async function nextStep() {
		if (await form.trigger(steps[step].fields, { shouldFocus: true })) {
			goToStep(step + 1);
		}
	}

	function goToFields(fields: FieldPath<T>[]) {
		const target = steps.findIndex((item) =>
			fields.some((field) => item.fields.includes(field)),
		);
		if (target >= 0 && target !== step) goToStep(target);
	}

	return {
		step,
		isLast: step === steps.length - 1,
		titles: steps.map(({ title }) => title),
		previousStep: () => goToStep(step - 1),
		nextStep,
		goToFields,
	};
}
