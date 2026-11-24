export function formatCpf(value: string) {
	const digits = value.replace(/\D/g, "").slice(0, 11);
	return digits
		.replace(/^(\d{3})(\d)/, "$1.$2")
		.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
		.replace(/\.(\d{3})(\d{1,2})$/, ".$1-$2");
}

export function isValidCpf(digits: string) {
	if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
	const check = (length: number) => {
		const sum = [...digits.slice(0, length)].reduce(
			(total, digit, index) => total + Number(digit) * (length + 1 - index),
			0,
		);
		return ((sum * 10) % 11) % 10;
	};
	return check(9) === Number(digits[9]) && check(10) === Number(digits[10]);
}
