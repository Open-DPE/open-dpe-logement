import { define, getName, BaseComponent } from "../shared/components.js";
import { ETIQUETTE_CLIMAT_COLORS as COLORS } from "../shared/colors.js";
import "../icon-etiquette/index.js";

const ICON_COLOR = "white";

export class ClasseClimat extends BaseComponent {
	static observedAttributes = ["value", "size"];

	protected render() {
		if (!this.shadowRoot) return;

		const value = this.getAttribute("value") || "";

		if (!value) {
			console.warn("ClasseClimat: 'value' attribute is required.");
			return;
		}
		if (!Object.keys(COLORS).includes(value)) {
			console.warn(`ClasseClimat: unknown value "${value}".`);
			return;
		}
		const size = Number(this.getAttribute("size")) || 24;
		const color = COLORS[value];
		const iconTag = getName("icon-etiquette");

		this.shadowRoot.innerHTML = `
			<style>
        :host {
					display: inline-flex;
					align-items: center;
					justify-content: center;
          background-color: ${color};
        }
      </style>
			<${iconTag} value="${value}" color="${ICON_COLOR}" size="${size}"></${iconTag}>
		`;
	}
}

define("classe-climat", ClasseClimat);
