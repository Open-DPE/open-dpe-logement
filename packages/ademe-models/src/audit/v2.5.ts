import * as z from "zod";
import * as enums from "./enums";
import * as dpeEnums from "../dpe/enums";

// ==================================================================================================
// Audit énergétique v2.5 - TypeScript definitions
// Source : audit_v2.5.xsd (seul changement structurel réel vs v2.4 : minExclusive -> minInclusive sur climatisation.donnee_intermediaire — non modélisé, ce package ne contraint pas les bornes numériques)
// ==================================================================================================

// ==================================================================================================
// Administratif — Adresse, Géolocalisation, Auditeur
// ==================================================================================================

export const Adresse = z.object({
	adresse_brut: z.string(),
	code_postal_brut: z.string(),
	nom_commune_brut: z.string(),
	label_brut: z.string(),
	label_brut_avec_complement: z.string(),
	enum_statut_geocodage_ban_id: dpeEnums.StatutGeocodageBanEnum,
	ban_date_appel: z.string(),
	ban_id: z.string().nullable().optional(),
	ban_id_ban_adresse: z.string().nullable().optional(),
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
	reference_interne_projet: z.string().nullable().optional(),
	motif_remplacement: z.string().nullable().optional(),
	geolocalisation: Geolocalisation,
	date_visite_auditeur: z.string(),
	date_etablissement_audit: z.string(),
	date_expiration_audit: z.string(),
	numero_dpe: z.string().nullable().optional(),
	audit_a_remplacer: z.string().nullable().optional(),
	enum_version_dpe_id: enums.VersionDpeEnum.nullable().optional(),
	enum_version_audit_id: enums.VersionAuditEnum,
	enum_modele_audit_id: enums.ModeleAuditEnum,
	enum_derogation_technique_id: enums.DerogationTechniqueEnum,
	derogation_technique_detail: z.string().nullable().optional(),
	enum_derogation_economique_id: enums.DerogationEconomiqueEnum,
	derogation_economique_detail: z.string().nullable().optional(),
	enum_derogation_ventilation_id:
		enums.DerogationVentilationEnum.nullable().optional(),
	derogation_ventilation_detail: z.string().nullable().optional(),
	horodatage_historisation: z.string().nullable().optional(),
});
export type Administratif = z.infer<typeof Administratif>;

// ==================================================================================================
// DPE immeuble (échantillon de logements visités)
// ==================================================================================================

export const LogementVisite = z.object({
	description: z.string(),
	enum_position_etage_logement_id: dpeEnums.PositionEtageLogementEnum,
	enum_typologie_logement_id: dpeEnums.TypologieLogementEnum,
	surface_habitable_logement: z.number(),
});
export type LogementVisite = z.infer<typeof LogementVisite>;

export const DpeImmeuble = z.object({
	logement_visite_collection: z.array(LogementVisite),
});
export type DpeImmeuble = z.infer<typeof DpeImmeuble>;

// ==================================================================================================
// Vue d'ensemble du logement
// ==================================================================================================

export const DescriptionDuBien = z.object({
	enum_rubrique_description_id: enums.RubriqueDescriptionEnum,
	description: z.string(),
});
export type DescriptionDuBien = z.infer<typeof DescriptionDuBien>;

export const DescriptifEnveloppe = z.object({
	nom: z.string(),
	description: z.string(),
	enum_categorie_descriptif_enveloppe_id:
		enums.CategorieDescriptifEnveloppeEnum,
	qualite_isol: dpeEnums.QualiteComposantEnum,
});
export type DescriptifEnveloppe = z.infer<typeof DescriptifEnveloppe>;

export const DescriptifEquipements = z.object({
	description: z.string(),
	description_etat_systeme: z.string().nullable().optional(),
	enum_categorie_descriptif_sys_id: enums.CategorieDescriptifSysEnum,
});
export type DescriptifEquipements = z.infer<typeof DescriptifEquipements>;

export const VueEnsembleLogement = z.object({
	description_du_bien_collection: z.array(DescriptionDuBien),
	descriptif_enveloppe_collection: z.array(DescriptifEnveloppe),
	descriptif_equipements_collection: z.array(DescriptifEquipements),
});
export type VueEnsembleLogement = z.infer<typeof VueEnsembleLogement>;

// ==================================================================================================
// Expertise de l'auditeur
// ==================================================================================================

