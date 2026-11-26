import { legalNav } from "~/content/navigation";
import { TextLink } from "~/shared/components/text-link";

const privacyLink = legalNav.find(
	({ label }) => label === "Política de privacidade",
);

export function AuthFooter() {
	return (
		<footer className="border-t border-border pt-5 text-center text-sm/6 text-muted-foreground">
			Veja como tratamos seus dados na{" "}
			<TextLink newTab to={privacyLink?.to ?? "/politica-de-privacidade"}>
				política de privacidade
			</TextLink>
			.
		</footer>
	);
}
