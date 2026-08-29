import * as z from "zod";
import * as enums from "./enums.js";

// ==================================================================================================
// DPEv2.2 - TypeScript definitions
// Source : DPEv2.2.xsd
// ==================================================================================================

// ==================================================================================================
// Travaux
// ==================================================================================================

export const Travaux = z.object({
	description_travaux: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
	enum_lot_travaux_id: enums.LotTravauxEnum,
	avertissement_travaux: z.string().nullable().optional(),
	performance_recommande: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
});
export type Travaux = z.infer<typeof Travaux>;

export const PackTravaux = z.object({
	enum_num_pack_travaux_id: enums.NumPackTravauxEnum,
	conso_5_usages_apres_travaux: z.number().nullable().optional(),
	emission_ges_5_usages_apres_travaux: z.number().nullable().optional(),
	cout_pack_travaux_min: z.number().nullable().optional(),
	cout_pack_travaux_max: z.number().nullable().optional(),
	travaux_collection: z.array(Travaux),
});
export type PackTravaux = z.infer<typeof PackTravaux>;

export const DescriptifTravaux = z.object({
	pack_travaux_collection: z.array(PackTravaux),
	commentaire_travaux: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
});
export type DescriptifTravaux = z.infer<typeof DescriptifTravaux>;

// ==================================================================================================
// Collections et types auxiliaires
// ==================================================================================================

export const DescriptifGesteEntretien = z.object({
	description: z.string(),
	enum_picto_geste_entretien_id: enums.PictoGesteEntretienEnum,
	categorie_geste_entretien: z.string(),
});
export type DescriptifGesteEntretien = z.infer<typeof DescriptifGesteEntretien>;

export const Justificatif = z.object({
	description: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
	enum_type_justificatif_id: enums.TypeJustificatifEnum,
});
export type Justificatif = z.infer<typeof Justificatif>;

export const SousFicheTechnique = z.object({
	description: z.string(),
	valeur: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
	detail_origine_donnee: z.string().nullable().optional(),
	enum_origine_donnee_id: enums.OrigineDonneeEnum,
});
export type SousFicheTechnique = z.infer<typeof SousFicheTechnique>;

export const FicheTechnique = z.object({
	enum_categorie_fiche_technique_id: enums.CategorieFicheTechniqueEnum,
	sous_fiche_technique_collection: z.array(SousFicheTechnique),
});
export type FicheTechnique = z.infer<typeof FicheTechnique>;

export const DescriptifSimplifie = z.object({
	description: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
	enum_categorie_descriptif_simplifie_id: enums.CategorieDescriptifSimplifieEnum,
});
export type DescriptifSimplifie = z.infer<typeof DescriptifSimplifie>;

export const DescriptifEnr = z.object({
	description: z.string(),
	enum_categorie_enr_descriptif_id: enums.CategorieEnrDescriptifEnum,
});
export type DescriptifEnr = z.infer<typeof DescriptifEnr>;

export const LogementVisite = z.object({
	description: z.string().nullable().optional().transform((v) => v ?? "Non renseigné"),
	enum_position_etage_logement_id: enums.PositionEtageLogementEnum,
	enum_typologie_logement_id: enums.TypologieLogementEnum,
	surface_habitable_logement: z.number().nullable().optional(),
});
export type LogementVisite = z.infer<typeof LogementVisite>;

export const DPEImmeuble = z.object({
	logement_visite_collection: z.array(LogementVisite),
});
export type DPEImmeuble = z.infer<typeof DPEImmeuble>;

// ==================================================================================================
// Sortie
// ==================================================================================================

export const QualiteIsolation = z.object({
	ubat: z.number(),
	qualite_isol_enveloppe: enums.QualiteComposantEnum,
	qualite_isol_mur: enums.QualiteComposantEnum,
	qualite_isol_plancher_haut_toit_terrasse: enums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_haut_comble_perdu: enums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_haut_comble_amenage: enums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_bas: enums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_menuiserie: enums.QualiteComposantEnum,
});
export type QualiteIsolation = z.infer<typeof QualiteIsolation>;

export const ConfortEte = z.object({
	isolation_toiture: z.boolean(),
	protection_solaire_exterieure: z.boolean(),
	aspect_traversant: z.boolean(),
	brasseur_air: z.boolean(),
	inertie_lourde: z.boolean(),
	enum_indicateur_confort_ete_id: enums.IndicateurConfortEteEnum,
});
export type ConfortEte = z.infer<typeof ConfortEte>;

export const SortieParEnergie = z.object({
	enum_type_energie_id: enums.TypeEnergieEnum,
	conso_ch: z.number(),
	conso_ecs: z.number(),
	conso_5_usages: z.number(),
	emission_ges_ch: z.number(),
	emission_ges_ecs: z.number(),
	emission_ges_5_usages: z.number(),
	cout_ch: z.number(),
	cout_ecs: z.number(),
	cout_5_usages: z.number(),
});
export type SortieParEnergie = z.infer<typeof SortieParEnergie>;

