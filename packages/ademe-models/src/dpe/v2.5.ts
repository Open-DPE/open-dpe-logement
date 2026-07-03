import type * as enums from "./enums";

// ==================================================================================================
// DPEv2.5 - TypeScript definitions
// Source : DPEv2.5.xsd
// ==================================================================================================

export type DPE = {
	id: string;
	hashkey: string;
	version: enums.VersionEnum;
	logement?: Logement | null;
	logement_neuf?: LogementNeuf | null;
	tertiaire?: Tertiaire | null;
	dpe_immeuble?: DPEImmeuble | null;
	descriptif_enr_collection: Array<DescriptifEnr>;
	descriptif_simplifie_collection: Array<DescriptifSimplifie>;
	fiche_technique_collection: Array<FicheTechnique>;
	justificatif_collection: Array<Justificatif>;
	descriptif_geste_entretien_collection: Array<DescriptifGesteEntretien>;
	descriptif_travaux?: DescriptifTravaux | null;
};

// ==================================================================================================
// Common
// ==================================================================================================

export type OuiNon = 0 | 1;

// ==================================================================================================
// Logement
// ==================================================================================================

export type Logement = {
	caracteristique_generale: CaracteristiqueGenerale;
	meteo: Meteo;
	administratif: Administratif;
	enveloppe: Enveloppe;
	ventilation_collection: Array<Ventilation>;
	climatisation_collection: Array<Climatisation>;
	installation_ecs_collection: Array<InstallationEcs>;
	installation_chauffage_collection: Array<InstallationChauffage>;
	production_elec_enr?: ProductionElecEnr | null;
	sortie: Sortie;
};

export type CaracteristiqueGenerale = {
	annee_construction?: number | null;
	enum_periode_construction_id: enums.PeriodeConstructionEnum;
	enum_methode_application_dpe_log_id: enums.MethodeApplicationDpeLogEnum;
	enum_calcul_echantillonnage_id?: enums.CalculEchantillonnageEnum | null;
	surface_habitable_logement?: number | null;
	nombre_niveau_immeuble?: number | null;
	nombre_niveau_logement?: number | null;
	hsp: number;
	surface_habitable_immeuble?: number | null;
	surface_tertiaire_immeuble?: number | null;
	nombre_appartement?: number | null;
	appartement_non_visite?: OuiNon | null;
};

export type Meteo = {
	enum_zone_climatique_id: enums.ZoneClimatiqueEnum;
	altitude?: number | null;
	enum_classe_altitude_id: enums.ClasseAltitudeEnum;
	batiment_materiaux_anciens: OuiNon;
};

export type Administratif = {
	dpe_a_remplacer?: string | null;
	reference_interne_projet?: string | null;
	motif_remplacement?: string | null;
	dpe_immeuble_associe?: string | null;
	enum_version_id: Exclude<enums.VersionEnum, "2.6">;
	date_visite_diagnostiqueur: string;
	nom_proprietaire: string;
	siren_proprietaire?: string | null;
	nom_proprietaire_installation_commune?: string | null;
	date_etablissement_dpe: string;
	enum_modele_dpe_id: enums.ModeleDpeEnum;
	diagnostiqueur: Diagnostiqueur;
	geolocalisation: Geolocalisation;
	enum_consentement_formulaire_id: enums.ConsentementFormulaireEnum;
	information_formulaire_consentement?: InformationFormulaireConsentement | null;
	enum_commanditaire_id: enums.CommanditaireEnum;
	horodatage_historisation?: string | null;
};

export type InformationFormulaireConsentement = {
	nom_formulaire: string;
	personne_morale: OuiNon;
	siren_formulaire?: string | null;
	telephone?: string | null;
	mail?: string | null;
	label_adresse: string;
	label_adresse_avec_complement: string;
};

export type Geolocalisation = {
	invar_logement?: string | null;
	numero_fiscal_local?: string | null;
	id_batiment_rnb?: string | null;
	rpls_log_id?: string | null;
	rpls_org_id?: string | null;
	Enumpar?: string | null;
	immatriculation_copropriete?: string | null;
	adresses: {
		adresse_bien: Adresse;
		adresse_proprietaire: Adresse;
		adresse_proprietaire_installation_commune?: Adresse | null;
	};
};

export type Diagnostiqueur = {
	usr_logiciel_id: number;
	version_logiciel: string;
	version_moteur_calcul?: string | null;
	nom_diagnostiqueur: string;
	prenom_diagnostiqueur: string;
	mail_diagnostiqueur: string;
	telephone_diagnostiqueur: string;
	adresse_diagnostiqueur: string;
	entreprise_diagnostiqueur: string;
	numero_certification_diagnostiqueur: string;
	organisme_certificateur: string;
};

export type Adresse = {
	adresse_brut: string;
	code_postal_brut: string;
	nom_commune_brut: string;
	label_brut: string;
	label_brut_avec_complement: string;
	enum_statut_geocodage_ban_id: enums.StatutGeocodageBanEnum;
	ban_date_appel: string;
	ban_id?: string | null;
	ban_id_ban_adresse?: string | null;
	ban_label?: string | null;
	ban_housenumber?: string | null;
	ban_street?: string | null;
	ban_citycode?: string | null;
	ban_postcode?: string | null;
	ban_city?: string | null;
	ban_type?: "housenumber" | "street" | "municipality" | "locality" | null;
	ban_score?: number | null;
	ban_x?: number | null;
	ban_y?: number | null;
	compl_nom_resEnumence?: string | null;
	compl_ref_batiment?: string | null;
	compl_etage_appartement?: number | null;
	compl_ref_cage_escalier?: string | null;
	compl_ref_logement?: string | null;
};

// ==================================================================================================
// Enveloppe
// ==================================================================================================

export type Enveloppe = {
	inertie: Inertie;
	mur_collection: Array<Mur>;
	plancher_bas_collection: Array<PlancherBas>;
	plancher_haut_collection: Array<PlancherHaut>;
	baie_vitree_collection: Array<BaieVitree>;
	porte_collection: Array<Porte>;
	ets_collection: Array<Ets>;
	pont_thermique_collection: Array<PontThermique>;
};

