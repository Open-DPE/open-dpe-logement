import { PERFORMANCE_COLORS } from "../shared/colors";
import { renderChips } from "../shared/utils";

function getColor(u: number): string {
	if (u <= 1.6) return PERFORMANCE_COLORS[1];
	else if (u <= 2.2) return PERFORMANCE_COLORS[2];
	else if (u <= 3) return PERFORMANCE_COLORS[3];
	return PERFORMANCE_COLORS[4];
}

export function renderPerformanceMenuiserie(props: {
	u: number;
	style?: string | null | undefined;
}): string {
	const { u, style } = props;
	const color = getColor(u);
	const text = u.toFixed(2);
	return renderChips({ text, color, textColor: "#FFFFFF", style });
}

export class PerformanceMenuiserie extends HTMLElement {
	static observedAttributes = ["u", "style"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const u = Number(this.getAttribute("u"));
		const style = this.getAttribute("style");
		this.innerHTML = renderPerformanceMenuiserie({ u, style });
	}
}

const HTML_TAG = "open-dpe-logement-performance-menuiserie";

if (!customElements.get(HTML_TAG)) {
	customElements.define(HTML_TAG, PerformanceMenuiserie);
}
