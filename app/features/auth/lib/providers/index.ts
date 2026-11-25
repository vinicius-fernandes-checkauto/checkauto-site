import type { Session } from "~/shared/lib/session";

import { type Credentials, CredentialsProvider } from "./credentials-provider";
import { GoogleProvider } from "./google-provider";

type Provider<Input> = {
	authorize: (input: Input) => Promise<Session>;
};

type ProviderInputs = {
	credentials: Credentials;
	google: undefined;
};

export type AuthProvider = keyof ProviderInputs;

export type ProviderInput<P extends AuthProvider> = ProviderInputs[P];

export const providers: { [P in AuthProvider]: Provider<ProviderInputs[P]> } = {
	credentials: CredentialsProvider,
	google: GoogleProvider,
};
