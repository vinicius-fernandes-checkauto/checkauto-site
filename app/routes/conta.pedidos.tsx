import type { Route } from "./+types/conta.pedidos";

export const meta: Route.MetaFunction = () => [
	{ title: "Pedidos | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function AccountOrders() {
	return <h1 className="sr-only">Pedidos</h1>;
}
