import * as z from "zod";
import * as v20 from "./v2.0";
import * as v21 from "./v2.1";
import * as v22 from "./v2.2";
import * as v23 from "./v2.3";
import * as v24 from "./v2.4";
import * as v25 from "./v2.5";

export * as enums from "./enums";

export { v20, v21, v22, v23, v24, v25 };

export const Audit = z.union([
	v20.Audit,
	v21.Audit,
	v22.Audit,
	v23.Audit,
	v24.Audit,
	v25.Audit,
]);

export type Audit = z.infer<typeof Audit>;

export type Adresse =
	| v20.Adresse
	| v21.Adresse
	| v22.Adresse
	| v23.Adresse
	| v24.Adresse
	| v25.Adresse;

export type Geolocalisation =
	| v20.Geolocalisation
	| v21.Geolocalisation
	| v22.Geolocalisation
	| v23.Geolocalisation
	| v24.Geolocalisation
	| v25.Geolocalisation;

export type Administratif =
	| v20.Administratif
	| v21.Administratif
	| v22.Administratif
	| v23.Administratif
	| v24.Administratif
	| v25.Administratif;

export type LogementVisite =
	| v20.LogementVisite
	| v21.LogementVisite
	| v22.LogementVisite
	| v23.LogementVisite
	| v24.LogementVisite
	| v25.LogementVisite;

export type DpeImmeuble =
	| v20.DpeImmeuble
	| v21.DpeImmeuble
	| v22.DpeImmeuble
	| v23.DpeImmeuble
	| v24.DpeImmeuble
	| v25.DpeImmeuble;

export type DescriptionDuBien =
	| v20.DescriptionDuBien
	| v21.DescriptionDuBien
	| v22.DescriptionDuBien
	| v23.DescriptionDuBien
	| v24.DescriptionDuBien
	| v25.DescriptionDuBien;

export type DescriptifEnveloppe =
	| v20.DescriptifEnveloppe
	| v21.DescriptifEnveloppe
	| v22.DescriptifEnveloppe
	| v23.DescriptifEnveloppe
	| v24.DescriptifEnveloppe
	| v25.DescriptifEnveloppe;

export type DescriptifEquipements =
	| v20.DescriptifEquipements
	| v21.DescriptifEquipements
	| v22.DescriptifEquipements
	| v23.DescriptifEquipements
	| v24.DescriptifEquipements
	| v25.DescriptifEquipements;

export type VueEnsembleLogement =
	| v20.VueEnsembleLogement
	| v21.VueEnsembleLogement
	| v22.VueEnsembleLogement
	| v23.VueEnsembleLogement
	| v24.VueEnsembleLogement
	| v25.VueEnsembleLogement;

export type PathologieCaracteristique =
	| v20.PathologieCaracteristique
	| v21.PathologieCaracteristique
	| v22.PathologieCaracteristique
	| v23.PathologieCaracteristique
	| v24.PathologieCaracteristique
	| v25.PathologieCaracteristique;

export type RecommandationScenario =
	| v20.RecommandationScenario
	| v21.RecommandationScenario
	| v22.RecommandationScenario
	| v23.RecommandationScenario
	| v24.RecommandationScenario
	| v25.RecommandationScenario;

export type ExpertiseAuditeur =
	| v20.ExpertiseAuditeur
	| v21.ExpertiseAuditeur
	| v22.ExpertiseAuditeur
	| v23.ExpertiseAuditeur
	| v24.ExpertiseAuditeur
	| v25.ExpertiseAuditeur;

export type SousFicheTechnique =
	| v20.SousFicheTechnique
	| v21.SousFicheTechnique
	| v22.SousFicheTechnique
	| v23.SousFicheTechnique
	| v24.SousFicheTechnique
	| v25.SousFicheTechnique;

export type FicheTechnique =
	| v20.FicheTechnique
	| v21.FicheTechnique
	| v22.FicheTechnique
	| v23.FicheTechnique
	| v24.FicheTechnique
	| v25.FicheTechnique;

export type JustificatifAudit =
	| v20.JustificatifAudit
	| v21.JustificatifAudit
	| v22.JustificatifAudit
	| v23.JustificatifAudit
	| v24.JustificatifAudit
	| v25.JustificatifAudit;

export type PontThermique =
	| v20.PontThermique
	| v21.PontThermique
	| v22.PontThermique
	| v23.PontThermique
	| v24.PontThermique
	| v25.PontThermique;