export const PathologieCaracteristique = z.object({
	description: z.string(),
	conseil: z.string().nullable().optional(),
	enum_type_observation_id: enums.TypeObservationEnum,
	uri_interne_image: z.string().nullable().optional(),
});
export type PathologieCaracteristique = z.infer<
	typeof PathologieCaracteristique
>;

export const RecommandationScenario = z.object({
	recommandation: z.string(),
	enum_scenario_id: enums.ScenarioEnum,
});
export type RecommandationScenario = z.infer<typeof RecommandationScenario>;

export const ExpertiseAuditeur = z.object({
	pathologie_caracteristique_collection: z.array(PathologieCaracteristique),
	recommandation_auditeur_collection: z.array(RecommandationScenario),
	explications_personnalisees: z.string(),
	observations_auditeur: z.string(),
});
export type ExpertiseAuditeur = z.infer<typeof ExpertiseAuditeur>;

// ==================================================================================================
// Fiches techniques et justificatifs
// ==================================================================================================

export const SousFicheTechnique = z.object({
	description: z.string(),
	valeur: z.string(),
	detail_origine_donnee: z.string().nullable().optional(),
	enum_origine_donnee_id: dpeEnums.OrigineDonneeEnum,
});
export type SousFicheTechnique = z.infer<typeof SousFicheTechnique>;

export const FicheTechnique = z.object({
	enum_categorie_fiche_technique_id: dpeEnums.CategorieFicheTechniqueEnum,
	sous_fiche_technique_collection: z.array(SousFicheTechnique),
});
export type FicheTechnique = z.infer<typeof FicheTechnique>;

export const JustificatifAudit = z.object({
	description: z.string(),
	enum_type_justificatif_audit_id: enums.TypeJustificatifAuditEnum,
});
export type JustificatifAudit = z.infer<typeof JustificatifAudit>;

// ==================================================================================================
// Enveloppe — types feuilles
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
		enum_methode_saisie_pont_thermique_id:
			dpeEnums.MethodeSaisiePontThermiqueEnum,
		enum_type_liaison_id: dpeEnums.TypeLiaisonEnum,
		k_saisi: z.number().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
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
		enum_orientation_id: dpeEnums.OrientationEnum,
		enum_inclinaison_vitrage_id: dpeEnums.InclinaisonVitrageEnum,
		surface_totale_baie: z.number(),
		nb_baie: z.number(),
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
});
export type BaieEts = z.infer<typeof BaieEts>;

export const Ets = z.object({
	baie_ets_collection: z.array(BaieEts),
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		enum_cfg_isolation_lnc_id: dpeEnums.CfgIsolationLncEnum,
		tv_coef_transparence_ets_id: z.number(),
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
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
		enum_cfg_isolation_lnc_id:
			dpeEnums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: dpeEnums.TypeAdjacenceEnum,
		tv_coef_reduction_deperdition_id: z.number().nullable().optional(),
		surface_aiu: z.number().nullable().optional(),
		surface_aue: z.number().nullable().optional(),
		surface_porte: z.number(),
		tv_uporte_id: z.number().nullable().optional(),
		enum_methode_saisie_uporte_id: dpeEnums.MethodeSaisieUporteEnum,
		enum_type_porte_id: dpeEnums.TypePorteEnum,
		uporte_saisi: z.number().nullable().optional(),
		nb_porte: z.number().nullable().optional(),
		largeur_dormant: z.number().nullable().optional(),
		presence_retour_isolation: z.boolean().nullable().optional(),
		presence_joint: z.boolean(),
		enum_type_pose_id: dpeEnums.TypePoseEnum,
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		uporte: z.number(),
		b: z.number(),
	}),
});
export type Porte = z.infer<typeof Porte>;

export const MasqueLointainNonHomogene = z.object({
	tv_coef_masque_lointain_non_homogene_id: z.number(),
});
export type MasqueLointainNonHomogene = z.infer<
	typeof MasqueLointainNonHomogene
>;

