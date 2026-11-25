type Grecaptcha = {
	ready: (callback: () => void) => void;
	execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

type GrecaptchaEnterprise = {
	ready: (callback: () => void) => void;
	render: (
		container: HTMLElement,
		parameters: {
			sitekey: string;
			action: string;
			callback: (token: string) => void;
			"expired-callback": () => void;
		},
	) => number;
};

declare global {
	interface Window {
		grecaptcha?: Partial<Grecaptcha> & { enterprise?: GrecaptchaEnterprise };
	}
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const siteKeyV2 = import.meta.env.VITE_RECAPTCHA_V2_SITE_KEY;

function loadScript<T>(src: string, pick: () => T | undefined) {
	return new Promise<T>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.onload = () => {
			const api = pick();
			if (api) resolve(api);
			else reject(new Error("reCAPTCHA indisponível"));
		};
		script.onerror = () => reject(new Error("reCAPTCHA indisponível"));
		document.head.append(script);
	});
}

let loadingV3: Promise<Grecaptcha> | null = null;
let loadingV2: Promise<GrecaptchaEnterprise> | null = null;

export function loadRecaptcha() {
	loadingV3 ??= loadScript(
		`https://www.google.com/recaptcha/api.js?render=${siteKey}&hl=pt-BR`,
		() => window.grecaptcha as Grecaptcha | undefined,
	)
		.then(
			(grecaptcha) =>
				new Promise<Grecaptcha>((resolve) =>
					grecaptcha.ready(() => resolve(grecaptcha)),
				),
		)
		.catch((error) => {
			loadingV3 = null;
			throw error;
		});

	return loadingV3;
}

export async function getRecaptchaToken(action: string) {
	const grecaptcha = await loadRecaptcha();
	return grecaptcha.execute(siteKey, { action });
}

function loadRecaptchaV2() {
	loadingV2 ??= loadScript(
		"https://www.google.com/recaptcha/enterprise.js?render=explicit&hl=pt-BR",
		() => window.grecaptcha?.enterprise,
	)
		.then(
			(enterprise) =>
				new Promise<GrecaptchaEnterprise>((resolve) =>
					enterprise.ready(() => resolve(enterprise)),
				),
		)
		.catch((error) => {
			loadingV2 = null;
			throw error;
		});

	return loadingV2;
}

export async function renderRecaptchaV2(
	container: HTMLElement,
	onChange: (token: string | null) => void,
) {
	const enterprise = await loadRecaptchaV2();
	enterprise.render(container, {
		sitekey: siteKeyV2,
		action: "LOGIN",
		callback: onChange,
		"expired-callback": () => onChange(null),
	});
}
