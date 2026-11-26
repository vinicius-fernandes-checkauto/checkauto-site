export function formatCnpj(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 14);
	return digits
		.replace(/^(\d{2})(\d)/, "$1.$2")
		.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d)/, ".$1/$2")
		.replace(/(\d{4})(\d)/, "$1-$2");
}

function checkDigit(digits: string, weights: number[]) {
	const sum = weights.reduce(
		(total, weight, index) => total + Number(digits[index]) * weight,
		0,
	);
	const rest = sum % 11;
	return rest < 2 ? 0 : 11 - rest;
}

export function isValidCnpj(digits: string) {
	if (!/^\d{14}$/.test(digits) || /^(\d)\1+$/.test(digits)) return false;

	const first = checkDigit(digits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
	const second = checkDigit(digits, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
	return first === Number(digits[12]) && second === Number(digits[13]);
}
