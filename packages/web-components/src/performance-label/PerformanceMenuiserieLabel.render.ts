import { COLORS, renderPerformanceLabel } from "./utils";

function getColor(u: number): string {
	if (u <= 1.6) return COLORS[1];
	else if (u <= 2.2) return COLORS[2];
	else if (u <= 3) return COLORS[3];
	return COLORS[4];
}

export function renderPerformanceMenuiserieLabel(props: { u: number }): string {
	const color = getColor(props.u);
	const text = props.u.toLocaleString();
	return renderPerformanceLabel({ text, color });
}