export type BaieEts =
	| v20.BaieEts
	| v21.BaieEts
	| v22.BaieEts
	| v23.BaieEts
	| v24.BaieEts
	| v25.BaieEts;

export type Ets = v20.Ets | v21.Ets | v22.Ets | v23.Ets | v24.Ets | v25.Ets;

export type Porte =
	| v20.Porte
	| v21.Porte
	| v22.Porte
	| v23.Porte
	| v24.Porte
	| v25.Porte;

export type MasqueLointainNonHomogene =
	| v20.MasqueLointainNonHomogene
	| v21.MasqueLointainNonHomogene
	| v22.MasqueLointainNonHomogene
	| v23.MasqueLointainNonHomogene
	| v24.MasqueLointainNonHomogene
	| v25.MasqueLointainNonHomogene;

export type BaieVitreeDoubleFenetre =
	| v20.BaieVitreeDoubleFenetre
	| v21.BaieVitreeDoubleFenetre
	| v22.BaieVitreeDoubleFenetre
	| v23.BaieVitreeDoubleFenetre
	| v24.BaieVitreeDoubleFenetre
	| v25.BaieVitreeDoubleFenetre;

export type BaieVitree =
	| v20.BaieVitree
	| v21.BaieVitree
	| v22.BaieVitree
	| v23.BaieVitree
	| v24.BaieVitree
	| v25.BaieVitree;

export type PlancherHaut =
	| v20.PlancherHaut
	| v21.PlancherHaut
	| v22.PlancherHaut
	| v23.PlancherHaut
	| v24.PlancherHaut
	| v25.PlancherHaut;

export type PlancherBas =
	| v20.PlancherBas
	| v21.PlancherBas
	| v22.PlancherBas
	| v23.PlancherBas
	| v24.PlancherBas
	| v25.PlancherBas;

export type Mur = v20.Mur | v21.Mur | v22.Mur | v23.Mur | v24.Mur | v25.Mur;

export type Inertie =
	| v20.Inertie
	| v21.Inertie
	| v22.Inertie
	| v23.Inertie
	| v24.Inertie
	| v25.Inertie;

export type Enveloppe =
	| v20.Enveloppe
	| v21.Enveloppe
	| v22.Enveloppe
	| v23.Enveloppe
	| v24.Enveloppe
	| v25.Enveloppe;

export type Ventilation =
	| v20.Ventilation
	| v21.Ventilation
	| v22.Ventilation
	| v23.Ventilation
	| v24.Ventilation
	| v25.Ventilation;

export type Climatisation =
	| v20.Climatisation
	| v21.Climatisation
	| v22.Climatisation
	| v23.Climatisation
	| v24.Climatisation
	| v25.Climatisation;

export type PanneauxPv =
	| v20.PanneauxPv
	| v21.PanneauxPv
	| v22.PanneauxPv
	| v23.PanneauxPv
	| v24.PanneauxPv
	| v25.PanneauxPv;

export type ProductionElecEnr =
	| v20.ProductionElecEnr
	| v21.ProductionElecEnr
	| v22.ProductionElecEnr
	| v23.ProductionElecEnr
	| v24.ProductionElecEnr
	| v25.ProductionElecEnr;

export type GenerateurEcs =
	| v20.GenerateurEcs
	| v21.GenerateurEcs
	| v22.GenerateurEcs
	| v23.GenerateurEcs
	| v24.GenerateurEcs
	| v25.GenerateurEcs;

export type InstallationEcs =
	| v20.InstallationEcs
	| v21.InstallationEcs
	| v22.InstallationEcs
	| v23.InstallationEcs
	| v24.InstallationEcs
	| v25.InstallationEcs;

export type EmetteurChauffage =
	| v20.EmetteurChauffage
	| v21.EmetteurChauffage
	| v22.EmetteurChauffage
	| v23.EmetteurChauffage
	| v24.EmetteurChauffage
	| v25.EmetteurChauffage;

export type GenerateurChauffage =
	| v20.GenerateurChauffage
	| v21.GenerateurChauffage
	| v22.GenerateurChauffage
	| v23.GenerateurChauffage
	| v24.GenerateurChauffage
	| v25.GenerateurChauffage;

export type InstallationChauffage =
	| v20.InstallationChauffage
	| v21.InstallationChauffage
	| v22.InstallationChauffage
	| v23.InstallationChauffage
	| v24.InstallationChauffage
	| v25.InstallationChauffage;