export const BaieVitreeDoubleFenetre = z.object({
	donnee_entree: z.object({
		tv_ug_id: z.number().nullable().optional(),
		enum_type_vitrage_id: dpeEnums.TypeVitrageEnum,
		enum_inclinaison_vitrage_id: dpeEnums.InclinaisonVitrageEnum,
		enum_type_gaz_lame_id: dpeEnums.TypeGazLameEnum.nullable().optional(),
		epaisseur_lame: z.number().nullable().optional(),
		vitrage_vir: z.boolean().nullable().optional(),
		enum_methode_saisie_perf_vitrage_id: dpeEnums.MethodeSaisiePerfVitrageEnum,
		ug_saisi: z.number().nullable().optional(),
		tv_uw_id: z.number().nullable().optional(),
		enum_type_materiaux_menuiserie_id: dpeEnums.TypeMateriauxMenuiserieEnum,
		enum_type_baie_id: dpeEnums.TypeBaieEnum,
		uw_saisi: z.number().nullable().optional(),
		tv_sw_id: z.number().nullable().optional(),
		sw_saisi: z.number().nullable().optional(),
		enum_type_pose_id: dpeEnums.TypePoseEnum,
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
		enum_cfg_isolation_lnc_id:
			dpeEnums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: dpeEnums.TypeAdjacenceEnum,
		surface_totale_baie: z.number(),
		nb_baie: z.number(),
		tv_ug_id: z.number().nullable().optional(),
		enum_type_vitrage_id: dpeEnums.TypeVitrageEnum,
		enum_inclinaison_vitrage_id: dpeEnums.InclinaisonVitrageEnum,
		enum_type_gaz_lame_id: dpeEnums.TypeGazLameEnum.nullable().optional(),
		epaisseur_lame: z.number().nullable().optional(),
		vitrage_vir: z.boolean().nullable().optional(),
		enum_methode_saisie_perf_vitrage_id: dpeEnums.MethodeSaisiePerfVitrageEnum,
		ug_saisi: z.number().nullable().optional(),
		tv_uw_id: z.number().nullable().optional(),
		enum_type_materiaux_menuiserie_id: dpeEnums.TypeMateriauxMenuiserieEnum,
		enum_type_baie_id: dpeEnums.TypeBaieEnum,
		uw_saisi: z.number().nullable().optional(),
		double_fenetre: z.boolean(),
		uw_1: z.number().nullable().optional(),
		sw_1: z.number().nullable().optional(),
		uw_2: z.number().nullable().optional(),
		sw_2: z.number().nullable().optional(),
		tv_deltar_id: z.number().nullable().optional(),
		tv_ujn_id: z.number().nullable().optional(),
		enum_type_fermeture_id: dpeEnums.TypeFermetureEnum,
		presence_protection_solaire_hors_fermeture: z.boolean(),
		ujn_saisi: z.number().nullable().optional(),
		presence_retour_isolation: z.boolean(),
		presence_joint: z.boolean(),
		largeur_dormant: z.number(),
		tv_sw_id: z.number().nullable().optional(),
		sw_saisi: z.number().nullable().optional(),
		enum_type_pose_id: dpeEnums.TypePoseEnum,
		enum_orientation_id: dpeEnums.OrientationEnum,
		tv_coef_masque_proche_id: z.number(),
		tv_coef_masque_lointain_homogene_id: z.number().nullable().optional(),
		masque_lointain_non_homogene_collection: z
			.array(MasqueLointainNonHomogene)
			.nullable()
			.optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		b: z.number(),
		ug: z.number().nullable().optional(),
		uw: z.number(),
		ujn: z.number().nullable().optional(),
		u_menuiserie: z.number(),
		sw: z.number(),
		fe1: z.number(),
		fe2: z.number(),
	}),
	baie_vitree_double_fenetre: BaieVitreeDoubleFenetre.nullable().optional(),
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
		enum_cfg_isolation_lnc_id:
			dpeEnums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: dpeEnums.TypeAdjacenceEnum,
		surface_paroi_opaque: z.number(),
		paroi_lourde: z.boolean(),
		uph0_saisi: z.number().nullable().optional(),
		tv_uph0_id: z.number().nullable().optional(),
		enum_type_plancher_haut_id: dpeEnums.TypePlancherHautEnum,
		enum_methode_saisie_u0_id: dpeEnums.MethodeSaisieU0Enum,
		uph_saisi: z.number().nullable().optional(),
		enum_type_isolation_id: dpeEnums.TypeIsolationEnum,
		enum_periode_isolation_id:
			dpeEnums.PeriodeIsolationEnum.nullable().optional(),
		resistance_isolation: z.number().nullable().optional(),
		epaisseur_isolation: z.number().nullable().optional(),
		tv_uph_id: z.number().nullable().optional(),
		enum_methode_saisie_u_id: dpeEnums.MethodeSaisieUEnum,
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		b: z.number(),
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
		enum_cfg_isolation_lnc_id:
			dpeEnums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: dpeEnums.TypeAdjacenceEnum,
		surface_paroi_opaque: z.number(),
		paroi_lourde: z.boolean(),
		upb0_saisi: z.number().nullable().optional(),
		tv_upb0_id: z.number().nullable().optional(),
		enum_type_plancher_bas_id: dpeEnums.TypePlancherBasEnum,
		enum_methode_saisie_u0_id: dpeEnums.MethodeSaisieU0Enum,
		upb_saisi: z.number().nullable().optional(),
		enum_type_isolation_id: dpeEnums.TypeIsolationEnum,
		enum_periode_isolation_id:
			dpeEnums.PeriodeIsolationEnum.nullable().optional(),
		resistance_isolation: z.number().nullable().optional(),
		epaisseur_isolation: z.number().nullable().optional(),
		tv_upb_id: z.number().nullable().optional(),
		enum_methode_saisie_u_id: dpeEnums.MethodeSaisieUEnum,
		calcul_ue: z.boolean(),
		perimetre_ue: z.number().nullable().optional(),
		surface_ue: z.number().nullable().optional(),
		ue: z.number().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		b: z.number(),
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
		enum_cfg_isolation_lnc_id:
			dpeEnums.CfgIsolationLncEnum.nullable().optional(),
		enum_type_adjacence_id: dpeEnums.TypeAdjacenceEnum,
		enum_orientation_id: dpeEnums.OrientationEnum,
		surface_paroi_totale: z.number().nullable().optional(),
		surface_paroi_opaque: z.number(),
		paroi_lourde: z.boolean(),
		umur0_saisi: z.number().nullable().optional(),
		tv_umur0_id: z.number().nullable().optional(),
		epaisseur_structure: z.number().nullable().optional(),
		enum_materiaux_structure_mur_id: dpeEnums.MateriauxStructureMurEnum,
		enum_methode_saisie_u0_id: dpeEnums.MethodeSaisieU0Enum,
		enduit_isolant_paroi_ancienne: z.boolean(),
		umur_saisi: z.number().nullable().optional(),
		enum_type_doublage_id: dpeEnums.TypeDoublageEnum,
		enum_type_isolation_id: dpeEnums.TypeIsolationEnum,
		enum_periode_isolation_id:
			dpeEnums.PeriodeIsolationEnum.nullable().optional(),
		resistance_isolation: z.number().nullable().optional(),
		epaisseur_isolation: z.number().nullable().optional(),
		tv_umur_id: z.number().nullable().optional(),
		enum_methode_saisie_u_id: dpeEnums.MethodeSaisieUEnum,
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		b: z.number(),
		umur: z.number(),
		umur0: z.number().nullable().optional(),
	}),
});
export type Mur = z.infer<typeof Mur>;

