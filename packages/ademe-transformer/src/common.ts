export function fromOuiNon(value: 0 | 1 | null): boolean | null {
	if (value === null) return null;
	return value === 1;
}

export function toOuiNon(value: boolean | null): 0 | 1 | null {
	if (value === null) return null;
	return value ? 1 : 0;
}