export type Deperdition =
	| v20.Deperdition
	| v21.Deperdition
	| v22.Deperdition
	| v23.Deperdition
	| v24.Deperdition
	| v25.Deperdition;

export type ApportEtBesoin =
	| v20.ApportEtBesoin
	| v21.ApportEtBesoin
	| v22.ApportEtBesoin
	| v23.ApportEtBesoin
	| v24.ApportEtBesoin
	| v25.ApportEtBesoin;

export type EfConso =
	| v20.EfConso
	| v21.EfConso
	| v22.EfConso
	| v23.EfConso
	| v24.EfConso
	| v25.EfConso;

export type EpConso =
	| v20.EpConso
	| v21.EpConso
	| v22.EpConso
	| v23.EpConso
	| v24.EpConso
	| v25.EpConso;

export type EmissionGes =
	| v20.EmissionGes
	| v21.EmissionGes
	| v22.EmissionGes
	| v23.EmissionGes
	| v24.EmissionGes
	| v25.EmissionGes;

export type Cout =
	| v20.Cout
	| v21.Cout
	| v22.Cout
	| v23.Cout
	| v24.Cout
	| v25.Cout;

export type ProductionElectricite =
	| v20.ProductionElectricite
	| v21.ProductionElectricite
	| v22.ProductionElectricite
	| v23.ProductionElectricite
	| v24.ProductionElectricite
	| v25.ProductionElectricite;

export type SortieParEnergie =
	| v20.SortieParEnergie
	| v21.SortieParEnergie
	| v22.SortieParEnergie
	| v23.SortieParEnergie
	| v24.SortieParEnergie
	| v25.SortieParEnergie;

export type ConfortEte =
	| v20.ConfortEte
	| v21.ConfortEte
	| v22.ConfortEte
	| v23.ConfortEte
	| v24.ConfortEte
	| v25.ConfortEte;

export type QualiteIsolation =
	| v20.QualiteIsolation
	| v21.QualiteIsolation
	| v22.QualiteIsolation
	| v23.QualiteIsolation
	| v24.QualiteIsolation
	| v25.QualiteIsolation;

export type Sortie =
	| v20.Sortie
	| v21.Sortie
	| v22.Sortie
	| v23.Sortie
	| v24.Sortie
	| v25.Sortie;

export type Meteo =
	| v20.Meteo
	| v21.Meteo
	| v22.Meteo
	| v23.Meteo
	| v24.Meteo
	| v25.Meteo;

export type CaracteristiqueGenerale =
	| v20.CaracteristiqueGenerale
	| v21.CaracteristiqueGenerale
	| v22.CaracteristiqueGenerale
	| v23.CaracteristiqueGenerale
	| v24.CaracteristiqueGenerale
	| v25.CaracteristiqueGenerale;

export type DescriptionTravaux =
	| v20.DescriptionTravaux
	| v21.DescriptionTravaux
	| v22.DescriptionTravaux
	| v23.DescriptionTravaux
	| v24.DescriptionTravaux
	| v25.DescriptionTravaux;

export type Travaux =
	| v20.Travaux
	| v21.Travaux
	| v22.Travaux
	| v23.Travaux
	| v24.Travaux
	| v25.Travaux;

export type TravauxInduits =
	| v20.TravauxInduits
	| v21.TravauxInduits
	| v22.TravauxInduits
	| v23.TravauxInduits
	| v24.TravauxInduits
	| v25.TravauxInduits;

export type TravauxResume =
	| v20.TravauxResume
	| v21.TravauxResume
	| v22.TravauxResume
	| v23.TravauxResume
	| v24.TravauxResume
	| v25.TravauxResume;

export type EtapeTravaux =
	| v20.EtapeTravaux
	| v21.EtapeTravaux
	| v22.EtapeTravaux
	| v23.EtapeTravaux
	| v24.EtapeTravaux
	| v25.EtapeTravaux;

export type Logement =
	| v20.Logement
	| v21.Logement
	| v22.Logement
	| v23.Logement
	| v24.Logement
	| v25.Logement;

export type CaracteristiquesTravaux =
	| v21.CaracteristiquesTravaux
	| v22.CaracteristiquesTravaux
	| v23.CaracteristiquesTravaux
	| v24.CaracteristiquesTravaux
	| v25.CaracteristiquesTravaux;
