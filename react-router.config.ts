import type { Config } from "@react-router/dev/config";

import { plans } from "./app/shared/config/plans";

export default {
	ssr: false,
	async prerender({ getStaticPaths }) {
		return [...getStaticPaths(), ...plans.map((plan) => plan.detailsUrl)];
	},
} satisfies Config;
