import * as batiment from "./rules/batiment/registry";
import * as chauffage from "./rules/chauffage/registry";
import * as climat from "./rules/climat/registry";
import * as diagnostic from "./rules/diagnostic/registry";
import * as eclairage from "./rules/eclairage/registry";
import * as ecs from "./rules/ecs/registry";
import * as enveloppe from "./rules/enveloppe/registry";
import * as production from "./rules/production/registry";
import * as refroidissement from "./rules/refroidissement/registry";
import * as ventilation from "./rules/ventilation/registry";

export {
	batiment,
	chauffage,
	climat,
	diagnostic,
	eclairage,
	ecs,
	enveloppe,
	production,
	refroidissement,
	ventilation,
};

export type Results = {
	[batiment.NAMESPACE]: batiment.Results;

	[chauffage.NAMESPACE]: chauffage.Results;
	[chauffage.emetteur.NAMESPACE]: chauffage.emetteur.Results;
	[chauffage.generateur.NAMESPACE]: chauffage.generateur.Results;
	[chauffage.installation.NAMESPACE]: chauffage.installation.Results;
	[chauffage.systeme.NAMESPACE]: chauffage.systeme.Results;

	[climat.NAMESPACE]: climat.Results;

	[diagnostic.NAMESPACE]: diagnostic.Results;

	[eclairage.NAMESPACE]: eclairage.Results;

	[ecs.NAMESPACE]: ecs.Results;
	[ecs.generateur.NAMESPACE]: ecs.generateur.Results;
	[ecs.installation.NAMESPACE]: ecs.installation.Results;
	[ecs.systeme.NAMESPACE]: ecs.systeme.Results;

	[enveloppe.NAMESPACE]: enveloppe.Results;
	[enveloppe.localNonChauffe.NAMESPACE]: enveloppe.localNonChauffe.Results;
	[enveloppe.localNonChauffe.baie
		.NAMESPACE]: enveloppe.localNonChauffe.baie.Results;
	[enveloppe.localNonChauffe.paroi
		.NAMESPACE]: enveloppe.localNonChauffe.paroi.Results;
	[enveloppe.baie.NAMESPACE]: enveloppe.baie.Results;
	[enveloppe.mur.NAMESPACE]: enveloppe.mur.Results;
	[enveloppe.plancherBas.NAMESPACE]: enveloppe.plancherBas.Results;
	[enveloppe.plancherHaut.NAMESPACE]: enveloppe.plancherHaut.Results;
	[enveloppe.niveau.NAMESPACE]: enveloppe.niveau.Results;
	[enveloppe.pontThermique.NAMESPACE]: enveloppe.pontThermique.Results;
	[enveloppe.porte.NAMESPACE]: enveloppe.porte.Results;

	[production.NAMESPACE]: production.Results;
	[production.panneau_photovoltaique
		.NAMESPACE]: production.panneau_photovoltaique.Results;

	[refroidissement.NAMESPACE]: refroidissement.Results;
	[refroidissement.generateur.NAMESPACE]: refroidissement.generateur.Results;
	[refroidissement.installation
		.NAMESPACE]: refroidissement.installation.Results;

	[ventilation.NAMESPACE]: ventilation.Results;
	[ventilation.installation.NAMESPACE]: ventilation.installation.Results;
};