export type Inertie = {
	inertie_plancher_bas_lourd: OuiNon;
	inertie_plancher_haut_lourd: OuiNon;
	inertie_paroi_verticale_lourd: OuiNon;
	enum_classe_inertie_id: enums.ClasseInertieEnum;
};

export type Mur = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_lnc?: string | null;
		tv_coef_reduction_deperdition_id?: number | null;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		enum_orientation_id: enums.OrientationEnum;
		surface_paroi_totale: number;
		surface_paroi_opaque: number;
		paroi_lourde: OuiNon;
		umur0_saisi?: number | null;
		tv_umur0_id?: number | null;
		epaisseur_structure?: number | null;
		enum_materiaux_structure_mur_id?: enums.MateriauxStructureMurEnum | null;
		enum_methode_saisie_u0_id: enums.MethodeSaisieU0Enum;
		enduit_isolant_paroi_ancienne: OuiNon;
		umur_saisi?: number | null;
		enum_type_doublage_id?: enums.TypeDoublageEnum | null;
		enum_type_isolation_id: enums.TypeIsolationEnum;
		enum_periode_isolation_id?: enums.PeriodeIsolationEnum | null;
		resistance_isolation?: number | null;
		epaisseur_isolation?: number | null;
		tv_umur_id?: number | null;
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum;
	};
	donnee_intermediaire: {
		b?: number | null;
		umur: number;
		umur0: number;
	};
};

export type PlancherBas = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_lnc?: string | null;
		tv_coef_reduction_deperdition_id?: number | null;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_paroi_opaque: number;
		paroi_lourde: OuiNon;
		upb0_saisi?: number | null;
		tv_upb0_id?: number | null;
		enum_type_plancher_bas_id: enums.TypePlancherBasEnum;
		enum_methode_saisie_u0_id: enums.MethodeSaisieU0Enum;
		upb_saisi?: number | null;
		enum_type_isolation_id: enums.TypeIsolationEnum;
		enum_periode_isolation_id?: enums.PeriodeIsolationEnum | null;
		resistance_isolation?: number | null;
		epaisseur_isolation?: number | null;
		tv_upb_id?: number | null;
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum;
		calcul_ue?: OuiNon | null;
		perimetre_ue?: number | null;
		surface_ue?: number | null;
		ue?: number | null;
	};
	donnee_intermediaire: {
		b?: number | null;
		upb: number;
		upb_final: number;
		upb0: number;
	};
};

export type PlancherHaut = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_lnc?: string | null;
		tv_coef_reduction_deperdition_id?: number | null;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_paroi_opaque: number;
		paroi_lourde: OuiNon;
		uph0_saisi?: number | null;
		tv_uph0_id?: number | null;
		enum_type_plancher_haut_id: enums.TypePlancherHautEnum;
		enum_methode_saisie_u0_id: enums.MethodeSaisieU0Enum;
		uph_saisi?: number | null;
		enum_type_isolation_id: enums.TypeIsolationEnum;
		enum_periode_isolation_id?: enums.PeriodeIsolationEnum | null;
		resistance_isolation?: number | null;
		epaisseur_isolation?: number | null;
		tv_uph_id?: number | null;
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum;
	};
	donnee_intermediaire: {
		b?: number | null;
		uph: number;
		uph0: number;
	};
};

export type BaieVitree = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_paroi?: string | null;
		reference_lnc?: string | null;
		tv_coef_reduction_deperdition_id?: number | null;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_totale_baie: number;
		nb_baie: number;
		tv_ug_id?: number | null;
		enum_type_vitrage_id: enums.TypeVitrageEnum;
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum;
		enum_type_gaz_lame_id?: enums.TypeGazLameEnum | null;
		epaisseur_lame?: number | null;
		vitrage_vir?: OuiNon | null;
		enum_methode_saisie_perf_vitrage_id: enums.MethodeSaisiePerfVitrageEnum;
		ug_saisi?: number | null;
		tv_uw_id?: number | null;
		enum_type_materiaux_menuiserie_id: enums.TypeMateriauxMenuiserieEnum;
		enum_type_baie_id: enums.TypeBaieEnum;
		uw_saisi?: number | null;
		double_fenetre?: OuiNon | null;
		uw_1?: number | null;
		sw_1?: number | null;
		uw_2?: number | null;
		sw_2?: number | null;
		tv_deltar_id?: number | null;
		tv_ujn_id?: number | null;
		enum_type_fermeture_id: enums.TypeFermetureEnum;
		presence_protection_solaire_hors_fermeture: OuiNon;
		ujn_saisi?: number | null;
		presence_retour_isolation?: OuiNon | null;
		presence_joint: OuiNon;
		largeur_dormant?: number | null;
		tv_sw_id?: number | null;
		sw_saisi?: number | null;
		enum_type_pose_id: enums.TypePoseEnum;
		enum_orientation_id: enums.OrientationEnum;
		tv_coef_masque_proche_id?: number | null;
		tv_coef_masque_lointain_homogene_id?: number | null;
		masque_lointain_non_homogene_collection?: Array<MasqueLointainNonHomogene> | null;
		baie_vitree_double_fenetre?: BaieVitreeDoubleFenetre | null;
	};
	donnee_intermediaire: {
		b?: number | null;
		ug: number;
		uw: number;
		ujn: number;
		u_menuiserie: number;
		sw: number;
		fe1: number;
		fe2: number;
	};
};

