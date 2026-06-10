import * as models from "@open-dpe-logement/models";
import { renderEnum } from "../enum/index.js";
import { PERFORMANCE_COLORS } from "../shared/colors.js";

export function renderConfortEte(props: {
	value: models.diagnostic.ConfortEte;
}): string {
	const { value } = props;
	const color = PERFORMANCE_COLORS[value] ?? "#000000";
	const style = `background-color: ${color}; color: #FFFFFF; padding: 4px; font-size: 0.9rem; font-weight: 600; text-transform: uppercase;`;
	const text = renderEnum("confort-ete", value);
	return `<span style="${style}">${text}</span>`;
}

export class ConfortEte extends HTMLElement {
	static observedAttributes = ["value"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const value = Number(
			this.getAttribute("value"),
		) as models.diagnostic.ConfortEte;
		this.innerHTML = renderConfortEte({ value });
	}
}

const HTML_TAG = "open-dpe-confort-ete";

if (!customElements.get(HTML_TAG)) {
	customElements.define(HTML_TAG, ConfortEte);
}
