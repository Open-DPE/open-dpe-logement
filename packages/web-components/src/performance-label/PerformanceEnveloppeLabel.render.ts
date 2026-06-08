import { COLORS, renderPerformanceLabel } from "./utils";

function getColor(ubat: number): string {
	if (ubat <= 0.45) return COLORS[1];
	else if (ubat <= 0.65) return COLORS[2];
	else if (ubat <= 0.85) return COLORS[3];
	return COLORS[4];
}

export function renderPerformanceEnveloppeLabel(props: {
	ubat: number;
}): string {
	const color = getColor(props.ubat);
	const text = props.ubat.toLocaleString();
	return renderPerformanceLabel({ text, color });
}
