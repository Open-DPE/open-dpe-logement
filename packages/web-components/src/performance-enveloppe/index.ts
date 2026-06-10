import { PERFORMANCE_COLORS } from "../shared/colors";
import { renderChips } from "../shared/utils";

function getColor(ubat: number): string {
	if (ubat <= 0.45) return PERFORMANCE_COLORS[1];
	else if (ubat <= 0.65) return PERFORMANCE_COLORS[2];
	else if (ubat <= 0.85) return PERFORMANCE_COLORS[3];
	return PERFORMANCE_COLORS[4];
}

export function renderPerformanceEnveloppe(props: {
	ubat: number;
	style?: string | null | undefined;
}): string {
	const { ubat, style } = props;
	const color = getColor(ubat);
	const text = ubat.toLocaleString();
	return renderChips({ text, color, textColor: "#FFFFFF", style });
}

export class PerformanceEnveloppe extends HTMLElement {
	static observedAttributes = ["ubat", "style"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const ubat = Number(this.getAttribute("ubat"));
		const style = this.getAttribute("style");
		this.innerHTML = renderPerformanceEnveloppe({ ubat, style });
	}
}

const HTML_TAG = "open-dpe-performance-enveloppe";

if (!customElements.get(HTML_TAG)) {
	customElements.define(HTML_TAG, PerformanceEnveloppe);
}
