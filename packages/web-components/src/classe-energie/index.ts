import * as models from "@open-dpe-logement/models";
import { renderEtiquette } from "../etiquette/index.js";
import { ETIQUETTE_ENERGIE_COLORS } from "../shared/colors.js";

export function renderClasseEnergie(props: {
	value: models.diagnostic.Etiquette;
	size?: number | null | undefined;
}): string {
	const { value, size = 32 } = props;
	const color = ETIQUETTE_ENERGIE_COLORS[value] ?? "#000000";
	const icon = renderEtiquette({ value, style: "width: 100%; height: auto;" });
	const style = `display: inline-block; width: ${size}px; height: ${size}px; background-color: ${color}; padding: 0.2rem;`;
	return `<span style="${style}">${icon}</span>`;
}

export class ClasseEnergie extends HTMLElement {
	static observedAttributes = ["value", "size"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const value = this.getAttribute("value") as models.diagnostic.Etiquette;
		const size = Number(this.getAttribute("size"));
		this.innerHTML = renderClasseEnergie({ value, size });
	}
}

const HTML_TAG = "open-dpe-logement-classe-energie";

if (!customElements.get(HTML_TAG)) {
	customElements.define(HTML_TAG, ClasseEnergie);
}
