import * as models from "@open-dpe-logement/models";
import * as installation from "#rules/ventilation/installation/formulas.js";

/**
 * @return Consommations par usage et par énergie des auxiliaires de ventilation
 */
export function calcule_consommations(props: {
	consommations: ReturnType<typeof installation.calcule_consommations>[];
}): models.common.Consommations {
	return models.common.mergeConsommations(...props.consommations);
}

/**
 * @doctrine ventilation.caux
 * @return Consommations des auxiliaires de ventilation en kWh/an
 */
export function calcule_caux(props: {
	caux: ReturnType<typeof installation.calcule_caux>[];
}): number {
	return props.caux.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ventilation.hvent
 * @returns Déperditions thermiques par renouvellement d'air due au système de ventilation en W/K
 */
export function calcule_hvent(props: {
	installations: {
		hvent: ReturnType<typeof installation.calcule_hvent>;
		rdim: ReturnType<typeof installation.calcule_rdim>;
	}[];
}): number {
	const { installations } = props;
	return installations.reduce((acc, i) => acc + i.hvent * i.rdim, 0);
}

/**
 * @doctrine ventilation.qvarep_conv
 * @returns Débit volumique conventionnel moyen à reprendre en m3/(h.m²)
 */
export function calcule_qvarep_conv(props: {
	installations: {
		qvarep_conv: ReturnType<typeof installation.calcule_debits>["qvarep_conv"];
		rdim: ReturnType<typeof installation.calcule_rdim>;
	}[];
}): number {
	const { installations } = props;
	const s = installations.reduce((acc, i) => acc + i.rdim, 0);
	const w = installations.reduce((acc, i) => acc + i.qvarep_conv * i.rdim, 0);
	return s === 0 ? 0 : w / s;
}

/**
 * @doctrine ventilation.qvasouf_conv
 * @returns Débit volumique conventionnel moyen à souffler en m3/(h.m²)
 */
export function calcule_qvasouf_conv(props: {
	installations: {
		qvasouf_conv: ReturnType<
			typeof installation.calcule_debits
		>["qvasouf_conv"];
		rdim: ReturnType<typeof installation.calcule_rdim>;
	}[];
}): number {
	const { installations } = props;
	const s = installations.reduce((acc, i) => acc + i.rdim, 0);
	const w = installations.reduce((acc, i) => acc + i.qvasouf_conv * i.rdim, 0);
	return s === 0 ? 0 : w / s;
}

/**
 * @doctrine ventilation.smea_conv
 * @returns Moyenne des sommes des modules d'entrée d'air sous 20 Pa en m3/(h.m²)
 */
export function calcule_smea_conv(props: {
	installations: {
		smea_conv: ReturnType<typeof installation.calcule_debits>["smea_conv"];
		rdim: ReturnType<typeof installation.calcule_rdim>;
	}[];
}): number {
	const { installations } = props;
	const s = installations.reduce((acc, i) => acc + i.rdim, 0);
	const w = installations.reduce((acc, i) => acc + i.smea_conv * i.rdim, 0);
	return s === 0 ? 0 : w / s;
}
