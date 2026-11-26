import type {
	Credentials,
	LoginResponse,
} from "~/domains/auth/types/auth.types";

import { CredentialsProvider } from "./credentials.provider";
import { GoogleProvider } from "./google.provider";

type ProviderInputs = {
	credentials: Credentials;
	google: { idToken: string };
};

export type AuthProvider = keyof ProviderInputs;

export type ProviderInput<P extends AuthProvider> = ProviderInputs[P];

type Provider<Input> = {
	authorize: (input: Input) => Promise<LoginResponse>;
};

export const providers: { [P in AuthProvider]: Provider<ProviderInputs[P]> } = {
	credentials: CredentialsProvider,
	google: GoogleProvider,
};
