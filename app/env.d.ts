interface ImportMetaEnv {
	readonly VITE_API_URL?: string;
	readonly VITE_API_TIMEOUT?: string;
	readonly VITE_RECAPTCHA_SITE_KEY?: string;
	readonly VITE_RECAPTCHA_V2_SITE_KEY?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
