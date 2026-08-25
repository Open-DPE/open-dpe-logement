import * as v2 from "./v2";
import * as v22 from "./v2.2";
import * as v23 from "./v2.3";
import * as v24 from "./v2.4";
import * as v25 from "./v2.5";
import * as v26 from "./v2.6";

export * as enums from "./enums";

export { v2, v22, v23, v24, v25, v26 };

export type DPE = v2.DPE | v22.DPE | v23.DPE | v24.DPE | v25.DPE | v26.DPE;

export type DPELogement =
	| v2.DPELogement
	| v22.DPELogement
	| v23.DPELogement
	| v24.DPELogement
	| v25.DPELogement
	| v26.DPELogement;

export type DPELogementNeuf =
	| v2.DPELogementNeuf
	| v22.DPELogementNeuf
	| v23.DPELogementNeuf
	| v24.DPELogementNeuf
	| v25.DPELogementNeuf
	| v26.DPELogementNeuf;

export type DPETertiaire =
	| v2.DPETertiaire
	| v22.DPETertiaire
	| v23.DPETertiaire
	| v24.DPETertiaire
	| v25.DPETertiaire
	| v26.DPETertiaire;

export type DPEImmeuble =
	| v2.DPEImmeuble
	| v22.DPEImmeuble
	| v23.DPEImmeuble
	| v24.DPEImmeuble
	| v25.DPEImmeuble
	| v26.DPEImmeuble;

export type Logement =
	| v2.Logement
	| v22.Logement
	| v23.Logement
	| v24.Logement
	| v25.Logement
	| v26.Logement;

export type CaracteristiqueGenerale =
	| v2.CaracteristiqueGenerale
	| v22.CaracteristiqueGenerale
	| v23.CaracteristiqueGenerale
	| v24.CaracteristiqueGenerale
	| v25.CaracteristiqueGenerale
	| v26.CaracteristiqueGenerale;

export type Meteo =
	| v2.Meteo
	| v22.Meteo
	| v23.Meteo
	| v24.Meteo
	| v25.Meteo
	| v26.Meteo;

export type Administratif =
	| v2.Administratif
	| v22.Administratif
	| v23.Administratif
	| v24.Administratif
	| v25.Administratif
	| v26.Administratif;

export type Geolocalisation =
	| v2.Geolocalisation
	| v22.Geolocalisation
	| v23.Geolocalisation
	| v24.Geolocalisation
	| v25.Geolocalisation
	| v26.Geolocalisation;

export type Diagnostiqueur =
	| v2.Diagnostiqueur
	| v22.Diagnostiqueur
	| v23.Diagnostiqueur
	| v24.Diagnostiqueur
	| v25.Diagnostiqueur
	| v26.Diagnostiqueur;

export type Adresse =
	| v2.Adresse
	| v22.Adresse
	| v23.Adresse
	| v24.Adresse
	| v25.Adresse
	| v26.Adresse;

export type Enveloppe =
	| v2.Enveloppe
	| v22.Enveloppe
	| v23.Enveloppe
	| v24.Enveloppe
	| v25.Enveloppe
	| v26.Enveloppe;

export type Inertie =
	| v2.Inertie
	| v22.Inertie
	| v23.Inertie
	| v24.Inertie
	| v25.Inertie
	| v26.Inertie;

export type Mur = v2.Mur | v22.Mur | v23.Mur | v24.Mur | v25.Mur | v26.Mur;

export type PlancherBas =
	| v2.PlancherBas
	| v22.PlancherBas
	| v23.PlancherBas
	| v24.PlancherBas
	| v25.PlancherBas
	| v26.PlancherBas;

export type PlancherHaut =
	| v2.PlancherHaut
	| v22.PlancherHaut
	| v23.PlancherHaut
	| v24.PlancherHaut
	| v25.PlancherHaut
	| v26.PlancherHaut;

export type BaieVitree =
	| v2.BaieVitree
	| v22.BaieVitree
	| v23.BaieVitree
	| v24.BaieVitree
	| v25.BaieVitree
	| v26.BaieVitree;

export type BaieVitreeDoubleFenetre =
	| v22.BaieVitreeDoubleFenetre
	| v23.BaieVitreeDoubleFenetre
	| v24.BaieVitreeDoubleFenetre
	| v25.BaieVitreeDoubleFenetre
	| v26.BaieVitreeDoubleFenetre;

export type MasqueLointainNonHomogene =
	| v2.MasqueLointainNonHomogene
	| v22.MasqueLointainNonHomogene
	| v23.MasqueLointainNonHomogene
	| v24.MasqueLointainNonHomogene
	| v25.MasqueLointainNonHomogene
	| v26.MasqueLointainNonHomogene;

export type Porte =
	| v2.Porte
	| v22.Porte
	| v23.Porte
	| v24.Porte
	| v25.Porte
	| v26.Porte;

export type Ets = v2.Ets | v22.Ets | v23.Ets | v24.Ets | v25.Ets | v26.Ets;

export type BaieEts =
	| v2.BaieEts
	| v22.BaieEts
	| v23.BaieEts
	| v24.BaieEts
	| v25.BaieEts
	| v26.BaieEts;

export type PontThermique =
	| v2.PontThermique
	| v22.PontThermique
	| v23.PontThermique
	| v24.PontThermique
	| v25.PontThermique
	| v26.PontThermique;

export type Ventilation =
	| v2.Ventilation
	| v22.Ventilation
	| v23.Ventilation
	| v24.Ventilation
	| v25.Ventilation
	| v26.Ventilation;

export type Climatisation =
	| v2.Climatisation
	| v22.Climatisation
	| v23.Climatisation
	| v24.Climatisation
	| v25.Climatisation
	| v26.Climatisation;

export type InstallationEcs =
	| v2.InstallationEcs
	| v22.InstallationEcs
	| v23.InstallationEcs
	| v24.InstallationEcs
	| v25.InstallationEcs
	| v26.InstallationEcs;

export type GenerateurEcs =
	| v2.GenerateurEcs
	| v22.GenerateurEcs
	| v23.GenerateurEcs
	| v24.GenerateurEcs
	| v25.GenerateurEcs
	| v26.GenerateurEcs;

export type InstallationChauffage =
	| v2.InstallationChauffage
	| v22.InstallationChauffage
	| v23.InstallationChauffage
	| v24.InstallationChauffage
	| v25.InstallationChauffage
	| v26.InstallationChauffage;

export type GenerateurChauffage =
	| v2.GenerateurChauffage
	| v22.GenerateurChauffage
	| v23.GenerateurChauffage
	| v24.GenerateurChauffage
	| v25.GenerateurChauffage
	| v26.GenerateurChauffage;

export type EmetteurChauffage =
	| v2.EmetteurChauffage
	| v22.EmetteurChauffage
	| v23.EmetteurChauffage
	| v24.EmetteurChauffage
	| v25.EmetteurChauffage
	| v26.EmetteurChauffage;

export type ProductionElecEnr =
	| v2.ProductionElecEnr
	| v22.ProductionElecEnr
	| v23.ProductionElecEnr
	| v24.ProductionElecEnr
	| v25.ProductionElecEnr
	| v26.ProductionElecEnr;

export type PanneauxPv =
	| v2.PanneauxPv
	| v22.PanneauxPv
	| v23.PanneauxPv
	| v24.PanneauxPv
	| v25.PanneauxPv
	| v26.PanneauxPv;

export type LogementVisite =
	| v2.LogementVisite
	| v22.LogementVisite
	| v23.LogementVisite
	| v24.LogementVisite
	| v25.LogementVisite
	| v26.LogementVisite;
