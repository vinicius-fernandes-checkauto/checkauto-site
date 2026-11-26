export type AuthNotice = { notice: string; email?: string };

export function readNotice(state: unknown): AuthNotice | null {
	if (!state || typeof state !== "object") return null;
	const { notice, email } = state as Record<string, unknown>;
	if (typeof notice !== "string") return null;
	return { notice, email: typeof email === "string" ? email : undefined };
}

export function readEmail(state: unknown) {
	if (!state || typeof state !== "object") return "";
	const { email } = state as Record<string, unknown>;
	return typeof email === "string" ? email : "";
}