export const Inertie = z.object({
	inertie_plancher_bas_lourd: z.boolean(),
	inertie_plancher_haut_lourd: z.boolean(),
	inertie_paroi_verticale_lourd: z.boolean(),
	enum_classe_inertie_id: dpeEnums.ClasseInertieEnum,
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
// Systèmes
// ==================================================================================================

export const Ventilation = z.object({
	donnee_entree: z.object({
		surface_ventile: z.number(),
		description: z.string().nullable().optional(),
		reference: z.string(),
		plusieurs_facade_exposee: z.boolean(),
		tv_q4pa_conv_id: z.number().nullable().optional(),
		q4pa_conv_saisi: z.number().nullable().optional(),
		enum_methode_saisie_q4pa_conv_id: dpeEnums.MethodeSaisieQ4paConvEnum,
		tv_debits_ventilation_id: z.number(),
		enum_type_ventilation_id: dpeEnums.TypeVentilationEnum,
		ventilation_post_2012: z.boolean(),
		ref_produit_ventilation: z.string().nullable().optional(),
		cle_repartition_ventilation: z.number().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
		enum_etat_ventilation_id: enums.EtatVentilationEnum.nullable().optional(),
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

export const Climatisation = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		surface_clim: z.number(),
		tv_seer_id: z.number().nullable().optional(),
		nombre_logement_echantillon: z.number().nullable().optional(),
		enum_methode_calcul_conso_id: dpeEnums.MethodeCalculConsoEnum,
		enum_periode_installation_fr_id: dpeEnums.PeriodeInstallationFrEnum,
		cle_repartition_clim: z.number().nullable().optional(),
		enum_type_generateur_fr_id: dpeEnums.TypeGenerateurFrEnum,
		enum_type_energie_id: dpeEnums.TypeEnergieEnum.nullable().optional(),
		enum_methode_saisie_carac_sys_id: dpeEnums.MethodeSaisieCaracSysEnum,
		ref_produit_fr: z.string().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		eer: z.number(),
		besoin_fr: z.number(),
		conso_fr: z.number(),
		conso_fr_depensier: z.number(),
	}),
});
export type Climatisation = z.infer<typeof Climatisation>;

export const PanneauxPv = z.object({
	surface_totale_capteurs: z.number().nullable().optional(),
	ratio_virtualisation: z.number().nullable().optional(),
	nombre_module: z.number().nullable().optional(),
	tv_coef_orientation_pv_id: z.number().nullable().optional(),
	enum_orientation_pv_id: dpeEnums.OrientationPvEnum.nullable().optional(),
	enum_inclinaison_pv_id: dpeEnums.InclinaisonPvEnum.nullable().optional(),
});
export type PanneauxPv = z.infer<typeof PanneauxPv>;

export const ProductionElecEnr = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		presence_production_pv: z.boolean(),
		enum_type_enr_id: dpeEnums.TypeEnrEnum,
		enum_etat_composant_id: enums.EtatComposantEnum,
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

export const GenerateurEcs = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_generateur_mixte: z.string().nullable().optional(),
		enum_type_generateur_ecs_id: dpeEnums.TypeGenerateurEcsEnum,
		ref_produit_generateur_ecs: z.string().nullable().optional(),
		enum_usage_generateur_id: dpeEnums.UsageGenerateurEnum,
		enum_type_energie_id: dpeEnums.TypeEnergieEnum,
		tv_generateur_combustion_id: z.number().nullable().optional(),
		enum_methode_saisie_carac_sys_id: dpeEnums.MethodeSaisieCaracSysEnum,
		tv_pertes_stockage_id: z.number().nullable().optional(),
		tv_scop_id: z.number().nullable().optional(),
		enum_periode_installation_ecs_thermo_id:
			dpeEnums.PeriodeInstallationEcsThermoEnum.nullable().optional(),
		identifiant_reseau_chaleur: z.string().nullable().optional(),
		date_arrete_reseau_chaleur: z.string().nullable().optional(),
		tv_reseau_chaleur_id: z.number().nullable().optional(),
		enum_type_stockage_ecs_id: dpeEnums.TypeStockageEcsEnum,
		position_volume_chauffe: z.boolean(),
		position_volume_chauffe_stockage: z.boolean().nullable().optional(),
		volume_stockage: z.number(),
		presence_ventouse: z.boolean().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		pn: z.number().nullable().optional(),
		qp0: z.number().nullable().optional(),
		pveilleuse: z.number().nullable().optional(),
		rpn: z.number().nullable().optional(),
		cop: z.number().nullable().optional(),
		ratio_besoin_ecs: z.number(),
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
		enum_cfg_installation_ecs_id: dpeEnums.CfgInstallationEcsEnum,
		enum_type_installation_id: dpeEnums.TypeInstallationEnum,
		enum_methode_calcul_conso_id: dpeEnums.MethodeCalculConsoEnum,
		ratio_virtualisation: z.number().nullable().optional(),
		cle_repartition_ecs: z.number().nullable().optional(),
		surface_habitable: z.number(),
		nombre_logement: z.number(),
		rdim: z.number(),
		nombre_niveau_installation_ecs: z.number(),
		fecs_saisi: z.number().nullable().optional(),
		tv_facteur_couverture_solaire_id: z.number().nullable().optional(),
		enum_methode_saisie_fact_couv_sol_id:
			dpeEnums.MethodeSaisieFactCouvSolEnum.nullable().optional(),
		enum_type_installation_solaire_id:
			dpeEnums.TypeInstallationSolaireEnum.nullable().optional(),
		tv_rendement_distribution_ecs_id: z.number(),
		enum_bouclage_reseau_ecs_id: dpeEnums.BouclageReseauEcsEnum,
		reseau_distribution_isole: z.boolean().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
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

export const EmetteurChauffage = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		surface_chauffee: z.number(),
		tv_rendement_emission_id: z.number(),
		tv_rendement_distribution_ch_id: z.number(),
		tv_rendement_regulation_id: z.number(),
		enum_type_emission_distribution_id: dpeEnums.TypeEmissionDistributionEnum,
		tv_intermittence_id: z.number(),
		reseau_distribution_isole: z.boolean().nullable().optional(),
		enum_equipement_intermittence_id: dpeEnums.EquipementIntermittenceEnum,
		enum_type_regulation_id: dpeEnums.TypeRegulationEnum,
		enum_periode_installation_emetteur_id:
			dpeEnums.PeriodeInstallationEmetteurEnum.nullable().optional(),
		enum_type_chauffage_id: dpeEnums.TypeChauffageEnum,
		enum_temp_distribution_ch_id: dpeEnums.TempDistributionChEnum,
		enum_lien_generateur_emetteur_id: dpeEnums.LienGenerateurEmetteurEnum,
		enum_etat_composant_id: enums.EtatComposantEnum,
	}),
	donnee_intermediaire: z.object({
		i0: z.number(),
		rendement_emission: z.number(),
		rendement_distribution: z.number(),
		rendement_regulation: z.number(),
	}),
});
export type EmetteurChauffage = z.infer<typeof EmetteurChauffage>;

