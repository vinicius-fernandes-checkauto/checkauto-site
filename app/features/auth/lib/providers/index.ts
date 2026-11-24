import type { Session } from "~/shared/lib/session";

import { type Credentials, CredentialsProvider } from "./credentials-provider";

type Provider<Input> = {
	authorize: (input: Input) => Promise<Session>;
};

type ProviderInputs = {
	credentials: Credentials;
};

export type AuthProvider = keyof ProviderInputs;

export type ProviderInput<P extends AuthProvider> = ProviderInputs[P];

export const providers: { [P in AuthProvider]: Provider<ProviderInputs[P]> } = {
	credentials: CredentialsProvider,
};
