import type * as batiment from "../../batiment/formulas.js";

/**
 * @formule refroidissement.installation.rdim
 * @param props.surface_installation - Surface de l'installation de refroidissement en m²
 * @param props.surface_installations - Surface totale des installations de refroidissement en m²
 * @returns Ratio de dimensionnement de l'installation de refroidissement
 */
export function calcule_rdim(props: {
	surface_installation: number;
	surface_installations: number;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const { surface_installation, surface_installations, sh } = props;
	if (surface_installations === 0) return 0;
	return (
		(surface_installations / sh) *
		(surface_installation / surface_installations)
	);
}
