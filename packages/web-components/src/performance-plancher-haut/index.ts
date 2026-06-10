import { enveloppe } from "@open-dpe-logement/models";
import { PERFORMANCE_COLORS } from "../shared/colors";
import { renderChips } from "../shared/utils";

type Configuration = enveloppe.plancherHaut.Configuration;
const ConfigurationEnum = enveloppe.plancherHaut.ConfigurationEnum;

function getColor(configuration: Configuration, u: number): string {
	switch (configuration) {
		case ConfigurationEnum.plancher: {
			if (u <= 0.15) return PERFORMANCE_COLORS[1];
			else if (u <= 0.2) return PERFORMANCE_COLORS[2];
			else if (u <= 0.3) return PERFORMANCE_COLORS[3];
			return PERFORMANCE_COLORS[4];
		}

		case ConfigurationEnum.rampants: {
			if (u <= 0.18) return PERFORMANCE_COLORS[1];
			else if (u <= 0.25) return PERFORMANCE_COLORS[2];
			else if (u <= 0.35) return PERFORMANCE_COLORS[3];
			return PERFORMANCE_COLORS[4];
		}

		case ConfigurationEnum.terrasse: {
			if (u <= 0.25) return PERFORMANCE_COLORS[1];
			else if (u <= 0.45) return PERFORMANCE_COLORS[2];
			else if (u <= 0.65) return PERFORMANCE_COLORS[3];
			return PERFORMANCE_COLORS[4];
		}
	}
}

export function renderPerformancePlancherHaut(props: {
	configuration: Configuration;
	u: number;
	style?: string | null | undefined;
}): string {
	const { configuration, u, style } = props;
	const color = getColor(configuration, u);
	const text = u.toLocaleString();
	return renderChips({ text, color, textColor: "#FFFFFF", style });
}

export class PerformancePlancherHaut extends HTMLElement {
	static observedAttributes = ["configuration", "u", "style"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const configuration = this.getAttribute("configuration") as Configuration;
		const u = Number(this.getAttribute("u"));
		const style = this.getAttribute("style");
		this.innerHTML = renderPerformancePlancherHaut({ configuration, u, style });
	}
}

const HTML_TAG = "open-dpe-performance-plancher-haut";

if (!customElements.get(HTML_TAG)) {
	customElements.define(HTML_TAG, PerformancePlancherHaut);
}
