import { createCn } from "cn/config";

export const cn = createCn({
	extend: {
		classGroups: {
			"font-size": [
				{
					text: [
						"display",
						"display-sm",
						"h2",
						"h2-sm",
						"h3",
						"h4",
						"h5",
						"stat",
						"eyebrow",
						"button",
						"lead",
						"body",
						"small",
						"label",
						"caption",
					],
				},
			],
		},
	},
});