export type BaieVitreeDoubleFenetre = {
	donnee_entree: {
		tv_ug_id?: number | null;
		enum_type_vitrage_id: enums.TypeVitrageEnum;
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum;
		enum_type_gaz_lame_id?: enums.TypeGazLameEnum | null;
		epaisseur_lame?: number | null;
		vitrage_vir?: OuiNon | null;
		enum_methode_saisie_perf_vitrage_id: enums.MethodeSaisiePerfVitrageEnum;
		ug_saisi?: number | null;
		tv_uw_id?: number | null;
		enum_type_materiaux_menuiserie_id: enums.TypeMateriauxMenuiserieEnum;
		enum_type_baie_id: enums.TypeBaieEnum;
		uw_saisi?: number | null;
		tv_sw_id?: number | null;
		sw_saisi?: number | null;
		enum_type_pose_id: enums.TypePoseEnum;
	};
	donnee_intermediaire: {
		ug?: number | null;
		uw: number;
		sw: number;
	};
};

export type MasqueLointainNonHomogene = {
	tv_coef_masque_lointain_non_homogene_id: number;
};

export type Porte = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_paroi?: string | null;
		reference_lnc?: string | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		tv_coef_reduction_deperdition_id?: number | null;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		surface_porte: number;
		tv_uporte_id?: number | null;
		enum_methode_saisie_uporte_id: enums.MethodeSaisieUporteEnum;
		enum_type_porte_id: enums.TypePorteEnum;
		uporte_saisi?: number | null;
		nb_porte: number;
		largeur_dormant?: number | null;
		presence_retour_isolation?: OuiNon | null;
		presence_joint: OuiNon;
		enum_type_pose_id: enums.TypePoseEnum;
	};
	donnee_intermediaire: {
		uporte: number;
		b?: number | null;
	};
};

export type Ets = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		tv_coef_reduction_deperdition_id?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		tv_coef_transparence_ets_id?: number | null;
	};
	baie_ets_collection: Array<BaieEts>;
	donnee_intermediaire: {
		coef_transparence_ets: number;
		bver: number;
	};
};

export type BaieEts = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		enum_orientation_id: enums.OrientationEnum;
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum;
		surface_totale_baie: number;
		nb_baie: number;
	};
};

export type PontThermique = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_1?: string | null;
		reference_2?: string | null;
		tv_pont_thermique_id?: number | null;
		pourcentage_valeur_pont_thermique: number;
		l: number;
		enum_methode_saisie_pont_thermique_id: enums.MethodeSaisiePontThermiqueEnum;
		enum_type_liaison_id: enums.TypeLiaisonEnum;
		k_saisi?: number | null;
	};
	donnee_intermediaire: {
		k: number;
	};
};

// ==================================================================================================
// Systèmes
// ==================================================================================================

export type Ventilation = {
	donnee_entree: {
		surface_ventile: number;
		description?: string | null;
		reference: string;
		plusieurs_facade_exposee: OuiNon;
		tv_q4pa_conv_id?: number | null;
		q4pa_conv_saisi?: number | null;
		enum_methode_saisie_q4pa_conv_id: enums.MethodeSaisieQ4paConvEnum;
		tv_debits_ventilation_id: number;
		enum_type_ventilation_id: enums.TypeVentilationEnum;
		ventilation_post_2012: OuiNon;
		ref_produit_ventilation?: string | null;
		cle_repartition_ventilation?: number | null;
	};
	donnee_intermediaire: {
		pvent_moy?: number | null;
		q4pa_conv: number;
		conso_auxiliaire_ventilation: number;
		hperm: number;
		hvent: number;
	};
};

export type Climatisation = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_clim: number;
		tv_seer_id?: number | null;
		nombre_logement_echantillon?: number | null;
		enum_methode_calcul_conso_id: enums.MethodeCalculConsoEnum;
		enum_periode_installation_fr_id: enums.PeriodeInstallationFrEnum;
		cle_repartition_clim?: number | null;
		enum_type_generateur_fr_id: enums.TypeGenerateurFrEnum;
		enum_type_energie_id?: enums.TypeEnergieEnum | null;
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum;
		ref_produit_fr?: string | null;
	};
	donnee_intermediaire: {
		eer: number;
		besoin_fr: number;
		conso_fr: number;
		conso_fr_depensier: number;
	};
};

export type InstallationEcs = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		enum_cfg_installation_ecs_id: enums.CfgInstallationEcsEnum;
		enum_type_installation_id: enums.TypeInstallationEnum;
		enum_methode_calcul_conso_id: enums.MethodeCalculConsoEnum;
		ratio_virtualisation?: number | null;
		cle_repartition_ecs?: number | null;
		surface_habitable: number;
		rdim: number;
		nombre_logement: number;
		nombre_niveau_installation_ecs: number;
		fecs_saisi?: number | null;
		tv_facteur_couverture_solaire_id?: number | null;
		enum_methode_saisie_fact_couv_sol_id?: enums.MethodeSaisieFactCouvSolEnum | null;
		enum_type_installation_solaire_id?: enums.TypeInstallationSolaireEnum | null;
		tv_rendement_distribution_ecs_id?: number | null;
		enum_bouclage_reseau_ecs_id?: enums.BouclageReseauEcsEnum | null;
		reseau_distribution_isole?: OuiNon | null;
	};
	donnee_intermediaire: {
		rendement_distribution: number;
		besoin_ecs: number;
		besoin_ecs_depensier: number;
		fecs: number;
		production_ecs_solaire?: number | null;
		conso_ecs: number;
		conso_ecs_depensier: number;
	};
	generateur_ecs_collection: Array<GenerateurEcs>;
};

