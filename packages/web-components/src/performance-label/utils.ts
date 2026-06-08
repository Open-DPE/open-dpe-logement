export const COLORS = {
	1: "#2CAF85",
	2: "#A5CC74",
	3: "#F49838",
	4: "#E52322",
};

export function renderPerformanceLabel(props: {
	text: string;
	color: string;
}): string {
	const { text, color } = props;
	return `
    <span style="background-color: ${color}; color: #FFFFFF; padding: 0.5rem; font-weight: 600; text-transform: uppercase;">
      ${text}
    </span>
  `;
}
