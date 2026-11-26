export type AuthNotice = { notice: string; email?: string };

export function readNotice(state: unknown): AuthNotice | null {
	if (!state || typeof state !== "object") return null;
	const { notice, email } = state as Record<string, unknown>;
	if (typeof notice !== "string") return null;
	return { notice, email: typeof email === "string" ? email : undefined };
}
