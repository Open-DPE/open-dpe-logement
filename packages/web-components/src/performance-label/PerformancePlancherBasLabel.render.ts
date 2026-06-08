import { COLORS, renderPerformanceLabel } from "./utils";

function getColor(u: number): string {
	if (u <= 0.25) return COLORS[1];
	else if (u <= 0.45) return COLORS[2];
	else if (u <= 0.65) return COLORS[3];
	return COLORS[4];
}

export function renderPerformancePlancherBasLabel(props: {
	u: number;
}): string {
	const color = getColor(props.u);
	const text = props.u.toLocaleString();
	return renderPerformanceLabel({ text, color });
}