export const ProductionElectricite = z.object({
	production_pv: z.number(),
	conso_elec_ac: z.number(),
	conso_elec_ac_ch: z.number(),
	conso_elec_ac_ecs: z.number(),
	conso_elec_ac_fr: z.number(),
	conso_elec_ac_eclairage: z.number(),
	conso_elec_ac_auxiliaire: z.number(),
	conso_elec_ac_autre_usage: z.number(),
});
export type ProductionElectricite = z.infer<typeof ProductionElectricite>;

export const Cout = z.object({
	cout_ch: z.number(),
	cout_ch_depensier: z.number(),
	cout_ecs: z.number(),
	cout_ecs_depensier: z.number(),
	cout_eclairage: z.number(),
	cout_auxiliaire_generation_ch: z.number(),
	cout_auxiliaire_generation_ch_depensier: z.number(),
	cout_auxiliaire_distribution_ch: z.number(),
	cout_auxiliaire_generation_ecs: z.number(),
	cout_auxiliaire_generation_ecs_depensier: z.number(),
	cout_auxiliaire_distribution_ecs: z.number(),
	cout_auxiliaire_distribution_fr: z.number().nullable().optional(),
	cout_auxiliaire_ventilation: z.number(),
	cout_total_auxiliaire: z.number(),
	cout_fr: z.number(),
	cout_fr_depensier: z.number(),
	cout_5_usages: z.number(),
});
export type Cout = z.infer<typeof Cout>;

export const EmissionGes = z.object({
	emission_ges_ch: z.number(),
	emission_ges_ch_depensier: z.number(),
	emission_ges_ecs: z.number(),
	emission_ges_ecs_depensier: z.number(),
	emission_ges_eclairage: z.number(),
	emission_ges_auxiliaire_generation_ch: z.number(),
	emission_ges_auxiliaire_generation_ch_depensier: z.number(),
	emission_ges_auxiliaire_distribution_ch: z.number(),
	emission_ges_auxiliaire_generation_ecs: z.number(),
	emission_ges_auxiliaire_generation_ecs_depensier: z.number(),
	emission_ges_auxiliaire_distribution_ecs: z.number(),
	emission_ges_auxiliaire_distribution_fr: z.number().nullable().optional(),
	emission_ges_auxiliaire_ventilation: z.number(),
	emission_ges_totale_auxiliaire: z.number(),
	emission_ges_fr: z.number(),
	emission_ges_fr_depensier: z.number(),
	emission_ges_5_usages: z.number(),
	emission_ges_5_usages_m2: z.number(),
	classe_emission_ges: enums.ClasseEtiquetteEnum,
});
export type EmissionGes = z.infer<typeof EmissionGes>;

export const EpConso = z.object({
	ep_conso_ch: z.number(),
	ep_conso_ch_depensier: z.number(),
	ep_conso_ecs: z.number(),
	ep_conso_ecs_depensier: z.number(),
	ep_conso_eclairage: z.number(),
	ep_conso_auxiliaire_generation_ch: z.number(),
	ep_conso_auxiliaire_generation_ch_depensier: z.number(),
	ep_conso_auxiliaire_distribution_ch: z.number(),
	ep_conso_auxiliaire_generation_ecs: z.number(),
	ep_conso_auxiliaire_generation_ecs_depensier: z.number(),
	ep_conso_auxiliaire_distribution_ecs: z.number(),
	ep_conso_auxiliaire_distribution_fr: z.number().nullable().optional(),
	ep_conso_auxiliaire_ventilation: z.number(),
	ep_conso_totale_auxiliaire: z.number(),
	ep_conso_fr: z.number(),
	ep_conso_fr_depensier: z.number(),
	ep_conso_5_usages: z.number(),
	ep_conso_5_usages_m2: z.number(),
	classe_bilan_dpe: enums.ClasseEtiquetteEnum,
});
export type EpConso = z.infer<typeof EpConso>;

export const EfConso = z.object({
	conso_ch: z.number(),
	conso_ch_depensier: z.number(),
	conso_ecs: z.number(),
	conso_ecs_depensier: z.number(),
	conso_eclairage: z.number(),
	conso_auxiliaire_generation_ch: z.number(),
	conso_auxiliaire_generation_ch_depensier: z.number(),
	conso_auxiliaire_distribution_ch: z.number(),
	conso_auxiliaire_generation_ecs: z.number(),
	conso_auxiliaire_generation_ecs_depensier: z.number(),
	conso_auxiliaire_distribution_ecs: z.number(),
	conso_auxiliaire_distribution_fr: z.number().nullable().optional(),
	conso_auxiliaire_ventilation: z.number(),
	conso_totale_auxiliaire: z.number(),
	conso_fr: z.number(),
	conso_fr_depensier: z.number(),
	conso_5_usages: z.number(),
	conso_5_usages_m2: z.number(),
});
export type EfConso = z.infer<typeof EfConso>;

