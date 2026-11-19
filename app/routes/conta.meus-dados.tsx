import type { Route } from "./+types/conta.meus-dados";

export const meta: Route.MetaFunction = () => [
	{ title: "Meus dados | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountProfile() {
	return <h1 className="sr-only">Meus dados</h1>;
}