export type GenerateurEcs = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_generateur_mixte?: string | null;
		enum_type_generateur_ecs_id: enums.TypeGenerateurEcsEnum;
		ref_produit_generateur_ecs?: string | null;
		enum_usage_generateur_id: enums.UsageGenerateurEnum;
		enum_type_energie_id: enums.TypeEnergieEnum;
		tv_generateur_combustion_id?: number | null;
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum;
		tv_pertes_stockage_id?: number | null;
		tv_scop_id?: number | null;
		enum_periode_installation_ecs_thermo_id?: enums.PeriodeInstallationEcsThermoEnum | null;
		identifiant_reseau_chaleur?: string | null;
		date_arrete_reseau_chaleur?: string | null;
		tv_reseau_chaleur_id?: number | null;
		enum_type_stockage_ecs_id?: enums.TypeStockageEcsEnum | null;
		position_volume_chauffe?: OuiNon | null;
		position_volume_chauffe_stockage?: OuiNon | null;
		volume_stockage?: number | null;
		presence_ventouse?: OuiNon | null;
	};
	donnee_intermediaire: {
		pn?: number | null;
		qp0?: number | null;
		pveilleuse?: number | null;
		rpn?: number | null;
		cop?: number | null;
		ratio_besoin_ecs?: number | null;
		rendement_generation?: number | null;
		rendement_generation_stockage?: number | null;
		conso_ecs: number;
		conso_ecs_depensier: number;
		rendement_stockage?: number | null;
	};
};

export type InstallationChauffage = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_chauffee: number;
		nombre_logement_echantillon?: number | null;
		rdim: number;
		nombre_niveau_installation_ch: number;
		enum_cfg_installation_ch_id: enums.CfgInstallationChEnum;
		ratio_virtualisation?: number | null;
		coef_ifc?: number | null;
		cle_repartition_ch?: number | null;
		enum_type_installation_id: enums.TypeInstallationEnum;
		enum_methode_calcul_conso_id: enums.MethodeCalculConsoEnum;
		enum_methode_saisie_fact_couv_sol_id?: enums.MethodeSaisieFactCouvSolEnum | null;
		tv_facteur_couverture_solaire_id?: number | null;
		fch_saisi?: number | null;
	};
	donnee_intermediaire: {
		besoin_ch: number;
		besoin_ch_depensier: number;
		production_ch_solaire?: number | null;
		fch?: number | null;
		conso_ch: number;
		conso_ch_depensier: number;
	};
	emetteur_chauffage_collection: Array<EmetteurChauffage>;
	generateur_chauffage_collection: Array<GenerateurChauffage>;
};

export type EmetteurChauffage = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_chauffee: number;
		tv_rendement_emission_id?: number | null;
		tv_rendement_distribution_ch_id?: number | null;
		tv_rendement_regulation_id?: number | null;
		enum_type_emission_distribution_id: enums.TypeEmissionDistributionEnum;
		tv_intermittence_id?: number | null;
		reseau_distribution_isole?: OuiNon | null;
		enum_equipement_intermittence_id?: enums.EquipementIntermittenceEnum | null;
		enum_type_regulation_id?: enums.TypeRegulationEnum | null;
		enum_periode_installation_emetteur_id?: enums.PeriodeInstallationEmetteurEnum | null;
		enum_type_chauffage_id: enums.TypeChauffageEnum;
		enum_temp_distribution_ch_id?: enums.TempDistributionChEnum | null;
		enum_lien_generateur_emetteur_id?: enums.LienGenerateurEmetteurEnum | null;
	};
	donnee_intermediaire: {
		i0: number;
		rendement_emission: number;
		rendement_distribution: number;
		rendement_regulation: number;
	};
};

export type GenerateurChauffage = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_generateur_mixte?: string | null;
		ref_produit_generateur_ch?: string | null;
		enum_type_generateur_ch_id: enums.TypeGenerateurChEnum;
		enum_usage_generateur_id: enums.UsageGenerateurEnum;
		enum_type_energie_id: enums.TypeEnergieEnum;
		position_volume_chauffe?: OuiNon | null;
		tv_rendement_generation_id?: number | null;
		tv_scop_id?: number | null;
		tv_temp_fonc_100_id?: number | null;
		tv_temp_fonc_30_id?: number | null;
		tv_generateur_combustion_id?: number | null;
		tv_reseau_chaleur_id?: number | null;
		identifiant_reseau_chaleur?: string | null;
		date_arrete_reseau_chaleur?: string | null;
		n_radiateurs_gaz?: number | null;
		priorite_generateur_cascade?: number | null;
		presence_ventouse?: OuiNon | null;
		presence_regulation_combustion?: OuiNon | null;
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum;
		enum_lien_generateur_emetteur_id?: enums.LienGenerateurEmetteurEnum | null;
	};
	donnee_intermediaire: {
		scop?: number | null;
		pn?: number | null;
		qp0?: number | null;
		pveilleuse?: number | null;
		temp_fonc_30?: number | null;
		temp_fonc_100?: number | null;
		rpn?: number | null;
		rpint?: number | null;
		rendement_generation?: number | null;
		conso_ch: number;
		conso_ch_depensier: number;
	};
};

export type ProductionElecEnr = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		presence_production_pv: OuiNon;
		enum_type_enr_id: enums.TypeEnrEnum;
	};
	donnee_intermediaire?: {
		taux_autoproduction?: number | null;
		production_pv: number;
		conso_elec_ac: number;
	} | null;
	panneaux_pv_collection: Array<PanneauxPv>;
};

export type PanneauxPv = {
	surface_totale_capteurs?: number | null;
	ratio_virtualisation?: number | null;
	nombre_module?: number | null;
	tv_coef_orientation_pv_id?: number | null;
	enum_orientation_pv_id?: enums.OrientationPvEnum | null;
	enum_inclinaison_pv_id?: enums.InclinaisonPvEnum | null;
};

// ==================================================================================================
// Sortie
// ==================================================================================================

export type Sortie = {
	deperdition: Deperdition;
	apport_et_besoin: ApportEtBesoin;
	ef_conso: EfConso;
	ep_conso: EpConso;
	emission_ges: EmissionGes;
	cout: Cout;
	production_electricite?: ProductionElectricite | null;
	sortie_par_energie_collection: Array<SortieParEnergie>;
	confort_ete: ConfortEte;
	qualite_isolation: QualiteIsolation;
};

export type Deperdition = {
	hvent: number;
	hperm: number;
	deperdition_renouvellement_air: number;
	deperdition_mur: number;
	deperdition_plancher_bas: number;
	deperdition_plancher_haut: number;
	deperdition_baie_vitree: number;
	deperdition_porte: number;
	deperdition_pont_thermique: number;
	deperdition_enveloppe: number;
};