export const ApportEtBesoin = z.object({
	surface_sud_equivalente: z.number(),
	apport_solaire_fr: z.number(),
	apport_interne_fr: z.number(),
	apport_solaire_ch: z.number(),
	apport_interne_ch: z.number(),
	fraction_apport_gratuit_ch: z.number(),
	fraction_apport_gratuit_depensier_ch: z.number(),
	pertes_distribution_ecs_recup: z.number(),
	pertes_distribution_ecs_recup_depensier: z.number(),
	pertes_stockage_ecs_recup: z.number(),
	pertes_generateur_ch_recup: z.number(),
	pertes_generateur_ch_recup_depensier: z.number(),
	nadeq: z.number(),
	v40_ecs_journalier: z.number(),
	v40_ecs_journalier_depensier: z.number(),
	besoin_ch: z.number(),
	besoin_ch_depensier: z.number(),
	besoin_ecs: z.number(),
	besoin_ecs_depensier: z.number(),
	besoin_fr: z.number(),
	besoin_fr_depensier: z.number(),
});
export type ApportEtBesoin = z.infer<typeof ApportEtBesoin>;

export const Deperdition = z.object({
	hvent: z.number(),
	hperm: z.number(),
	deperdition_renouvellement_air: z.number(),
	deperdition_mur: z.number(),
	deperdition_plancher_bas: z.number(),
	deperdition_plancher_haut: z.number(),
	deperdition_baie_vitree: z.number(),
	deperdition_porte: z.number(),
	deperdition_pont_thermique: z.number(),
	deperdition_enveloppe: z.number(),
});
export type Deperdition = z.infer<typeof Deperdition>;

export const Sortie = z.object({
	deperdition: Deperdition,
	apport_et_besoin: ApportEtBesoin,
	ef_conso: EfConso,
	ep_conso: EpConso,
	emission_ges: EmissionGes,
	cout: Cout,
	production_electricite: ProductionElectricite.nullable().optional(),
	sortie_par_energie_collection: z.array(SortieParEnergie),
	confort_ete: ConfortEte.nullable().optional(),
	qualite_isolation: QualiteIsolation,
});
export type Sortie = z.infer<typeof Sortie>;

// ==================================================================================================
// Systèmes
// ==================================================================================================

export const PanneauxPv = z.object({
	surface_totale_capteurs: z.number().nullable().optional(),
	ratio_virtualisation: z.number().nullable().optional(),
	nombre_module: z.number().nullable().optional(),
	tv_coef_orientation_pv_id: z.number().nullable().optional(),
	enum_orientation_pv_id: enums.OrientationPvEnum.nullable().optional(),
	enum_inclinaison_pv_id: enums.InclinaisonPvEnum.nullable().optional(),
});
export type PanneauxPv = z.infer<typeof PanneauxPv>;

export const ProductionElecEnr = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		presence_production_pv: z.boolean(),
		enum_type_enr_id: enums.TypeEnrEnum,
	}),
	donnee_intermediaire: z
		.object({
			taux_autoproduction: z.number().nullable().optional(),
			production_pv: z.number(),
			conso_elec_ac: z.number(),
		})
		.nullable()
		.optional(),
	panneaux_pv_collection: z.array(PanneauxPv),
});
export type ProductionElecEnr = z.infer<typeof ProductionElecEnr>;

export const GenerateurChauffage = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_generateur_mixte: z.string().nullable().optional(),
		ref_produit_generateur_ch: z.string().nullable().optional(),
		enum_type_generateur_ch_id: enums.TypeGenerateurChEnum,
		enum_usage_generateur_id: enums.UsageGenerateurEnum,
		enum_type_energie_id: enums.TypeEnergieEnum,
		position_volume_chauffe: z.boolean().nullable().optional(),
		tv_rendement_generation_id: z.number().nullable().optional(),
		tv_scop_id: z.number().nullable().optional(),
		tv_temp_fonc_100_id: z.number().nullable().optional(),
		tv_temp_fonc_30_id: z.number().nullable().optional(),
		tv_generateur_combustion_id: z.number().nullable().optional(),
		tv_reseau_chaleur_id: z.number().nullable().optional(),
		identifiant_reseau_chaleur: z.string().nullable().optional(),
		date_arrete_reseau_chaleur: z.string().nullable().optional(),
		n_radiateurs_gaz: z.number().nullable().optional(),
		priorite_generateur_cascade: z.number().nullable().optional(),
		presence_ventouse: z.boolean().nullable().optional(),
		presence_regulation_combustion: z.boolean().nullable().optional(),
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum,
		enum_lien_generateur_emetteur_id: enums.LienGenerateurEmetteurEnum.nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		scop: z.number().nullable().optional(),
		pn: z.number().nullable().optional(),
		qp0: z.number().nullable().optional(),
		pveilleuse: z.number().nullable().optional(),
		temp_fonc_30: z.number().nullable().optional(),
		temp_fonc_100: z.number().nullable().optional(),
		rpn: z.number().nullable().optional(),
		rpint: z.number().nullable().optional(),
		rendement_generation: z.number().nullable().optional(),
		conso_ch: z.number(),
		conso_ch_depensier: z.number(),
	}),
});
export type GenerateurChauffage = z.infer<typeof GenerateurChauffage>;

