export type AbaqueQuery = Record<
	string,
	string | number | boolean | null | undefined
>;

const RANGE_OPS = ["eq", "gte", "gt", "lte", "lt"] as const;
type RangeOp = (typeof RANGE_OPS)[number];

function matchRange(value: number, op: RangeOp, bound: number): boolean {
	switch (op) {
		case "eq":
			return value === bound;
		case "gte":
			return value >= bound;
		case "gt":
			return value > bound;
		case "lte":
			return value <= bound;
		case "lt":
			return value < bound;
	}
}

function matchCell(
	cell: unknown,
	queryValue: string | number | boolean,
): boolean {
	if (cell === null || cell === undefined) return true;
	if (typeof cell === "boolean") {
		if (queryValue === true || queryValue === 1 || queryValue === "1")
			return cell === true;
		if (queryValue === false || queryValue === 0 || queryValue === "0")
			return cell === false;
		return false;
	}
	if (typeof cell === "number") {
		return cell === Number(queryValue);
	}
	if (typeof cell === "string") {
		const values = cell.includes("|") ? cell.split("|") : [cell];
		return values.includes(String(queryValue));
	}
	return false;
}

function rowMatchesQuery(
	row: Record<string, unknown>,
	query: AbaqueQuery,
): boolean {
	for (const [key, queryValue] of Object.entries(query)) {
		if (queryValue === undefined) continue;

		const rangeEntries: Array<[RangeOp, number | null]> = [];
		for (const op of RANGE_OPS) {
			const rangeKey = `${key}/${op}`;
			if (rangeKey in row) {
				const bound = row[rangeKey];
				rangeEntries.push([op, typeof bound === "number" ? bound : null]);
			}
		}

		if (rangeEntries.length > 0) {
			if (queryValue === null) {
				if (rangeEntries.some(([, b]) => b !== null)) return false;
				continue;
			}
			const num = Number(queryValue);
			if (isNaN(num)) return false;
			for (const [op, bound] of rangeEntries) {
				if (bound === null) continue;
				if (!matchRange(num, op, bound)) return false;
			}
			continue;
		}

		const cell = row[key];
		if (queryValue === null) {
			if (cell !== null && cell !== undefined) return false;
			continue;
		}
		if (!matchCell(cell, queryValue)) return false;
	}
	return true;
}

export function filter<S extends object>(query: AbaqueQuery, rows: S[]): S[] {
	return rows.filter((row) =>
		rowMatchesQuery(row as Record<string, unknown>, query),
	);
}