export type ApportEtBesoin = {
	surface_sud_equivalente: number;
	apport_solaire_fr: number;
	apport_interne_fr: number;
	apport_solaire_ch: number;
	apport_interne_ch: number;
	fraction_apport_gratuit_ch: number;
	fraction_apport_gratuit_depensier_ch: number;
	pertes_distribution_ecs_recup: number;
	pertes_distribution_ecs_recup_depensier: number;
	pertes_stockage_ecs_recup: number;
	pertes_generateur_ch_recup: number;
	pertes_generateur_ch_recup_depensier: number;
	nadeq: number;
	v40_ecs_journalier: number;
	v40_ecs_journalier_depensier: number;
	besoin_ch: number;
	besoin_ch_depensier: number;
	besoin_ecs: number;
	besoin_ecs_depensier: number;
	besoin_fr: number;
	besoin_fr_depensier: number;
};

export type EfConso = {
	conso_ch: number;
	conso_ch_depensier: number;
	conso_ecs: number;
	conso_ecs_depensier: number;
	conso_eclairage: number;
	conso_auxiliaire_generation_ch: number;
	conso_auxiliaire_generation_ch_depensier: number;
	conso_auxiliaire_distribution_ch: number;
	conso_auxiliaire_generation_ecs: number;
	conso_auxiliaire_generation_ecs_depensier: number;
	conso_auxiliaire_distribution_ecs: number;
	conso_auxiliaire_distribution_fr: number;
	conso_auxiliaire_ventilation: number;
	conso_totale_auxiliaire: number;
	conso_fr: number;
	conso_fr_depensier: number;
	conso_5_usages: number;
	conso_5_usages_m2: number;
};

export type EpConso = {
	ep_conso_ch: number;
	ep_conso_ch_depensier: number;
	ep_conso_ecs: number;
	ep_conso_ecs_depensier: number;
	ep_conso_eclairage: number;
	ep_conso_auxiliaire_generation_ch: number;
	ep_conso_auxiliaire_generation_ch_depensier: number;
	ep_conso_auxiliaire_distribution_ch: number;
	ep_conso_auxiliaire_generation_ecs: number;
	ep_conso_auxiliaire_generation_ecs_depensier: number;
	ep_conso_auxiliaire_distribution_ecs: number;
	ep_conso_auxiliaire_distribution_fr: number;
	ep_conso_auxiliaire_ventilation: number;
	ep_conso_totale_auxiliaire: number;
	ep_conso_fr: number;
	ep_conso_fr_depensier: number;
	ep_conso_5_usages: number;
	ep_conso_5_usages_m2: number;
	classe_bilan_dpe: enums.ClasseEtiquetteEnum;
};

export type EmissionGes = {
	emission_ges_ch: number;
	emission_ges_ch_depensier: number;
	emission_ges_ecs: number;
	emission_ges_ecs_depensier: number;
	emission_ges_eclairage: number;
	emission_ges_auxiliaire_generation_ch: number;
	emission_ges_auxiliaire_generation_ch_depensier: number;
	emission_ges_auxiliaire_distribution_ch: number;
	emission_ges_auxiliaire_generation_ecs: number;
	emission_ges_auxiliaire_generation_ecs_depensier: number;
	emission_ges_auxiliaire_distribution_ecs: number;
	emission_ges_auxiliaire_distribution_fr: number;
	emission_ges_auxiliaire_ventilation: number;
	emission_ges_totale_auxiliaire: number;
	emission_ges_fr: number;
	emission_ges_fr_depensier: number;
	emission_ges_5_usages: number;
	emission_ges_5_usages_m2: number;
	classe_emission_ges: enums.ClasseEtiquetteEnum;
};

export type Cout = {
	cout_ch: number;
	cout_ch_depensier: number;
	cout_ecs: number;
	cout_ecs_depensier: number;
	cout_eclairage: number;
	cout_auxiliaire_generation_ch: number;
	cout_auxiliaire_generation_ch_depensier: number;
	cout_auxiliaire_distribution_ch: number;
	cout_auxiliaire_generation_ecs: number;
	cout_auxiliaire_generation_ecs_depensier: number;
	cout_auxiliaire_distribution_ecs: number;
	cout_auxiliaire_distribution_fr: number;
	cout_auxiliaire_ventilation: number;
	cout_total_auxiliaire: number;
	cout_fr: number;
	cout_fr_depensier: number;
	cout_5_usages: number;
};

export type ProductionElectricite = {
	production_pv: number;
	conso_elec_ac: number;
	conso_elec_ac_ch: number;
	conso_elec_ac_ecs: number;
	conso_elec_ac_fr: number;
	conso_elec_ac_eclairage: number;
	conso_elec_ac_auxiliaire: number;
	conso_elec_ac_autre_usage: number;
};

export type SortieParEnergie = {
	enum_type_energie_id: enums.TypeEnergieEnum;
	conso_ch: number;
	conso_ecs: number;
	conso_5_usages: number;
	emission_ges_ch: number;
	emission_ges_ecs: number;
	emission_ges_5_usages: number;
	cout_ch: number;
	cout_ecs: number;
	cout_5_usages: number;
};

export type ConfortEte = {
	isolation_toiture: OuiNon;
	protection_solaire_exterieure: OuiNon;
	aspect_traversant: OuiNon;
	brasseur_air: OuiNon;
	inertie_lourde: OuiNon;
	enum_indicateur_confort_ete_id: enums.IndicateurConfortEteEnum;
};

export type QualiteIsolation = {
	ubat: number;
	qualite_isol_enveloppe: enums.QualiteComposantEnum;
	qualite_isol_mur: enums.QualiteComposantEnum;
	qualite_isol_plancher_haut_toit_terrasse: enums.QualiteComposantEnum;
	qualite_isol_plancher_haut_comble_perdu: enums.QualiteComposantEnum;
	qualite_isol_plancher_haut_comble_amenage: enums.QualiteComposantEnum;
	qualite_isol_plancher_bas: enums.QualiteComposantEnum;
	qualite_isol_menuiserie: enums.QualiteComposantEnum;
};

