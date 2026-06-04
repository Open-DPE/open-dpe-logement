import * as math from "mathjs";

/**
 * Arrondi un nombre à une précision définie
 */
export function round(value: number): number;
export function round(value: null): null;
export function round(value: number | null): number | null {
	if (value === null) return null;
	return parseFloat(value.toFixed(2));
}

/**
 * Moyenne simple ou pondérée
 */
export const average = (props: {
	values: number[];
	weights?: number[];
}): number => {
	const { values, weights } = props;

	if (0 === values.length) {
		throw new Error("La liste des valeurs est vide.");
	}
	if (!weights) {
		return values.reduce((a, b) => a + b, 0) / values.length;
	}
	if (values.length !== weights.length) {
		throw new Error(
			"Les listes 'values' et 'weights' doivent avoir la même longueur.",
		);
	}
	const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

	if (totalWeight !== 1) {
		throw new Error("La somme des poids ('weights') doit être égale à 1.");
	}

	const weightedSum = values.reduce(
		(sum, value, index) => sum + value * weights[index]!,
		0,
	);

	return weightedSum / totalWeight;
};

/**
 * Interpolation linéaire / extrapolation
 */
export const linearInterpolate = (
	x: number,
	points: { x: number; y: number }[],
): number => {
	const match = points.find((point) => point.x === x);
	if (match) return match.y;

	if (points.length < 2) {
		throw new Error("La liste des points doit contenir au moins deux valeurs.");
	}

	const sorted = [...points].sort((a, b) => a.x - b.x);

	let i = sorted.findIndex((p) => p.x > x);
	if (i === -1) i = sorted.length - 1;
	if (i === 0) i = 1;

	const p0 = sorted[i - 1]!;
	const p1 = sorted[i]!;

	return p0.y + ((p1.y - p0.y) * (x - p0.x)) / (p1.x - p0.x);
};

/**
 * Interpolation et extrapolation bilinéaire
 */
export const bilinearInterpolate = (
	x: number,
	y: number,
	points: { x: number; y: number; q: number }[],
): number => {
	const match = points.find((point) => point.x === x && point.y === y);
	if (match) return match.q;

	if (points.length < 4) {
		throw new Error(
			"La liste des points doit contenir au moins quatre valeurs.",
		);
	}

	const sortedXs = [...new Set(points.map((p) => p.x))].sort((a, b) => a - b);
	const sortedYs = [...new Set(points.map((p) => p.y))].sort((a, b) => a - b);

	let xi = sortedXs.findIndex((v) => v > x);
	if (xi === -1) xi = sortedXs.length - 1;
	if (xi === 0) xi = 1;
	const x1 = sortedXs[xi - 1]!;
	const x2 = sortedXs[xi]!;

	let yi = sortedYs.findIndex((v) => v > y);
	if (yi === -1) yi = sortedYs.length - 1;
	if (yi === 0) yi = 1;
	const y1 = sortedYs[yi - 1]!;
	const y2 = sortedYs[yi]!;

	const findQ = (px: number, py: number): number => {
		const p = points.find((pt) => pt.x === px && pt.y === py);
		if (!p)
			throw new Error(`Point (${px}, ${py}) absent de la grille d'abaque.`);
		return p.q;
	};

	const q11 = findQ(x1, y1);
	const q21 = findQ(x2, y1);
	const q12 = findQ(x1, y2);
	const q22 = findQ(x2, y2);

	let q = (((x2 - x) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * q11;
	q += (((x - x1) * (y2 - y)) / ((x2 - x1) * (y2 - y1))) * q21;
	q += (((x2 - x) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * q12;
	q += (((x - x1) * (y - y1)) / ((x2 - x1) * (y2 - y1))) * q22;
	return q;
};

/**
 * Évalue une expression mathématique
 */
export const evaluate = (
	expr: string,
	scope?: Record<string, number>,
): number => {
	return math.evaluate(expr, scope);
};
