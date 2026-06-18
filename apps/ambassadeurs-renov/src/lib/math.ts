export function toHundred(values: number[]): number[] {
	const total = values.reduce((a, b) => a + b, 0);
	const normalized = values.map((v) => (v / total) * 100);
	const floored = normalized.map((v) => Math.floor(v));
	const missing = 100 - floored.reduce((a, b) => a + b, 0);

	if (missing > 0) {
		normalized
			.map((v, index) => ({ index, remainder: v - (floored[index] ?? 0) }))
			.sort((a, b) => b.remainder - a.remainder)
			.slice(0, missing)
			.forEach(({ index }) => (floored[index] = (floored[index] ?? 0) + 1));
	}

	return floored;
}

export function objectToHundred<T extends Record<string, number>>(
	values: T,
): Record<keyof T, number> {
	const keys = Object.keys(values);
	const raw = Object.values(values);
	const total = raw.reduce((a, b) => a + b, 0);

	const normalized = raw.map((v) => (v / total) * 100);
	const floored = normalized.map((v) => Math.floor(v));
	const missing = 100 - floored.reduce((a, b) => a + b, 0);

	if (missing > 0) {
		normalized
			.map((v, index) => ({ index, remainder: v - (floored[index] ?? 0) }))
			.sort((a, b) => b.remainder - a.remainder)
			.slice(0, missing)
			.forEach(({ index }) => {
				floored[index] = (floored[index] ?? 0) + 1;
			});
	}

	return Object.fromEntries(
		keys.map((key, i) => [key, floored[i] ?? 0]),
	) as Record<keyof T, number>;
}
