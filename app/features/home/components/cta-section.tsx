import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";

import { PlateForm } from "./plate-form";

export function CtaSection() {
	return (
		<section
			aria-labelledby="cta-titulo"
			className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-8 lg:pb-24"
		>
			<div className="relative isolate flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] bg-navy-100 px-6 py-14 text-center sm:px-10 lg:rounded-[2.5rem] lg:py-20">
				<img
					src={ring}
					alt=""
					aria-hidden="true"
					width={896}
					height={900}
					loading="lazy"
					decoding="async"
					className="pointer-events-none absolute -bottom-40 -left-32 -z-10 w-104 opacity-[0.07] lg:-bottom-64 lg:w-160"
				/>
				<h2 id="cta-titulo" className="text-h2-sm text-balance lg:text-h2">
					Confira o histórico agora mesmo!
				</h2>
				<div className="flex w-full max-w-lg flex-col items-center">
					<PlateForm />
					<Link
						to="/ainda-nao-tenho-placa"
						className="-mt-1 inline-flex min-h-11 w-fit items-center px-5 text-small font-medium text-heading underline decoration-1 underline-offset-4 hover:decoration-2"
					>
						Ainda não tenho a placa
					</Link>
				</div>
			</div>
		</section>
	);
}