export const GenerateurChauffage = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		reference_generateur_mixte: z.string().nullable().optional(),
		ref_produit_generateur_ch: z.string().nullable().optional(),
		enum_type_generateur_ch_id: dpeEnums.TypeGenerateurChEnum,
		enum_usage_generateur_id: dpeEnums.UsageGenerateurEnum,
		enum_type_energie_id: dpeEnums.TypeEnergieEnum,
		position_volume_chauffe: z.boolean(),
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
		enum_methode_saisie_carac_sys_id: dpeEnums.MethodeSaisieCaracSysEnum,
		enum_lien_generateur_emetteur_id: dpeEnums.LienGenerateurEmetteurEnum,
		enum_etat_composant_id: enums.EtatComposantEnum,
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

export const InstallationChauffage = z.object({
	donnee_entree: z.object({
		description: z.string().nullable().optional(),
		reference: z.string(),
		surface_chauffee: z.number(),
		nombre_logement_echantillon: z.number().nullable().optional(),
		rdim: z.number(),
		nombre_niveau_installation_ch: z.number(),
		enum_cfg_installation_ch_id: dpeEnums.CfgInstallationChEnum,
		ratio_virtualisation: z.number().nullable().optional(),
		coef_ifc: z.number().nullable().optional(),
		cle_repartition_ch: z.number().nullable().optional(),
		enum_type_installation_id: dpeEnums.TypeInstallationEnum,
		enum_methode_calcul_conso_id: dpeEnums.MethodeCalculConsoEnum,
		enum_methode_saisie_fact_couv_sol_id:
			dpeEnums.MethodeSaisieFactCouvSolEnum.nullable().optional(),
		tv_facteur_couverture_solaire_id: z.number().nullable().optional(),
		fch_saisi: z.number().nullable().optional(),
		enum_etat_composant_id: enums.EtatComposantEnum,
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

// ==================================================================================================
// Sortie
// ==================================================================================================

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
	classe_bilan_dpe: dpeEnums.ClasseEtiquetteEnum,
});
export type EpConso = z.infer<typeof EpConso>;

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
	classe_emission_ges: dpeEnums.ClasseEtiquetteEnum,
});
export type EmissionGes = z.infer<typeof EmissionGes>;

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

