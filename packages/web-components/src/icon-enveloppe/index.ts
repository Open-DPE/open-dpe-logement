import { renderIcon } from "../shared/utils";

const CONTENT = `
  <path d="M11.9798 2.82574L20.2374 11.0832V21.4252H3.72212V11.0832L6.91836 7.90569L11.996 2.82574M11.996 2.01619L3.33775 10.6784L3.17188 10.8484V22H20.8281V10.8322L20.6622 10.6622L12 2L11.996 2.01619Z"/>
  <path d="M19.2988 20.4861H4.66077V11.4758L11.9798 4.15341L19.2988 11.4758V20.4861ZM5.23529 19.9114H18.7243V11.7106L11.9798 4.96296L5.23529 11.7106V19.9114Z"/>
`;

export function renderIconEnveloppe(props: {
	size?: number | null | undefined;
	style?: string | null | undefined;
}): string {
	const { size, style } = props;
	const content = CONTENT;
	return renderIcon({ size, content, style });
}

export class IconEnveloppe extends HTMLElement {
	static observedAttributes = ["size", "style"];

	connectedCallback() {
		this.render();
	}
	attributeChangedCallback() {
		this.render();
	}

	private render() {
		const size = Number(this.getAttribute("size"));
		const style = this.getAttribute("style");
		this.innerHTML = renderIconEnveloppe({ size, style });
	}
}

const HTML_TAG = "open-dpe-logement-icon-enveloppe";

if (!customElements.get(HTML_TAG)) {
	customElements.define(HTML_TAG, IconEnveloppe);
}
