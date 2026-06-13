import { type Context } from "./context.js";
import { REGISTRY as _REGISTRY } from "../rules/rules.js";

export type Item = { id: string; [key: string]: unknown };

export type Rule<I extends Item = Item, R = unknown> =
	| ((ctx: Context) => R)
	| ((ctx: Context, item: I) => R);

type IsValidRule<F> = F extends (ctx: Context) => any
	? true
	: F extends (ctx: Context, item: infer I) => any
		? I extends Item
			? true
			: false
		: false;

export type Registry = {
	[N in keyof typeof _REGISTRY]: {
		[K in keyof (typeof _REGISTRY)[N]]: IsValidRule<
			(typeof _REGISTRY)[N][K]
		> extends true
			? (typeof _REGISTRY)[N][K]
			: never;
	};
};

function assertRegistry<T extends Registry>(registry: T): T {
	return registry;
}

export const REGISTRY = assertRegistry(_REGISTRY);

export type Namespace = keyof typeof REGISTRY;
export type Key<N extends Namespace> = keyof (typeof REGISTRY)[N];

export type RuleOf<
	N extends Namespace,
	K extends Key<N>,
> = (typeof REGISTRY)[N][K];

export type RuleReturn<N extends Namespace, K extends Key<N>> =
	RuleOf<N, K> extends (...args: any) => infer R ? R : never;

export type RuleArgs<N extends Namespace, K extends Key<N>> =
	RuleOf<N, K> extends (ctx: Context, ...rest: infer R) => any ? R : never;
