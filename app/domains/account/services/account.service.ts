import * as accountApi from "~/domains/account/account.api";
import type {
	AccountProfile,
	UserDetail,
} from "~/domains/account/types/account.types";
import type { ProfileFormValues } from "~/domains/account/utils/account.schema";
import { ApiError } from "~/shared/lib/api";
import { getSession } from "~/shared/lib/session";

const digits = (value: string) => value.replace(/\D/g, "");

export function toProfile(user: UserDetail): AccountProfile {
	const company = user.company?.cnpj
		? {
				corporateName: user.company.corporate_name,
				fantasyName: user.company.fantasy_name,
				cnpj: user.company.cnpj,
				stateRegistration: user.company.state_registration,
			}
		: null;

	const address = user.cep || !user.company?.cep ? user : user.company;

	return {
		id: user.id,
		firstName: user.first_name,
		lastName: user.last_name,
		email: user.email,
		cpf: user.cpf,
		company,
		phone: user.phone,
		zip: address.cep,
		street: address.street,
		number: address.number_address,
		complement: address.complement,
		district: address.district,
		city: address.city,
		state: address.uf.toUpperCase(),
		marketingConsent: user.marketing_consent ?? false,
		termsAcceptedVersion: user.terms_accepted_version,
		termsAcceptedAt: user.terms_accepted_at,
	};
}

function requireSession() {
	const session = getSession();
	if (!session) throw new ApiError("Sua sessão expirou. Entre novamente.", 401);
	return session;
}

export async function getProfile() {
	const { user } = requireSession();
	return toProfile(await accountApi.getUser(user.id));
}

export async function saveProfile(
	profile: AccountProfile,
	values: ProfileFormValues,
) {
	const user = await accountApi.updateUser(profile.id, {
		phone: digits(values.phone),
		cep: digits(values.zip),
		street: values.street,
		number_address: values.number,
		complement: values.complement,
		district: values.district,
		city: values.city,
		uf: values.state,
		marketing_consent: values.marketing,
	});

	return toProfile(user);
}
