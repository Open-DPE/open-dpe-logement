import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import type * as enveloppe from "../enveloppe/formulas.js";
import { ValeurForfaitaireError } from "../errors.js";

/**
 * @formule climat.zone_climatique
 * @see abaques.climat.zoneClimatique
 * @throws {ValeurForfaitaireError}
 * @returns Zone climatique du bâtiment
 */
export function calcule_zone_climatique(props: {
	code_departement: string;
}): models.batiment.ZoneClimatiqueEnum {
	const abaque = abaques.climat.zoneClimatique;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.zone_climatique as models.batiment.ZoneClimatiqueEnum;
}

/**
 * @formule climat.tbase
 * @see abaques.climat.tbase
 * @throws {ValeurForfaitaireError}
 * @returns Température extérieure de base en °C
 */
export function calcule_tbase(props: {
	zone_climatique: ReturnType<typeof calcule_zone_climatique>;
	altitude: number;
}): number {
	const abaque = abaques.climat.tbase;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.tbase;
}

export type Sollicitations = models.common.ParMois<{
	/** Température moyenne d'eau froide sanitaire en °C */
	tefs: number;
	/** Ensoleillement reçu en période de chauffage en kWh/m² */
	e: number;
	/** Ensoleillement reçu en période de refroidissement pour une température de consigne de 26°C en kWh/m² */
	efr26: number;
	/** Ensoleillement reçu en période de refroidissement pour une température de consigne de 28°C en kWh/m² */
	efr28: number;
	/** Température extérieure moyenne en °C */
	text: number | null;
	/** Température extérieure moyenne pour une température de consigne de 26°C en °C */
	textmoy26: number | null;
	/** Température extérieure moyenne pour une température de consigne de 28°C en °C */
	textmoy28: number | null;
	/** Nombre d'heures de chauffage pour une température de consigne à 19°C */
	nref19: number;
	/** Nombre d'heures de chauffage pour une température de consigne à 21°C */
	nref21: number;
	/** Nombre d'heures de refroidissement pour une température de consigne à 26°C */
	nref26: number;
	/** Nombre d'heures de refroidissement pour une température de consigne à 28°C */
	nref28: number;
	/** Degrés heures de base 14 sur la saison de chauffe complète en °C·h */
	dh14: number;
	/** Degrés-heure pour une température de consigne de 19°C en °C·h */
	dh19: number;
	/** Degrés-heure pour une température de consigne de 21°C en °C·h */
	dh21: number;
	/** Degrés-heure pour une température de consigne de 26°C en °C·h */
	dh26: number;
	/** Degrés-heure pour une température de consigne de 28°C en °C·h */
	dh28: number;
}>;

/**
 * @formule climat.sollicitations
 * @param props.altitude - Altitude du bâtiment en mètres
 * @returns Sollicitations climatiques pour chaque mois de l'année
 */
export function calcule_sollicitations(props: {
	zone_climatique: ReturnType<typeof calcule_zone_climatique>;
	altitude: number;
	parois_anciennes: boolean;
	inertie: ReturnType<typeof enveloppe.calcule_inertie>;
}): Sollicitations {
	const abaque = abaques.climat.sollicitations;
	const matches = abaque.search(props, abaque.load());
	return models.common.createParMoisFrom(matches);
}

/**
 * @formule enveloppe.baie.c1
 * @formule enveloppe.local_non_chauffe.baie.c1
 * @param props.orientation - Orientation de la paroi
 * @param props.inclinaison - Inclinaison de la paroi en degrés
 * @returns Coefficients d'orientation et d'inclinaison des parois vitrées pour chaque mois de l'année
 */
export function calcule_c1(props: {
	zone_climatique: ReturnType<typeof calcule_zone_climatique>;
	orientation: models.enveloppe.common.OrientationParoiEnum;
	inclinaison: number;
}): models.common.ParMois<number> {
	const abaque = abaques.climat.c1;
	const matches = abaque.search(props, abaque.load());

	if (!models.common.containsAllMois(matches))
		throw new ValeurForfaitaireError(props);

	return models.common.mapParMois(
		models.common.createParMoisFrom(matches),
		(value) => value.c1,
	);
}

/**
 * @formule climat.nj
 * @see abaques.climat.nj
 * @returns Nombre de jours pour chaque mois de l'année
 */
export function calcule_nj(): models.common.ParMois<number> {
	return {
		[models.common.MOIS.Janvier]: 31,
		[models.common.MOIS.Février]: 28,
		[models.common.MOIS.Mars]: 31,
		[models.common.MOIS.Avril]: 30,
		[models.common.MOIS.Mai]: 31,
		[models.common.MOIS.Juin]: 30,
		[models.common.MOIS.Juillet]: 31,
		[models.common.MOIS.Août]: 31,
		[models.common.MOIS.Septembre]: 30,
		[models.common.MOIS.Octobre]: 31,
		[models.common.MOIS.Novembre]: 30,
		[models.common.MOIS.Décembre]: 24, // convention 3CL : une semaine d'absence est comptée en décembre (arrêté 2021-10-08, annexe 1, §11)
	};
}

/**
 * @formule climat.epv
 * @see abaques.climat.epv
 * @throws {ValeurForfaitaireError}
 * @returns Ensoleillement mensuel pour chaque mois de l'année en kWh/m²
 */
export function calcule_epv(props: {
	zone_climatique: ReturnType<typeof calcule_zone_climatique>;
}): models.common.ParMois<number> {
	const abaque = abaques.climat.epv;
	const matches = abaque.search(props, abaque.load());

	if (!models.common.containsAllMois(matches))
		throw new ValeurForfaitaireError(props);

	return models.common.mapParMois(
		models.common.createParMoisFrom(matches),
		(value) => value.epv,
	);
}
