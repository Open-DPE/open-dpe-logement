import { enveloppe } from "@open-dpe-logement/models";
import { PERFORMANCE_COLORS } from "../shared/colors";
import { define, BasePerformance } from "../shared/components.js";

type ConfigurationPlancherHaut =
	enveloppe.plancherHaut.ConfigurationPlancherHaut;
const ConfigurationPlancherHaut =
	enveloppe.plancherHaut.ConfigurationPlancherHaut;

const THRESHOLDS: Record<ConfigurationPlancherHaut, [number, number, number]> =
	{
		[ConfigurationPlancherHaut.enum.plancher]: [0.15, 0.2, 0.3],
		[ConfigurationPlancherHaut.enum.rampants]: [0.18, 0.25, 0.35],
		[ConfigurationPlancherHaut.enum.terrasse]: [0.25, 0.45, 0.65],
	};

function getColor(configuration: ConfigurationPlancherHaut, u: number): string {
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
		) as ConfigurationPlancherHaut | null;

		if (Number.isNaN(u)) {
			console.warn(`PerformancePlancherHaut: Invalid u value: ${u}`);
			return null;
		}
		if (
			configuration === null ||
			!ConfigurationPlancherHaut.options.includes(configuration)
		) {
			console.warn(`PerformancePlancherHaut: Invalid configuration attribute`);
			return null;
		}
		return { color: getColor(configuration, u), text: u.toFixed(2), u };
	}
}

define("performance-plancher-haut", PerformancePlancherHaut);
