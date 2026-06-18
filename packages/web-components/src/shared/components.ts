const HTML_PREFIX = "open-dpe-logement";

export function define(suffix: string, ctor: CustomElementConstructor) {
	const tag = `${HTML_PREFIX}-${suffix}`;
	if (!customElements.get(tag)) customElements.define(tag, ctor);
}

export function getName(suffix: string) {
	const name = `${HTML_PREFIX}-${suffix}`;
	if (!customElements.get(name)) {
		throw new Error(`Custom element "${name}" is not defined.`);
	}
	return name;
}

export abstract class BaseComponent extends HTMLElement {
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

	protected abstract render(): void;
}

export abstract class BaseIcon extends BaseComponent {
	static observedAttributes = ["size", "color"];

	protected abstract content(): string;

	protected render() {
		if (!this.shadowRoot) return;

		const size = Number(this.getAttribute("size")) || 24;
		this.style.setProperty("--icon-size", `${size}px`);

		const color = this.getAttribute("color");
		if (color) {
			this.style.setProperty("--icon-color", color);
		} else {
			this.style.removeProperty("--icon-color");
		}

		this.shadowRoot.innerHTML = `
      <style>
				:host { display: inline-block; width: var(--icon-size, 24px); height: var(--icon-size, 24px); }
				svg { width: 100%; height: 100%; fill: var(--icon-color, currentColor); }
      </style>
      <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        ${this.content()}
      </svg>
    `;
	}
}

export abstract class DynamicIcon extends BaseIcon {
	static override observedAttributes = [
		...BaseIcon.observedAttributes,
		"value",
	];

	protected abstract registry: Record<string, string>;

	protected content(): string {
		const value = this.getAttribute("value") || "";
		const path = this.registry[value];

		if (!path) {
			console.warn(`<${this.tagName.toLowerCase()}> unknown value: "${value}"`);
			return "";
		}

		return path;
	}
}

export abstract class BaseIllustration extends BaseComponent {
	protected abstract content(): string;
	protected abstract viewBox(): string;

	protected render() {
		if (!this.shadowRoot) return;

		this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; width: 100%; }
        svg { display: block; width: 100%; height: auto; }
      </style>
      <svg viewBox="${this.viewBox()}" xmlns="http://www.w3.org/2000/svg">
        ${this.content()}
      </svg>
    `;
	}
}

export abstract class BasePerformance extends BaseComponent {
	protected abstract parse(): { color: string; text: string } | null;

	protected render() {
		if (!this.shadowRoot) return;

		const parsed = this.parse();
		if (parsed === null) {
			this.shadowRoot.innerHTML = "";
			return;
		}
		const { color, text } = parsed;

		this.shadowRoot.innerHTML = `
      <style>
        :host {
					display: inline-block;
          background-color: ${color};
          color: #FFFFFF;
					text-align: center;
        }
      </style>
      ${text}
    `;
	}
}
