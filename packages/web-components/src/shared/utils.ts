export function renderIcon(props: {
	content: string;
	size?: number | null | undefined;
	color?: string | null | undefined;
	style?: string | null | undefined;
}): string {
	const { content, size = 24, color = "#000000", style = "" } = props;
	return `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}" style="${style}" xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>
  `;
}

export function renderChips(props: {
	text: string;
	color: string;
	textColor: string;
	style?: string | null | undefined;
}): string {
	const { text, color, textColor, style = "" } = props;
	return `
    <span style="background-color: ${color}; color: ${textColor}; padding: 0.3rem; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; ${style}">
      ${text}
    </span>
  `;
}
