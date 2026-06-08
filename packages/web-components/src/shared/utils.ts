export function renderSVG(
	size: number,
	color: string,
	content: string,
): string {
	return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="${color}" xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>
  `;
}
