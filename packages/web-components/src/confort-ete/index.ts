import { CONFORT_ETE_COLORS as COLORS } from "../shared/colors.js";
import { define, getName } from "../shared/components.js";
import "../enum/index.js";

export class ConfortEte extends HTMLElement {
	static observedAttributes = ["value"];

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.render();
	}

	attributeChangedCallback() {
		this.render();
	}

	private render() {
		if (!this.shadowRoot) return;

		const value = this.getAttribute("value") || "";

		if (!value) {
			console.warn("ConfortEte: 'value' attribute is required.");
			return;
		}
		if (!Object.keys(COLORS).includes(value)) {
			console.warn(`ConfortEte: unknown value "${value}".`);
			return;
		}
		const color = COLORS[value];
		const enumName = getName("enum");

		this.shadowRoot.innerHTML = `
			<style>
				:host {
					display: inline-block;
					background-color: ${color};
          color: #FFFFFF;
					text-align: center;
				}
			</style>
			<${enumName} name="confort-ete" value="${value}" ></${enumName}>
		`;
	}
}

define("confort-ete", ConfortEte);
