import { Outlet } from "react-router";

import { AuthShowcase } from "~/features/auth/components/auth-showcase";

export default function AuthLayout() {
	return (
		<div className="min-h-dvh bg-background lg:flex lg:items-center lg:justify-center lg:p-8">
			<div className="grid w-full items-center lg:max-w-6xl lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-8">
				<AuthShowcase />

				<main
					id="conteudo"
					className="flex justify-center px-4 pt-8 pb-12 lg:items-center lg:px-10 lg:py-16"
				>
					<div className="flex w-full max-w-sm flex-col gap-6">
						<Outlet />
					</div>
				</main>
			</div>
		</div>
	);
}