// ==================================================================================================
// LogementNeuf
// ==================================================================================================

export type LogementNeuf = {
	caracteristique_generale: CaracteristiqueGenerale;
	meteo: Meteo;
	repartition_chauffage: RepartitionChauffage;
	repartition_ecs: RepartitionEcs;
	enveloppe: EnveloppeNeuf;
	ventilation_collection: Array<VentilationNeuf>;
	climatisation_collection: Array<ClimatisationNeuf>;
	installation_ecs_collection: Array<InstallationEcsNeuf>;
	installation_chauffage_collection: Array<InstallationChauffageNeuf>;
	production_elec_enr?: ProductionElecEnrNeuf | null;
	sortie: SortieNeuf;
};

export type RepartitionChauffage = {
	surface_baie_nord: number;
	surface_baie_sud: number;
	surface_baie_est_ouest: number;
	surface_paroi_verticale_ext: number;
	surface_plancher_haut: number;
	surface_plancher_bas: number;
	coef_ifc: number;
	deperdition_totale_logement: number;
	deperdition_totale_batiment: number;
	cle_repartition_ch: number;
};

export type RepartitionEcs = {
	besoin_ecs_batiment: number;
	besoin_ecs_logement: number;
	cle_repartition_ecs: number;
};

export type EnveloppeNeuf = {
	inertie: InertieNeuf;
	mur_collection: Array<MurNeuf>;
	plancher_bas_collection: Array<PlancherBasNeuf>;
	plancher_haut_collection: Array<PlancherHautNeuf>;
	baie_vitree_collection: Array<BaieVitreeNeuf>;
	porte_collection: Array<PorteNeuf>;
	pont_thermique_collection: Array<PontThermiqueNeuf>;
};

export type InertieNeuf = {
	enum_classe_inertie_id: enums.ClasseInertieEnum;
};

export type MurNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		enum_orientation_id: enums.OrientationEnum;
		surface_paroi_totale: number;
		surface_paroi_opaque: number;
		epaisseur_structure?: number | null;
		enum_materiaux_structure_mur_id?: enums.MateriauxStructureMurEnum | null;
		enduit_isolant_paroi_ancienne?: OuiNon | null;
		enum_type_doublage_id?: enums.TypeDoublageEnum | null;
		enum_type_isolation_id: enums.TypeIsolationEnum;
		resistance_isolation?: number | null;
		epaisseur_isolation?: number | null;
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum;
	};
	donnee_intermediaire: {
		b?: number | null;
		umur: number;
		umur0: number;
	};
};

export type PlancherBasNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_paroi_opaque: number;
		enum_type_plancher_bas_id: enums.TypePlancherBasEnum;
		enum_type_isolation_id: enums.TypeIsolationEnum;
		resistance_isolation?: number | null;
		epaisseur_isolation?: number | null;
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum;
	};
	donnee_intermediaire: {
		b?: number | null;
		upb_final: number;
		upb0: number;
	};
};

export type PlancherHautNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_paroi_opaque: number;
		enum_type_plancher_haut_id: enums.TypePlancherHautEnum;
		enum_type_isolation_id: enums.TypeIsolationEnum;
		resistance_isolation?: number | null;
		epaisseur_isolation?: number | null;
		enum_methode_saisie_u_id: enums.MethodeSaisieUEnum;
	};
	donnee_intermediaire: {
		b?: number | null;
		uph: number;
		uph0: number;
	};
};

export type BaieVitreeNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_paroi?: string | null;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_totale_baie: number;
		nb_baie: number;
		enum_type_vitrage_id: enums.TypeVitrageEnum;
		enum_inclinaison_vitrage_id: enums.InclinaisonVitrageEnum;
		enum_type_gaz_lame_id?: enums.TypeGazLameEnum | null;
		epaisseur_lame?: number | null;
		vitrage_vir?: OuiNon | null;
		enum_methode_saisie_perf_vitrage_id: enums.MethodeSaisiePerfVitrageEnum;
		enum_type_materiaux_menuiserie_id: enums.TypeMateriauxMenuiserieEnum;
		enum_type_baie_id: enums.TypeBaieEnum;
		enum_type_fermeture_id: enums.TypeFermetureEnum;
		presence_protection_solaire_hors_fermeture?: OuiNon | null;
		presence_retour_isolation?: OuiNon | null;
		presence_joint?: OuiNon | null;
		enum_type_pose_id: enums.TypePoseEnum;
		enum_orientation_id: enums.OrientationEnum;
	};
	donnee_intermediaire: {
		b?: number | null;
		ug: number;
		uw: number;
		ujn: number;
		u_menuiserie: number;
		sw: number;
	};
};

export type PorteNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_paroi?: string | null;
		enum_cfg_isolation_lnc_id?: enums.CfgIsolationLncEnum | null;
		enum_type_adjacence_id: enums.TypeAdjacenceEnum;
		surface_aiu?: number | null;
		surface_aue?: number | null;
		surface_porte: number;
		enum_methode_saisie_uporte_id: enums.MethodeSaisieUporteEnum;
		enum_type_porte_id: enums.TypePorteEnum;
		nb_porte: number;
		largeur_dormant?: number | null;
		presence_retour_isolation?: OuiNon | null;
		presence_joint?: OuiNon | null;
		enum_type_pose_id: enums.TypePoseEnum;
	};
	donnee_intermediaire: {
		uporte: number;
		b?: number | null;
	};
};

export type PontThermiqueNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		reference_1?: string | null;
		reference_2?: string | null;
		enum_methode_saisie_pont_thermique_id: enums.MethodeSaisiePontThermiqueEnum;
		l: number;
		enum_type_liaison_id: enums.TypeLiaisonEnum;
	};
	donnee_intermediaire: {
		k: number;
	};
};