export const SortieParEnergie = z.object({
	enum_type_energie_id: dpeEnums.TypeEnergieEnum,
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

export const ConfortEte = z.object({
	isolation_toiture: z.boolean().nullable().optional(),
	protection_solaire_exterieure: z.boolean(),
	aspect_traversant: z.boolean().nullable().optional(),
	brasseur_air: z.boolean().nullable().optional(),
	inertie_lourde: z.boolean(),
	enum_indicateur_confort_ete_id: dpeEnums.IndicateurConfortEteEnum,
});
export type ConfortEte = z.infer<typeof ConfortEte>;

export const QualiteIsolation = z.object({
	ubat: z.number(),
	ubat_base: z.number().nullable().optional(),
	qualite_isol_enveloppe: dpeEnums.QualiteComposantEnum,
	qualite_isol_mur: dpeEnums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_haut_toit_terrasse:
		dpeEnums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_haut_comble_perdu:
		dpeEnums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_haut_comble_amenage:
		dpeEnums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_plancher_bas:
		dpeEnums.QualiteComposantEnum.nullable().optional(),
	qualite_isol_menuiserie: dpeEnums.QualiteComposantEnum,
});
export type QualiteIsolation = z.infer<typeof QualiteIsolation>;

export const Sortie = z.object({
	deperdition: Deperdition,
	apport_et_besoin: ApportEtBesoin,
	ef_conso: EfConso,
	ep_conso: EpConso,
	emission_ges: EmissionGes,
	cout: Cout,
	production_electricite: ProductionElectricite,
	sortie_par_energie_collection: z.array(SortieParEnergie),
	confort_ete: ConfortEte.nullable().optional(),
	qualite_isolation: QualiteIsolation,
});
export type Sortie = z.infer<typeof Sortie>;

// ==================================================================================================
// Logement — caractéristiques générales et météo
// ==================================================================================================

export const Meteo = z.object({
	enum_zone_climatique_id: dpeEnums.ZoneClimatiqueEnum,
	altitude: z.number().nullable().optional(),
	enum_classe_altitude_id: dpeEnums.ClasseAltitudeEnum,
	batiment_materiaux_anciens: z.boolean(),
});
export type Meteo = z.infer<typeof Meteo>;

export const CaracteristiqueGenerale = z.object({
	annee_construction: z.number().nullable().optional(),
	enum_periode_construction_id: dpeEnums.PeriodeConstructionEnum,
	enum_methode_application_dpe_log_id: dpeEnums.MethodeApplicationDpeLogEnum,
	enum_calcul_echantillonnage_id:
		dpeEnums.CalculEchantillonnageEnum.nullable().optional(),
	surface_habitable_logement: z.number().nullable().optional(),
	nombre_niveau_immeuble: z.number().nullable().optional(),
	nombre_niveau_logement: z.number().nullable().optional(),
	hsp: z.number(),
	surface_habitable_immeuble: z.number().nullable().optional(),
	surface_tertiaire_immeuble: z.number().nullable().optional(),
	nombre_appartement: z.number().nullable().optional(),
	appartement_non_visite: z.boolean().nullable().optional(),
	enum_scenario_id: enums.ScenarioEnum,
	enum_etape_id: enums.EtapeEnum,
	nom_scenario: z.string().nullable().optional(),
});
export type CaracteristiqueGenerale = z.infer<typeof CaracteristiqueGenerale>;

// ==================================================================================================
// Etape travaux (spécifique audit — pas d'équivalent DPE)
// ==================================================================================================

export const DescriptionTravaux = z.object({
	description: z.string(),
	enum_picto_travaux_id: enums.PictoTravauxEnum,
});
export type DescriptionTravaux = z.infer<typeof DescriptionTravaux>;

const IsolationParoi = z.object({
	resistance_isolant: z.number(),
	surface_isolant: z.number(),
});

export const CaracteristiquesTravaux = z.union([
	z.object({ isolation_mur_ite: IsolationParoi }),
	z.object({ isolation_mur_iti: IsolationParoi }),
	z.object({ isolation_sous_rampants: IsolationParoi }),
	z.object({ isolation_combles_non_amenages: IsolationParoi }),
	z.object({ isolation_toiture_terrasse: IsolationParoi }),
	z.object({ isolation_planchers_bas: IsolationParoi }),
	z.object({
		menuiseries_double_vitrage: z.object({
			uw: z.number(),
			sw: z.number(),
			nombre_fenetres: z.number(),
		}),
	}),
	z.object({
		menuiseries_triple_vitrage: z.object({
			uw: z.number(),
			sw: z.number(),
			nombre_fenetres: z.number(),
		}),
	}),
	z.object({ pac_geothermique: z.object({ scop: z.number() }) }),
	z.object({ pac_eau_eau: z.object({ scop: z.number() }) }),
	z.object({ pac_air_eau: z.object({ scop: z.number() }) }),
	z.object({ pac_air_air: z.object({ scop: z.number() }) }),
	z.object({ chauffe_eau_thermodynamique: z.object({ cop: z.number() }) }),
	z.object({
		ballon_ecs_effet_joule: z.object({ volume_stockage: z.number() }),
	}),
]);
export type CaracteristiquesTravaux = z.infer<typeof CaracteristiquesTravaux>;

export const Travaux = z.object({
	enum_lot_travaux_audit_id: enums.LotTravauxAuditEnum,
	enum_type_travaux_id: enums.TypeTravauxEnum,
	reference_collection: z.array(z.string()),
	cout: z.number().nullable().optional(),
	cout_min: z.number().nullable().optional(),
	cout_max: z.number().nullable().optional(),
	description_travaux_collection: z.array(DescriptionTravaux),
	caracteristiques_travaux: CaracteristiquesTravaux.nullable().optional(),
});
export type Travaux = z.infer<typeof Travaux>;

export const TravauxInduits = z.object({
	cout: z.number().nullable().optional(),
	cout_min: z.number().nullable().optional(),
	cout_max: z.number().nullable().optional(),
	description: z.string(),
});
export type TravauxInduits = z.infer<typeof TravauxInduits>;

export const TravauxResume = z.object({
	enum_travaux_resume_id: enums.TravauxResumeEnum,
});
export type TravauxResume = z.infer<typeof TravauxResume>;

export const EtapeTravaux = z.object({
	ep_conso_ch_m2: z.number(),
	ep_conso_ecs_m2: z.number(),
	ep_conso_eclairage_m2: z.number(),
	ep_conso_totale_auxiliaire_m2: z.number(),
	ep_conso_fr_m2: z.number(),
	ep_conso_5_usages_m2: z.number(),
	ep_conso_5_usages_m2_sans_ac: z.number(),
	ef_conso_ch_m2: z.number(),
	ef_conso_ecs_m2: z.number(),
	ef_conso_eclairage_m2: z.number(),
	ef_conso_totale_auxiliaire_m2: z.number(),
	ef_conso_fr_m2: z.number(),
	ef_conso_5_usages_m2: z.number(),
	ef_conso_5_usages_m2_sans_ac: z.number(),
	emission_ges_5_usages_m2: z.number(),
	classe_emission_ges: dpeEnums.ClasseEtiquetteEnum,
	classe_bilan_dpe: dpeEnums.ClasseEtiquetteEnum,
	cout: z.number().nullable().optional(),
	cout_min: z.number().nullable().optional(),
	cout_max: z.number().nullable().optional(),
	ep_conso_5_usages_m2_gain: z.number(),
	ep_conso_5_usages_m2_gain_relatif: z.number(),
	ef_conso_5_usages_m2_gain: z.number(),
	ef_conso_5_usages_m2_gain_relatif: z.number(),
	emission_ges_5_usages_m2_gain: z.number(),
	emission_ges_5_usages_m2_gain_relatif: z.number(),
	facture_gain: z.number(),
	cout_cumule: z.number().nullable().optional(),
	cout_cumule_min: z.number().nullable().optional(),
	cout_cumule_max: z.number().nullable().optional(),
	ep_conso_5_usages_m2_gain_cumule: z.number(),
	ep_conso_5_usages_m2_gain_cumule_relatif: z.number(),
	ef_conso_5_usages_m2_gain_cumule: z.number(),
	ef_conso_5_usages_m2_gain_cumule_relatif: z.number(),
	emission_ges_5_usages_m2_gain_cumule: z.number(),
	emission_ges_5_usages_m2_gain_cumule_relatif: z.number(),
	facture_gain_cumule: z.number(),
	aide_financiere_locale: z.string(),
	aide_financiere_nationale: z.string(),
	travaux_collection: z.array(Travaux),
	travaux_induits_collection: z.array(TravauxInduits),
	travaux_resume_collection: z.array(TravauxResume),
});
export type EtapeTravaux = z.infer<typeof EtapeTravaux>;

// ==================================================================================================
// Logement (racine du complexType transcrit)
// ==================================================================================================

export const Logement = z.object({
	caracteristique_generale: CaracteristiqueGenerale,
	meteo: Meteo,
	enveloppe: Enveloppe,
	ventilation_collection: z.array(Ventilation),
	climatisation_collection: z.array(Climatisation),
	production_elec_enr: ProductionElecEnr.nullable().optional(),
	installation_ecs_collection: z.array(InstallationEcs),
	installation_chauffage_collection: z.array(InstallationChauffage),
	sortie: Sortie,
	etape_travaux: EtapeTravaux.nullable().optional(),
});
export type Logement = z.infer<typeof Logement>;

// ==================================================================================================
// Audit (racine)
// ==================================================================================================

export const Audit = z.object({
	numero_audit: z.string(),
	administratif: Administratif,
	logement_collection: z.array(Logement),
	dpe_immeuble: DpeImmeuble.nullable().optional(),
	vue_ensemble_logement: VueEnsembleLogement,
	expertise_auditeur: ExpertiseAuditeur,
	fiche_technique_collection: z.array(FicheTechnique),
	justificatif_audit_collection: z.array(JustificatifAudit),
});
export type Audit = z.infer<typeof Audit>;
