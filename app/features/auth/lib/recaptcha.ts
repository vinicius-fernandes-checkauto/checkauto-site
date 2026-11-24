type Grecaptcha = {
	ready: (callback: () => void) => void;
	execute: (siteKey: string, options: { action: string }) => Promise<string>;
};

declare global {
	interface Window {
		grecaptcha?: Grecaptcha;
	}
}

const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

let loading: Promise<Grecaptcha> | null = null;

export function loadRecaptcha() {
	loading ??= new Promise<Grecaptcha>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
		script.async = true;
		script.onload = () => {
			const grecaptcha = window.grecaptcha;
			if (grecaptcha) grecaptcha.ready(() => resolve(grecaptcha));
			else reject(new Error("reCAPTCHA indisponível"));
		};
		script.onerror = () => {
			loading = null;
			reject(new Error("reCAPTCHA indisponível"));
		};
		document.head.append(script);
	});

	return loading;
}

export async function getRecaptchaToken(action: string) {
	const grecaptcha = await loadRecaptcha();
	return grecaptcha.execute(siteKey, { action });
}
