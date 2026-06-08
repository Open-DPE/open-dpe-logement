import { enveloppe } from "@open-dpe-logement/models";
import { COLORS, renderPerformanceLabel } from "./utils";

type Configuration = enveloppe.plancherHaut.Configuration;
const ConfigurationEnum = enveloppe.plancherHaut.ConfigurationEnum;

function getColor(configuration: Configuration, u: number): string {
	switch (configuration) {
		case ConfigurationEnum.plancher: {
			if (u <= 0.15) return COLORS[1];
			else if (u <= 0.2) return COLORS[2];
			else if (u <= 0.3) return COLORS[3];
			return COLORS[4];
		}

		case ConfigurationEnum.rampants: {
			if (u <= 0.18) return COLORS[1];
			else if (u <= 0.25) return COLORS[2];
			else if (u <= 0.35) return COLORS[3];
			return COLORS[4];
		}

		case ConfigurationEnum.terrasse: {
			if (u <= 0.25) return COLORS[1];
			else if (u <= 0.45) return COLORS[2];
			else if (u <= 0.65) return COLORS[3];
			return COLORS[4];
		}
	}
}

export function renderPerformancePlancherHautLabel(props: {
	configuration: Configuration;
	u: number;
}): string {
	const color = getColor(props.configuration, props.u);
	const text = props.u.toLocaleString();
	return renderPerformanceLabel({ text, color });
}
