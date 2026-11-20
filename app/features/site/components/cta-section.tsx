import { Link } from "react-router";

import ring from "~/assets/brand/symbol-ring-blue.webp";
import { PlateForm } from "~/features/site/components/plate-form";

export function CtaSection() {
	return (
		<section
			aria-labelledby="cta-titulo"
			className="relative isolate w-full overflow-hidden bg-brand-green/10"
		>
			<div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-8 lg:py-24">
				<span
					aria-hidden="true"
					style={{ maskImage: `url(${ring})` }}
					className="pointer-events-none absolute -bottom-40 -left-32 -z-10 aspect-896/900 w-104 bg-brand-green/10 mask-contain mask-no-repeat max-lg:hidden lg:-bottom-64 lg:w-160"
				/>
				<h2
					id="cta-titulo"
					className="text-3xl/tight font-semibold tracking-tight text-balance lg:text-4xl/tight"
				>
					Confira o histórico agora mesmo!
				</h2>
				<div className="flex w-full max-w-lg flex-col items-center">
					<PlateForm />
					<Link
						to="/ainda-nao-tenho-placa"
						className="-mt-1 inline-flex min-h-11 w-fit items-center px-5 text-sm/5.5 font-medium text-heading underline decoration-1 underline-offset-4 hover:decoration-2"
					>
						Ainda não tenho a placa
					</Link>
				</div>
			</div>
		</section>
	);
}
