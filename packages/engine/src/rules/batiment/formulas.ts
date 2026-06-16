/**
 * @formule batiment.ratio_proratisation
 * @props sh_batiment - Surface habitable totale du bâtiment en m²
 * @props sh_logement - Surface habitable du logement en m²
 * @returns Ratio de proratisation
 */
export function calcule_ratio_proratisation(props: {
	sh_batiment: number;
	sh_logement: number | null;
}): number {
	const { sh_batiment, sh_logement } = props;
	return sh_batiment && sh_logement ? sh_logement / sh_batiment : 1;
}

/**
 * @formule batiment.sh
 * @props sh_batiment - Surface habitable du bâtiment en m²
 * @props sh_logement - Surface habitable du logement en m²
 * @returns Surface habitable de référence en m²
 */
export function calcule_sh(props: {
	sh_batiment: number;
	sh_logement: number | null;
}): number {
	return props.sh_logement ?? props.sh_batiment;
}

/**
 * @formule batiment.hsp
 * @props hsp_batiment - Hauteur sous plafond du bâtiment en m
 * @props hsp_logement - Hauteur sous plafond du logement en m
 * @returns Hauteur sous plafond de référence en m
 */
export function calcule_hsp(props: {
	hsp_batiment: number;
	hsp_logement: number | null;
}): number {
	return props.hsp_logement ?? props.hsp_batiment;
}
