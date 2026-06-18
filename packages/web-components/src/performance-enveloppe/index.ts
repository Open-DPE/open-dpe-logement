import { PERFORMANCE_COLORS } from "../shared/colors";
import { define, BasePerformance } from "../shared/components.js";

const THRESHOLDS: [number, number, number] = [0.45, 0.65, 0.85];

function getColor(ubat: number): string {
	const [t1, t2, t3] = THRESHOLDS;
	if (ubat <= t1) return PERFORMANCE_COLORS["A"];
	if (ubat <= t2) return PERFORMANCE_COLORS["B"];
	if (ubat <= t3) return PERFORMANCE_COLORS["C"];
	return PERFORMANCE_COLORS["D"];
}

export class PerformanceEnveloppe extends BasePerformance {
	static observedAttributes = ["ubat"];

	protected parse(): { color: string; text: string } | null {
		const ubat = Number(this.getAttribute("ubat"));

		if (Number.isNaN(ubat)) {
			console.warn(`PerformanceEnveloppe: Invalid ubat value: ${ubat}`);
			return null;
		}

		return { color: getColor(ubat), text: ubat.toFixed(2) };
	}
}

define("performance-enveloppe", PerformanceEnveloppe);
