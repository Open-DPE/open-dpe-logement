export type NamespaceRegistry = Record<string, (...args: any) => any>;
export type RegistryShape = Record<string, NamespaceRegistry>;

export function defineRegistry<T extends RegistryShape>(r: T): T {
	return r;
}

export type RegistryFn<
	R extends RegistryShape,
	N extends keyof R,
	K extends keyof R[N],
> = R[N][K] extends (...args: any) => any ? R[N][K] : never;

export type RegistryReturn<
	R extends RegistryShape,
	N extends keyof R,
	K extends keyof R[N],
> = ReturnType<RegistryFn<R, N, K>>;
