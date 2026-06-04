export type SelfMapping<T extends Record<string, string>> = {
	[K in keyof T]: K;
};

export function buildEnum<T extends string | number>(
	values: readonly T[],
): { [K in T]: K } {
	return Object.fromEntries(values.map((v) => [v, v])) as { [K in T]: K };
}
