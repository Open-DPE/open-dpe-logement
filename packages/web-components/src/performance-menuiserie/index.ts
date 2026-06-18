import { PERFORMANCE_COLORS } from "../shared/colors";
import { define, BasePerformance } from "../shared/components.js";

const THRESHOLDS: [number, number, number] = [1.6, 2.2, 3];

function getColor(u: number): string {
	const [t1, t2, t3] = THRESHOLDS;
	if (u <= t1) return PERFORMANCE_COLORS["A"];
	else if (u <= t2) return PERFORMANCE_COLORS["B"];
	else if (u <= t3) return PERFORMANCE_COLORS["C"];
	return PERFORMANCE_COLORS["D"];
}

export class PerformanceMenuiserie extends BasePerformance {
	static observedAttributes = ["u"];

	protected parse(): { color: string; text: string } | null {
		const u = Number(this.getAttribute("u"));

		if (Number.isNaN(u)) {
			console.warn(`PerformanceMenuiserie: Invalid u value: ${u}`);
			return null;
		}

		return { color: getColor(u), text: u.toFixed(2) };
	}
}

define("performance-menuiserie", PerformanceMenuiserie);
