type RenderOptions = {
	sitekey: string;
	action?: string;
	callback: (token: string) => void;
	"expired-callback"?: () => void;
};

type Grecaptcha = {
	ready: (callback: () => void) => void;
	execute?: (siteKey: string, options: { action: string }) => Promise<string>;
	enterprise?: {
		ready: (callback: () => void) => void;
		render?: (container: HTMLElement, options: RenderOptions) => number;
		reset: (widgetId?: number) => void;
	};
};

declare global {
	interface Window {
		grecaptcha?: Grecaptcha;
		___grecaptcha_cfg?: unknown;
	}
}

const V3_SRC = "https://www.google.com/recaptcha/api.js?render=";
const V2_SRC = "https://www.google.com/recaptcha/enterprise.js?render=explicit";

const loading = new Map<string, Promise<void>>();

function loadScript(src: string) {
	const existing = loading.get(src);
	if (existing) return existing;

	const promise = new Promise<void>((resolve, reject) => {
		const script = document.createElement("script");
		script.src = src;
		script.async = true;
		script.onload = () => resolve();
		script.onerror = () => {
			loading.delete(src);
			script.remove();
			reject(
				new Error("Não foi possível carregar a verificação de segurança."),
			);
		};
		document.head.appendChild(script);
	});

	loading.set(src, promise);
	return promise;
}

export function removeRecaptcha() {
	for (const element of document.querySelectorAll(
		'script[src*="recaptcha"], .grecaptcha-badge',
	)) {
		element.remove();
	}
	loading.clear();
	delete window.grecaptcha;
	delete window.___grecaptcha_cfg;
}

export async function getRecaptchaV3Token(siteKey: string, action: string) {
	await loadScript(`${V3_SRC}${siteKey}`);
	const loaded = window.grecaptcha;
	if (!loaded?.ready) {
		throw new Error("Verificação de segurança indisponível.");
	}
	await new Promise<void>((resolve) => loaded.ready(resolve));
	const ready = window.grecaptcha;
	if (!ready?.execute) {
		throw new Error("Verificação de segurança indisponível.");
	}
	return ready.execute(siteKey, { action });
}

export async function renderRecaptchaV2(
	container: HTMLElement,
	options: RenderOptions,
) {
	await loadScript(V2_SRC);
	const loaded = window.grecaptcha?.enterprise;
	if (!loaded?.ready) {
		throw new Error("Verificação de segurança indisponível.");
	}
	await new Promise<void>((resolve) => loaded.ready(resolve));
	const ready = window.grecaptcha?.enterprise;
	if (!ready?.render) {
		throw new Error("Verificação de segurança indisponível.");
	}
	return ready.render(container, options);
}