export type VentilationNeuf = {
	donnee_entree: {
		surface_ventile: number;
		description?: string | null;
		reference: string;
		plusieurs_facade_exposee: OuiNon;
		enum_methode_saisie_q4pa_conv_id: enums.MethodeSaisieQ4paConvEnum;
		enum_type_ventilation_id: enums.TypeVentilationEnum;
		ventilation_post_2012: OuiNon;
		ref_produit_ventilation?: string | null;
	};
	donnee_intermediaire: {
		pvent_moy?: number | null;
		q4pa_conv: number;
		conso_auxiliaire_ventilation: number;
		hperm: number;
		hvent: number;
	};
};

export type ClimatisationNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_clim?: number | null;
		enum_type_generateur_fr_id: enums.TypeGenerateurFrEnum;
		enum_type_energie_id?: enums.TypeEnergieEnum | null;
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum;
		ref_produit_fr?: string | null;
	};
	donnee_intermediaire: {
		eer: number;
		besoin_fr: number;
		conso_fr: number;
	};
};

export type InstallationEcsNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		enum_cfg_installation_ecs_id: enums.CfgInstallationEcsEnum;
		enum_type_installation_id: enums.TypeInstallationEnum;
		surface_habitable?: number | null;
		rdim?: number | null;
		nombre_logement: number;
		enum_type_installation_solaire_id?: enums.TypeInstallationSolaireEnum | null;
		enum_bouclage_reseau_ecs_id?: enums.BouclageReseauEcsEnum | null;
		reseau_distribution_isole?: OuiNon | null;
	};
	donnee_intermediaire: {
		besoin_ecs: number;
		production_ecs_solaire?: number | null;
		conso_ecs: number;
	};
	generateur_ecs_collection: Array<GenerateurEcsNeuf>;
};

export type GenerateurEcsNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		enum_type_generateur_ecs_id: enums.TypeGenerateurEcsEnum;
		ref_produit_generateur_ecs?: string | null;
		enum_usage_generateur_id: enums.UsageGenerateurEnum;
		enum_type_energie_id: enums.TypeEnergieEnum;
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum;
		enum_type_stockage_ecs_id?: enums.TypeStockageEcsEnum | null;
		position_volume_chauffe?: OuiNon | null;
		position_volume_chauffe_stockage?: OuiNon | null;
		volume_stockage?: number | null;
		presence_ventouse?: OuiNon | null;
		identifiant_reseau_chaleur?: string | null;
		date_arrete_reseau_chaleur?: string | null;
	};
	donnee_intermediaire: {
		pn?: number | null;
		qp0?: number | null;
		pveilleuse?: number | null;
		rpn?: number | null;
		cop?: number | null;
		ratio_besoin_ecs?: number | null;
		conso_ecs: number;
	};
};

export type InstallationChauffageNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_chauffee?: number | null;
		rdim?: number | null;
		enum_cfg_installation_ch_id: enums.CfgInstallationChEnum;
		enum_type_installation_id: enums.TypeInstallationEnum;
	};
	donnee_intermediaire: {
		besoin_ch: number;
		conso_ch: number;
	};
	emetteur_chauffage_collection: Array<EmetteurChauffageNeuf>;
	generateur_chauffage_collection: Array<GenerateurChauffageNeuf>;
};

export type EmetteurChauffageNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		surface_chauffee: number;
		enum_type_emission_distribution_id: enums.TypeEmissionDistributionEnum;
		reseau_distribution_isole?: OuiNon | null;
		enum_periode_installation_emetteur_id?: enums.PeriodeInstallationEmetteurEnum | null;
		enum_temp_distribution_ch_id?: enums.TempDistributionChEnum | null;
	};
};

export type GenerateurChauffageNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		ref_produit_generateur_ch?: string | null;
		enum_type_generateur_ch_id: enums.TypeGenerateurChEnum;
		enum_usage_generateur_id: enums.UsageGenerateurEnum;
		enum_type_energie_id: enums.TypeEnergieEnum;
		position_volume_chauffe?: OuiNon | null;
		tv_reseau_chaleur_id?: number | null;
		identifiant_reseau_chaleur?: string | null;
		date_arrete_reseau_chaleur?: string | null;
		n_radiateurs_gaz?: number | null;
		presence_ventouse?: OuiNon | null;
		presence_regulation_combustion?: OuiNon | null;
		enum_methode_saisie_carac_sys_id: enums.MethodeSaisieCaracSysEnum;
	};
	donnee_intermediaire: {
		scop?: number | null;
		pn?: number | null;
		qp0?: number | null;
		pveilleuse?: number | null;
		temp_fonc_30?: number | null;
		temp_fonc_100?: number | null;
		rpn?: number | null;
		rpint?: number | null;
		conso_ch?: number | null;
	};
};

export type ProductionElecEnrNeuf = {
	donnee_entree: {
		description?: string | null;
		reference: string;
		presence_production_pv: OuiNon;
		enum_type_enr_id: enums.TypeEnrEnum;
	};
	donnee_intermediaire?: {
		taux_autoproduction?: number | null;
		production_pv: number;
		conso_elec_ac: number;
	} | null;
	panneaux_pv_collection: Array<PanneauxPvNeuf>;
};

export type PanneauxPvNeuf = {
	surface_totale_capteurs?: number | null;
	nombre_module?: number | null;
};

export type SortieNeuf = {
	deperdition: DeperditionNeuf;
	apport_et_besoin: ApportEtBesoinNeuf;
	ef_conso: EfConsoNeuf;
	ep_conso: EpConsoNeuf;
	emission_ges: EmissionGesNeuf;
	cout: CoutNeuf;
	production_electricite?: ProductionElectriciteNeuf | null;
	sortie_par_energie_collection: Array<SortieParEnergieNeuf>;
	confort_ete: ConfortEteNeuf;
	qualite_isolation: QualiteIsolationNeuf;
};

