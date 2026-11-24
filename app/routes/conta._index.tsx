import { Navigate } from "react-router";

import { accountNav } from "~/shared/content/navigation";

import type { Route } from "./+types/conta._index";

export const meta: Route.MetaFunction = () => [
	{ title: "Minha conta | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function Account() {
	return <Navigate to={accountNav.queries.to} replace />;
}
