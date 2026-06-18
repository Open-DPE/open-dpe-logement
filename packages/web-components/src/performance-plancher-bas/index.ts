import { PERFORMANCE_COLORS } from "../shared/colors";
import { define, BasePerformance } from "../shared/components.js";

const THRESHOLDS: [number, number, number] = [0.25, 0.45, 0.65];

function getColor(u: number): string {
	const [t1, t2, t3] = THRESHOLDS;
	if (u <= t1) return PERFORMANCE_COLORS["A"];
	else if (u <= t2) return PERFORMANCE_COLORS["B"];
	else if (u <= t3) return PERFORMANCE_COLORS["C"];
	return PERFORMANCE_COLORS["D"];
}

export class PerformancePlancherBas extends BasePerformance {
	static observedAttributes = ["u"];

	protected parse(): { color: string; text: string } | null {
		const u = Number(this.getAttribute("u"));

		if (Number.isNaN(u)) {
			console.warn(`PerformancePlancherBas: Invalid u value: ${u}`);
			return null;
		}

		return { color: getColor(u), text: u.toFixed(2) };
	}
}

define("performance-plancher-bas", PerformancePlancherBas);