export const EmetteurChauffage = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		surface_chauffee: z.number(),
		tv_rendement_emission_id: z.number().nullable().optional(),
		tv_rendement_distribution_ch_id: z.number().nullable().optional(),
		tv_rendement_regulation_id: z.number().nullable().optional(),
		enum_type_emission_distribution_id: enums.TypeEmissionDistributionEnum,
		tv_intermittence_id: z.number().nullable().optional(),
		reseau_distribution_isole: z.boolean().nullable().optional(),
		enum_equipement_intermittence_id: enums.EquipementIntermittenceEnum.nullable().optional(),
		enum_type_regulation_id: enums.TypeRegulationEnum.nullable().optional(),
		enum_periode_installation_emetteur_id:
			enums.PeriodeInstallationEmetteurEnum.nullable().optional(),
		enum_type_chauffage_id: enums.TypeChauffageEnum,
		enum_temp_distribution_ch_id: enums.TempDistributionChEnum.nullable().optional(),
		enum_lien_generateur_emetteur_id: enums.LienGenerateurEmetteurEnum.nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		i0: z.number(),
		rendement_emission: z.number(),
		rendement_distribution: z.number(),
		rendement_regulation: z.number(),
	}),
});
export type EmetteurChauffage = z.infer<typeof EmetteurChauffage>;

export const InstallationChauffage = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		surface_chauffee: z.number(),
		nombre_logement_echantillon: z.number().nullable().optional(),
		rdim: z.number().nullable().optional(),
		nombre_niveau_installation_ch: z.number(),
		enum_cfg_installation_ch_id: enums.CfgInstallationChEnum,
		ratio_virtualisation: z.number().nullable().optional(),
		coef_ifc: z.number().nullable().optional(),
		cle_repartition_ch: z.number().nullable().optional(),
		enum_type_installation_id: enums.TypeInstallationEnum,
		enum_methode_calcul_conso_id: enums.MethodeCalculConsoEnum,
		enum_methode_saisie_fact_couv_sol_id: enums.MethodeSaisieFactCouvSolEnum.nullable().optional(),
		tv_facteur_couverture_solaire_id: z.number().nullable().optional(),
		fch_saisi: z.number().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		besoin_ch: z.number(),
		besoin_ch_depensier: z.number(),
		production_ch_solaire: z.number().nullable().optional(),
		fch: z.number().nullable().optional(),
		conso_ch: z.number(),
		conso_ch_depensier: z.number(),
	}),
	emetteur_chauffage_collection: z.array(EmetteurChauffage),
	generateur_chauffage_collection: z.array(GenerateurChauffage),
});
export type InstallationChauffage = z.infer<typeof InstallationChauffage>;

export const GenerateurEcs = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_generateur_mixte: z.string().nullable().optional(),
		enum_type_generateur_ecs_id: enums.TypeGenerateurEcsEnum,
		ref_produit_generateur_ecs: z.string().nullable().optional(),
		enum_usage_generateur_id: enums.UsageGenerateurEnum,
		enum_type_energie_id: enums.TypeEnergieEnum,
		tv_generateur_combustion_id: z.number().nullable().optional(),
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum,
		tv_pertes_stockage_id: z.number().nullable().optional(),
		tv_scop_id: z.number().nullable().optional(),
		enum_periode_installation_ecs_thermo_id:
			enums.PeriodeInstallationEcsThermoEnum.nullable().optional(),
		identifiant_reseau_chaleur: z.string().nullable().optional(),
		date_arrete_reseau_chaleur: z.string().nullable().optional(),
		tv_reseau_chaleur_id: z.number().nullable().optional(),
		enum_type_stockage_ecs_id: enums.TypeStockageEcsEnum.nullable().optional(),
		position_volume_chauffe: z.boolean().nullable().optional(),
		position_volume_chauffe_stockage: z.boolean().nullable().optional(),
		volume_stockage: z.number().nullable().optional(),
		presence_ventouse: z.boolean().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		pn: z.number().nullable().optional(),
		qp0: z.number().nullable().optional(),
		pveilleuse: z.number().nullable().optional(),
		rpn: z.number().nullable().optional(),
		cop: z.number().nullable().optional(),
		ratio_besoin_ecs: z.number().nullable().optional(),
		rendement_generation: z.number().nullable().optional(),
		rendement_generation_stockage: z.number().nullable().optional(),
		conso_ecs: z.number(),
		conso_ecs_depensier: z.number(),
		rendement_stockage: z.number().nullable().optional(),
	}),
});
export type GenerateurEcs = z.infer<typeof GenerateurEcs>;

