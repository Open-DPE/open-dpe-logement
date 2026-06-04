/**
 * @doctrine refroidissement.installation.rdim
 * @param props.surface_installation - Surface de l'installation de refroidissement en m²
 * @param props.surface_installations - Surface totale des installations de refroidissement en m²
 * @returns Ratio de dimensionnement de l'installation de refroidissement
 */
export function calcule_rdim(props: {
	surface_installation: number;
	surface_installations: number;
}): number {
	const { surface_installation, surface_installations } = props;
	return surface_installation / surface_installations;
}
