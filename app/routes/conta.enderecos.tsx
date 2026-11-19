import type { Route } from "./+types/conta.enderecos";

export const meta: Route.MetaFunction = () => [
	{ title: "Endereços | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountAddresses() {
	return <h1 className="sr-only">Endereços</h1>;
}