export const InstallationEcs = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		enum_cfg_installation_ecs_id: enums.CfgInstallationEcsEnum,
		enum_type_installation_id: enums.TypeInstallationEnum,
		enum_methode_calcul_conso_id: enums.MethodeCalculConsoEnum,
		ratio_virtualisation: z.number().nullable().optional(),
		cle_repartition_ecs: z.number().nullable().optional(),
		surface_habitable: z.number(),
		rdim: z.number().nullable().optional(),
		nombre_logement: z.number(),
		nombre_niveau_installation_ecs: z.number(),
		fecs_saisi: z.number().nullable().optional(),
		tv_facteur_couverture_solaire_id: z.number().nullable().optional(),
		enum_methode_saisie_fact_couv_sol_id: enums.MethodeSaisieFactCouvSolEnum.nullable().optional(),
		enum_type_installation_solaire_id: enums.TypeInstallationSolaireEnum.nullable().optional(),
		tv_rendement_distribution_ecs_id: z.number().nullable().optional(),
		enum_bouclage_reseau_ecs_id: enums.BouclageReseauEcsEnum.nullable().optional(),
		reseau_distribution_isole: z.boolean().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		rendement_distribution: z.number(),
		besoin_ecs: z.number(),
		besoin_ecs_depensier: z.number(),
		fecs: z.number().nullable().optional(),
		production_ecs_solaire: z.number().nullable().optional(),
		conso_ecs: z.number(),
		conso_ecs_depensier: z.number(),
	}),
	generateur_ecs_collection: z.array(GenerateurEcs),
});
export type InstallationEcs = z.infer<typeof InstallationEcs>;

export const Climatisation = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		surface_clim: z.number(),
		tv_seer_id: z.number().nullable().optional(),
		nombre_logement_echantillon: z.number().nullable().optional(),
		enum_methode_calcul_conso_id: enums.MethodeCalculConsoEnum,
		enum_periode_installation_fr_id: enums.PeriodeInstallationFrEnum,
		cle_repartition_clim: z.number().nullable().optional(),
		enum_type_generateur_fr_id: enums.TypeGenerateurFrEnum,
		enum_type_energie_id: enums.TypeEnergieEnum.nullable().optional(),
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum,
		ref_produit_fr: z.string().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		eer: z.number(),
		besoin_fr: z.number(),
		conso_fr: z.number(),
		conso_fr_depensier: z.number(),
	}),
});
export type Climatisation = z.infer<typeof Climatisation>;

export const Ventilation = z.object({
	donnee_entree: z.object({
		surface_ventile: z.number(),
		description: z.string().nullable().optional(),
		reference: z.string(),
		plusieurs_facade_exposee: z.boolean(),
		tv_q4pa_conv_id: z.number().nullable().optional(),
		q4pa_conv_saisi: z.number().nullable().optional(),
		enum_methode_saisie_q4pa_conv_id: enums.MethodeSaisieQ4paConvEnum,
		tv_debits_ventilation_id: z.number(),
		enum_type_ventilation_id: enums.TypeVentilationEnum,
		ventilation_post_2012: z.boolean(),
		ref_produit_ventilation: z.string().nullable().optional(),
		cle_repartition_ventilation: z.number().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		pvent_moy: z.number().nullable().optional(),
		q4pa_conv: z.number(),
		conso_auxiliaire_ventilation: z.number(),
		hperm: z.number(),
		hvent: z.number(),
	}),
});
export type Ventilation = z.infer<typeof Ventilation>;

// ==================================================================================================
// Enveloppe
// ==================================================================================================

export const PontThermique = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_1: z.string().nullable().optional(),
		reference_2: z.string().nullable().optional(),
		tv_pont_thermique_id: z.number().nullable().optional(),
		pourcentage_valeur_pont_thermique: z.number(),
		l: z.number(),
		enum_methode_saisie_pont_thermique_id: enums.MethodeSaisiePontThermiqueEnum,
		enum_type_liaison_id: enums.TypeLiaisonEnum,
		k_saisi: z.number().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		k: z.number(),
	}),
});
export type PontThermique = z.infer<typeof PontThermique>;

export const BaieEts = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		enum_orientation_id: enums.OrientationEnum,
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum,
		surface_totale_baie: z.number(),
		nb_baie: z.number(),
	}),
});
export type BaieEts = z.infer<typeof BaieEts>;

export const Ets = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		enum_cfg_isolation_lnc_id: enums.CfgIsolationLncEnum.nullable().optional(),
		tv_coef_transparence_ets_id: z.number().nullable().optional(),
	}),
	baie_ets_collection: z.array(BaieEts),
	donnee_intermediaire: z.object({
		coef_transparence_ets: z.number(),
		bver: z.number(),
	}),
});
export type Ets = z.infer<typeof Ets>;

export const Porte = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_paroi: z.string().nullable().optional(),
		reference_lnc: z.string().nullable().optional(),
		enum_cfg_isolation_lnc_id: enums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: enums.TypeAdjacenceEnum,
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		surface_aiu: z.number().nullable().optional(),
		surface_aue: z.number().nullable().optional(),
		surface_porte: z.number(),
		tv_uporte_id: z.number().nullable().optional(),
		enum_methode_saisie_uporte_id: enums.MethodeSaisieUporteEnum,
		enum_type_porte_id: enums.TypePorteEnum,
		uporte_saisi: z.number().nullable().optional(),
		nb_porte: z.number().nullable().optional(),
		largeur_dormant: z.number().nullable().optional(),
		presence_retour_isolation: z.boolean().nullable().optional(),
		presence_joint: z.boolean().nullable().optional(),
		enum_type_pose_id: enums.TypePoseEnum,
	}),
	donnee_intermediaire: z.object({
		uporte: z.number(),
		b: z.number().nullable().optional(),
	}),
});
export type Porte = z.infer<typeof Porte>;

