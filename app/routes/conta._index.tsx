import { useEffect, useState } from "react";

import {
	demoAccount,
	formatToday,
	getDisplayName,
} from "~/features/account/lib/account";

import type { Route } from "./+types/conta._index";

export const meta: Route.MetaFunction = () => [
	{ title: "Minha conta | Checkauto" },
	{ name: "robots", content: "noindex" },
];

export default function Account() {
	const [today, setToday] = useState("");

	useEffect(() => {
		setToday(formatToday(new Date()));
	}, []);

	return (
		<header className="flex flex-col gap-1.5 pt-1">
			{/* <p className="min-h-5 text-sm/5 text-muted-foreground">{today}</p> */}
			<p className="min-h-5 text-sm/5 text-muted-foreground">Olá,</p>
			<h1 className="text-3xl/tight font-medium tracking-tight text-heading lg:text-4xl/tight">
				{/* Olá, {getDisplayName(demoAccount.name)} */}
				{getDisplayName(demoAccount.name)}
			</h1>
		</header>
	);
}