export type DeperditionNeuf = {
	hvent: number;
	hperm: number;
	deperdition_renouvellement_air: number;
	deperdition_mur: number;
	deperdition_plancher_bas: number;
	deperdition_plancher_haut: number;
	deperdition_baie_vitree: number;
	deperdition_porte: number;
	deperdition_pont_thermique: number;
	deperdition_enveloppe: number;
};

export type ApportEtBesoinNeuf = {
	besoin_ch: number;
	besoin_ecs: number;
	besoin_fr: number;
};

export type EfConsoNeuf = {
	conso_ch: number;
	conso_ch_depensier: number;
	conso_ecs: number;
	conso_ecs_depensier: number;
	conso_eclairage: number;
	conso_auxiliaire_ventilation: number;
	conso_totale_auxiliaire: number;
	conso_fr: number;
	conso_fr_depensier: number;
	conso_5_usages: number;
	conso_5_usages_m2: number;
};

export type EpConsoNeuf = {
	ep_conso_ch: number;
	ep_conso_ch_depensier: number;
	ep_conso_ecs: number;
	ep_conso_ecs_depensier: number;
	ep_conso_eclairage: number;
	ep_conso_auxiliaire_ventilation: number;
	ep_conso_totale_auxiliaire: number;
	ep_conso_fr: number;
	ep_conso_fr_depensier: number;
	ep_conso_5_usages: number;
	ep_conso_5_usages_m2: number;
	classe_bilan_dpe: enums.ClasseEtiquetteEnum;
};

export type EmissionGesNeuf = {
	emission_ges_ch: number;
	emission_ges_ch_depensier: number;
	emission_ges_ecs: number;
	emission_ges_ecs_depensier: number;
	emission_ges_eclairage: number;
	emission_ges_auxiliaire_ventilation: number;
	emission_ges_totale_auxiliaire: number;
	emission_ges_fr: number;
	emission_ges_fr_depensier: number;
	emission_ges_5_usages: number;
	emission_ges_5_usages_m2: number;
	classe_emission_ges: enums.ClasseEtiquetteEnum;
};

export type CoutNeuf = {
	cout_ch: number;
	cout_ch_depensier: number;
	cout_ecs: number;
	cout_ecs_depensier: number;
	cout_eclairage: number;
	cout_auxiliaire_ventilation: number;
	cout_total_auxiliaire: number;
	cout_fr: number;
	cout_fr_depensier: number;
	cout_5_usages: number;
};

export type ProductionElectriciteNeuf = {
	production_pv: number;
};

export type SortieParEnergieNeuf = {
	enum_type_energie_id: enums.TypeEnergieEnum;
	conso_ch: number;
	conso_ecs: number;
	conso_5_usages: number;
	emission_ges_ch: number;
	emission_ges_ecs: number;
	emission_ges_5_usages: number;
	cout_ch: number;
	cout_ecs: number;
	cout_5_usages: number;
};

export type ConfortEteNeuf = {
	isolation_toiture: OuiNon;
	protection_solaire_exterieure: OuiNon;
	aspect_traversant: OuiNon;
	brasseur_air: OuiNon;
	inertie_lourde: OuiNon;
	enum_indicateur_confort_ete_id: enums.IndicateurConfortEteEnum;
};

export type QualiteIsolationNeuf = {
	ubat: number;
	qualite_isol_enveloppe: enums.QualiteComposantEnum;
	qualite_isol_mur: enums.QualiteComposantEnum;
	qualite_isol_plancher_haut_toit_terrasse: enums.QualiteComposantEnum;
	qualite_isol_plancher_haut_comble_perdu: enums.QualiteComposantEnum;
	qualite_isol_plancher_haut_comble_amenage: enums.QualiteComposantEnum;
	qualite_isol_plancher_bas: enums.QualiteComposantEnum;
	qualite_isol_menuiserie: enums.QualiteComposantEnum;
};

// ==================================================================================================
// Tertiaire
// ==================================================================================================

export type Tertiaire = Record<string, unknown>;

// ==================================================================================================
// Collections et types auxiliaires
// ==================================================================================================

export type DPEImmeuble = {
	logement_visite_collection: Array<LogementVisite>;
};

export type LogementVisite = {
	description: string;
	enum_position_etage_logement_id: enums.PositionEtageLogementEnum;
	enum_typologie_logement_id: enums.TypologieLogementEnum;
	surface_habitable_logement: number;
};

export type DescriptifEnr = {
	description: string;
	enum_categorie_enr_descriptif_id: enums.CategorieEnrDescriptifEnum;
};

export type DescriptifSimplifie = {
	description: string;
	enum_categorie_descriptif_simplifie_id: enums.CategorieDescriptifSimplifieEnum;
};

export type FicheTechnique = {
	enum_categorie_fiche_technique_id: enums.CategorieFicheTechniqueEnum;
	sous_fiche_technique_collection: Array<SousFicheTechnique>;
};

export type SousFicheTechnique = {
	description: string;
	valeur: string;
	detail_origine_donnee?: string | null;
	enum_origine_donnee_id: enums.OrigineDonneeEnum;
};

export type Justificatif = {
	description: string;
	enum_type_justificatif_id: enums.TypeJustificatifEnum;
};

export type DescriptifGesteEntretien = {
	description: string;
	enum_picto_geste_entretien_id: enums.PictoGesteEntretienEnum;
	categorie_geste_entretien: string;
};

export type DescriptifTravaux = {
	pack_travaux_collection: Array<PackTravaux>;
	commentaire_travaux: string;
};

export type PackTravaux = {
	enum_num_pack_travaux_id: enums.NumPackTravauxEnum;
	conso_5_usages_apres_travaux?: number | null;
	emission_ges_5_usages_apres_travaux?: number | null;
	cout_pack_travaux_min?: number | null;
	cout_pack_travaux_max?: number | null;
	travaux_collection: Array<Travaux>;
};

export type Travaux = {
	description_travaux: string;
	enum_lot_travaux_id: enums.LotTravauxEnum;
	avertissement_travaux?: string | null;
	performance_recommande: string;
};
