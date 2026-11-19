import type { Route } from "./+types/conta.creditos";

export const meta: Route.MetaFunction = () => [
	{ title: "Créditos | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountCredits() {
	return <h1 className="sr-only">Créditos</h1>;
}