export const MasqueLointainNonHomogene = z.object({
	tv_coef_masque_lointain_non_homogene_id: z.number(),
});
export type MasqueLointainNonHomogene = z.infer<typeof MasqueLointainNonHomogene>;

export const BaieVitreeDoubleFenetre = z.object({
	donnee_entree: z.object({
		tv_ug_id: z.number().nullable().optional(),
		enum_type_vitrage_id: enums.TypeVitrageEnum,
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum,
		enum_type_gaz_lame_id: enums.TypeGazLameEnum.nullable().optional(),
		epaisseur_lame: z.number().nullable().optional(),
		vitrage_vir: z.boolean().nullable().optional(),
		enum_methode_saisie_perf_vitrage_id: enums.MethodeSaisiePerfVitrageEnum,
		ug_saisi: z.number().nullable().optional(),
		tv_uw_id: z.number().nullable().optional(),
		enum_type_materiaux_menuiserie_id: enums.TypeMateriauxMenuiserieEnum,
		enum_type_baie_id: enums.TypeBaieEnum,
		uw_saisi: z.number().nullable().optional(),
		tv_sw_id: z.number().nullable().optional(),
		sw_saisi: z.number().nullable().optional(),
		enum_type_pose_id: enums.TypePoseEnum,
	}),
	donnee_intermediaire: z.object({
		ug: z.number().nullable().optional(),
		uw: z.number(),
		sw: z.number(),
	}),
});
export type BaieVitreeDoubleFenetre = z.infer<typeof BaieVitreeDoubleFenetre>;

export const BaieVitree = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_paroi: z.string().nullable().optional(),
		reference_lnc: z.string().nullable().optional(),
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		surface_aiu: z.number().nullable().optional(),
		surface_aue: z.number().nullable().optional(),
		enum_cfg_isolation_lnc_id: enums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: enums.TypeAdjacenceEnum,
		surface_totale_baie: z.number(),
		nb_baie: z.number(),
		tv_ug_id: z.number().nullable().optional(),
		enum_type_vitrage_id: enums.TypeVitrageEnum,
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum,
		enum_type_gaz_lame_id: enums.TypeGazLameEnum.nullable().optional(),
		epaisseur_lame: z.number().nullable().optional(),
		vitrage_vir: z.boolean().nullable().optional(),
		enum_methode_saisie_perf_vitrage_id: enums.MethodeSaisiePerfVitrageEnum,
		ug_saisi: z.number().nullable().optional(),
		tv_uw_id: z.number().nullable().optional(),
		enum_type_materiaux_menuiserie_id: enums.TypeMateriauxMenuiserieEnum,
		enum_type_baie_id: enums.TypeBaieEnum,
		uw_saisi: z.number().nullable().optional(),
		double_fenetre: z.boolean().nullable().optional(),
		uw_1: z.number().nullable().optional(),
		sw_1: z.number().nullable().optional(),
		uw_2: z.number().nullable().optional(),
		sw_2: z.number().nullable().optional(),
		tv_deltar_id: z.number().nullable().optional(),
		tv_ujn_id: z.number().nullable().optional(),
		enum_type_fermeture_id: enums.TypeFermetureEnum,
		presence_protection_solaire_hors_fermeture: z.boolean().nullable().optional(),
		ujn_saisi: z.number().nullable().optional(),
		presence_retour_isolation: z.boolean().nullable().optional(),
		presence_joint: z.boolean().nullable().optional(),
		largeur_dormant: z.number().nullable().optional(),
		tv_sw_id: z.number().nullable().optional(),
		sw_saisi: z.number().nullable().optional(),
		enum_type_pose_id: enums.TypePoseEnum,
		enum_orientation_id: enums.OrientationEnum,
		tv_coef_masque_proche_id: z.number().nullable().optional(),
		tv_coef_masque_lointain_homogene_id: z.number().nullable().optional(),
		masque_lointain_non_homogene_collection: z
			.array(MasqueLointainNonHomogene)
			.nullable()
			.optional(),
		baie_vitree_double_fenetre: BaieVitreeDoubleFenetre.nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		b: z.number().nullable().optional(),
		ug: z.number().nullable().optional(),
		uw: z.number(),
		ujn: z.number().nullable().optional(),
		u_menuiserie: z.number(),
		sw: z.number(),
		fe1: z.number(),
		fe2: z.number(),
	}),
});
export type BaieVitree = z.infer<typeof BaieVitree>;

