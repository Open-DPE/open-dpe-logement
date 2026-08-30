import { enveloppe } from "@open-dpe-logement/models";
import { PERFORMANCE_COLORS } from "../shared/colors";
import { define, BasePerformance } from "../shared/components.js";

type ConfigurationEnum = enveloppe.plancherHaut.ConfigurationEnum;
const CONFIGURATIONS = enveloppe.plancherHaut.CONFIGURATIONS;

const THRESHOLDS: Record<ConfigurationEnum, [number, number, number]> = {
	[CONFIGURATIONS.plancher]: [0.15, 0.2, 0.3],
	[CONFIGURATIONS.rampants]: [0.18, 0.25, 0.35],
	[CONFIGURATIONS.terrasse]: [0.25, 0.45, 0.65],
};

function getColor(configuration: ConfigurationEnum, u: number): string {
	const [t1, t2, t3] = THRESHOLDS[configuration];
	if (u <= t1) return PERFORMANCE_COLORS["A"];
	if (u <= t2) return PERFORMANCE_COLORS["B"];
	if (u <= t3) return PERFORMANCE_COLORS["C"];
	return PERFORMANCE_COLORS["D"];
}

export class PerformancePlancherHaut extends BasePerformance {
	static observedAttributes = ["configuration", "u"];

	protected parse() {
		const u = Number(this.getAttribute("u"));
		const configuration = this.getAttribute(
			"configuration",
		) as ConfigurationEnum | null;

		if (Number.isNaN(u)) {
			console.warn(`PerformancePlancherHaut: Invalid u value: ${u}`);
			return null;
		}
		if (
			configuration === null ||
			!Object.values(CONFIGURATIONS).includes(configuration)
		) {
			console.warn(`PerformancePlancherHaut: Invalid configuration attribute`);
			return null;
		}
		return { color: getColor(configuration, u), text: u.toFixed(2), u };
	}
}

define("performance-plancher-haut", PerformancePlancherHaut);