export const PlancherHaut = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_lnc: z.string().nullable().optional(),
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		surface_aiu: z.number().nullable().optional(),
		surface_aue: z.number().nullable().optional(),
		enum_cfg_isolation_lnc_id: enums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: enums.TypeAdjacenceEnum,
		surface_paroi_opaque: z.number(),
		uph0_saisi: z.number().nullable().optional(),
		tv_uph0_id: z.number().nullable().optional(),
		enum_type_plancher_haut_id: enums.TypePlancherHautEnum,
		enum_methode_saisie_u0_id: enums.MethodeSaisieU0Enum,
		uph_saisi: z.number().nullable().optional(),
		enum_type_isolation_id: enums.TypeIsolationEnum,
		enum_periode_isolation_id: enums.PeriodeIsolationEnum.nullable().optional(),
		resistance_isolation: z.number().nullable().optional(),
		epaisseur_isolation: z.number().nullable().optional(),
		tv_uph_id: z.number().nullable().optional(),
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum,
	}),
	donnee_intermediaire: z.object({
		b: z.number().nullable().optional(),
		uph: z.number(),
		uph0: z.number().nullable().optional(),
	}),
});
export type PlancherHaut = z.infer<typeof PlancherHaut>;

export const PlancherBas = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_lnc: z.string().nullable().optional(),
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		surface_aiu: z.number().nullable().optional(),
		surface_aue: z.number().nullable().optional(),
		enum_cfg_isolation_lnc_id: enums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: enums.TypeAdjacenceEnum,
		surface_paroi_opaque: z.number(),
		upb0_saisi: z.number().nullable().optional(),
		tv_upb0_id: z.number().nullable().optional(),
		enum_type_plancher_bas_id: enums.TypePlancherBasEnum,
		enum_methode_saisie_u0_id: enums.MethodeSaisieU0Enum,
		upb_saisi: z.number().nullable().optional(),
		enum_type_isolation_id: enums.TypeIsolationEnum,
		enum_periode_isolation_id: enums.PeriodeIsolationEnum.nullable().optional(),
		resistance_isolation: z.number().nullable().optional(),
		epaisseur_isolation: z.number().nullable().optional(),
		tv_upb_id: z.number().nullable().optional(),
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum,
		calcul_ue: z.boolean().nullable().optional(),
		perimetre_ue: z.number().nullable().optional(),
		surface_ue: z.number().nullable().optional(),
		ue: z.number().nullable().optional(),
	}),
	donnee_intermediaire: z.object({
		b: z.number().nullable().optional(),
		upb: z.number(),
		upb_final: z.number(),
		upb0: z.number().nullable().optional(),
	}),
});
export type PlancherBas = z.infer<typeof PlancherBas>;

export const Mur = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_lnc: z.string().nullable().optional(),
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		surface_aiu: z.number().nullable().optional(),
		surface_aue: z.number().nullable().optional(),
		enum_cfg_isolation_lnc_id: enums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: enums.TypeAdjacenceEnum,
		enum_orientation_id: enums.OrientationEnum,
		surface_paroi_totale: z.number().nullable().optional(),
		surface_paroi_opaque: z.number(),
		umur0_saisi: z.number().nullable().optional(),
		tv_umur0_id: z.number().nullable().optional(),
		epaisseur_structure: z.number().nullable().optional(),
		enum_materiaux_structure_mur_id: enums.MateriauxStructureMurEnum.nullable().optional(),
		enum_methode_saisie_u0_id: enums.MethodeSaisieU0Enum,
		paroi_ancienne: z.boolean().nullable().optional(),
		enduit_isolant_paroi_ancienne: z.boolean().nullable().optional(),
		umur_saisi: z.number().nullable().optional(),
		enum_type_doublage_id: enums.TypeDoublageEnum.nullable().optional(),
		enum_type_isolation_id: enums.TypeIsolationEnum,
		enum_periode_isolation_id: enums.PeriodeIsolationEnum.nullable().optional(),
		resistance_isolation: z.number().nullable().optional(),
		epaisseur_isolation: z.number().nullable().optional(),
		tv_umur_id: z.number().nullable().optional(),
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum,
	}),
	donnee_intermediaire: z.object({
		b: z.number().nullable().optional(),
		umur: z.number(),
		umur0: z.number().nullable().optional(),
	}),
});
export type Mur = z.infer<typeof Mur>;

export const Inertie = z.object({
	inertie_plancher_bas_lourd: z.boolean(),
	inertie_plancher_haut_lourd: z.boolean(),
	inertie_paroi_verticale_lourd: z.boolean(),
	enum_classe_inertie_id: enums.ClasseInertieEnum,
});
export type Inertie = z.infer<typeof Inertie>;

export const Enveloppe = z.object({
	inertie: Inertie,
	mur_collection: z.array(Mur),
	plancher_bas_collection: z.array(PlancherBas),
	plancher_haut_collection: z.array(PlancherHaut),
	baie_vitree_collection: z.array(BaieVitree),
	porte_collection: z.array(Porte),
	ets_collection: z.array(Ets),
	pont_thermique_collection: z.array(PontThermique),
});
export type Enveloppe = z.infer<typeof Enveloppe>;

// ==================================================================================================
// Logement
// ==================================================================================================

export const Meteo = z.object({
	enum_zone_climatique_id: enums.ZoneClimatiqueEnum,
	altitude: z.number().nullable().optional(),
	enum_classe_altitude_id: enums.ClasseAltitudeEnum,
	batiment_materiaux_anciens: z.boolean(),
});
export type Meteo = z.infer<typeof Meteo>;

export const CaracteristiqueGenerale = z.object({
	annee_construction: z.number().nullable().optional(),
	enum_periode_construction_id: enums.PeriodeConstructionEnum,
	enum_methode_application_dpe_log_id: enums.MethodeApplicationDpeLogEnum,
	enum_calcul_echantillonnage_id: enums.CalculEchantillonnageEnum.nullable().optional(),
	surface_habitable_logement: z.number().nullable().optional(),
	nombre_niveau_immeuble: z.number().nullable().optional(),
	nombre_niveau_logement: z.number().nullable().optional(),
	hsp: z.number(),
	surface_habitable_immeuble: z.number().nullable().optional(),
	surface_tertiaire_immeuble: z.number().nullable().optional(),
	nombre_appartement: z.number().nullable().optional(),
	appartement_non_visite: z.boolean().nullable().optional(),
});
export type CaracteristiqueGenerale = z.infer<typeof CaracteristiqueGenerale>;

export const Adresse = z.object({
	adresse_brut: z.string(),
	code_postal_brut: z.string(),
	nom_commune_brut: z.string(),
	label_brut: z.string(),
	label_brut_avec_complement: z.string().nullable().optional(),
	enum_statut_geocodage_ban_id: enums.StatutGeocodageBanEnum,
	ban_date_appel: z.string(),
	ban_id: z.string().nullable().optional(),
	ban_label: z.string().nullable().optional(),
	ban_housenumber: z.string().nullable().optional(),
	ban_street: z.string().nullable().optional(),
	ban_citycode: z.string().nullable().optional(),
	ban_postcode: z.string().nullable().optional(),
	ban_city: z.string().nullable().optional(),
	ban_type: z
		.enum(["housenumber", "street", "municipality", "locality"])
		.nullable()
		.optional(),
	ban_score: z.number().nullable().optional(),
	ban_x: z.number().nullable().optional(),
	ban_y: z.number().nullable().optional(),
	compl_nom_residence: z.string().nullable().optional(),
	compl_ref_batiment: z.string().nullable().optional(),
	compl_etage_appartement: z.number().nullable().optional(),
	compl_ref_cage_escalier: z.string().nullable().optional(),
	compl_ref_logement: z.string().nullable().optional(),
});
export type Adresse = z.infer<typeof Adresse>;

export const Geolocalisation = z.object({
	invar_logement: z.string().nullable().optional(),
	numero_fiscal_local: z.string().nullable().optional(),
	id_batiment_rnb: z.string().nullable().optional(),
	rpls_log_id: z.string().nullable().optional(),
	rpls_org_id: z.string().nullable().optional(),
	idpar: z.string().nullable().optional(),
	immatriculation_copropriete: z.string().nullable().optional(),
	adresses: z.object({
		adresse_bien: Adresse,
		adresse_proprietaire_installation_commune: Adresse.nullable().optional(),
	}),
});
export type Geolocalisation = z.infer<typeof Geolocalisation>;

export const Administratif = z.object({
	dpe_a_remplacer: z.string().nullable().optional(),
	reference_interne_projet: z.string().nullable().optional(),
	motif_remplacement: z.string().nullable().optional(),
	dpe_immeuble_associe: z.string().nullable().optional(),
	enum_version_id: enums.VersionEnum.exclude(["2.3", "2.4", "2.5", "2.6"]),
	date_visite_diagnostiqueur: z.string(),
	date_etablissement_dpe: z.string(),
	enum_modele_dpe_id: enums.ModeleDpeEnum,
	geolocalisation: Geolocalisation,
});
export type Administratif = z.infer<typeof Administratif>;

export const Logement = z.object({
	caracteristique_generale: CaracteristiqueGenerale,
	meteo: Meteo,
	enveloppe: Enveloppe,
	ventilation_collection: z.array(Ventilation),
	climatisation_collection: z.array(Climatisation),
	installation_ecs_collection: z.array(InstallationEcs),
	installation_chauffage_collection: z.array(InstallationChauffage),
	production_elec_enr: ProductionElecEnr.nullable().optional(),
	sortie: Sortie,
});
export type Logement = z.infer<typeof Logement>;

// ==================================================================================================
// DPE
// ==================================================================================================

export const DPELogementExistant = z.object({
	numero_dpe: z.string(),
	administratif: Administratif,
	logement: Logement,
	dpe_immeuble: DPEImmeuble.nullable().optional(),
	descriptif_enr_collection: z.array(DescriptifEnr),
	descriptif_simplifie_collection: z.array(DescriptifSimplifie),
	fiche_technique_collection: z.array(FicheTechnique),
	justificatif_collection: z.array(Justificatif),
	descriptif_geste_entretien_collection: z.array(DescriptifGesteEntretien),
	descriptif_travaux: DescriptifTravaux.nullable().optional(),
});
export type DPELogementExistant = z.infer<typeof DPELogementExistant>;
