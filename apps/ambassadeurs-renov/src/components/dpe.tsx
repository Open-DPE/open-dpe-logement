import * as models from "@open-dpe-logement/models";
import { ClasseClimat, ClasseEnergie, ConfortEte, Enum, PerformanceEnveloppe, Icon } from "./web";
import { DataCard } from "./data-card";
import { DataItem } from "./data-item";
import { Details } from "./details";
import { Consommations } from "./consommations";
import { Content } from "./content";
import { Deperditions } from "./deperditions";
import { Parois } from "./parois";
import { Equipements } from "./equipements";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
}

function boolval(value: boolean | null): string {
  if (value === true) return "Oui";
  if (value === false) return "Non";
  return "-";
}

export function Dpe({ data }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <DataCard title="Performance globale" dialog={<Content slug="performance-globale" />}>
        <DataItem>
          <span className="grow">Etiquette énergie</span>
          {["F", "G"].includes(data.data.etiquette_energie) && (
            <Icon name="passoire" size={42} />
          )}
          <ClasseEnergie className="p-1" value={data.data.etiquette_energie} size={28} />
        </DataItem>

        <DataItem>
          <span className="grow">Etiquette climat</span>
          <ClasseClimat className="p-1" value={data.data.etiquette_climat} size={28} />
        </DataItem>

        <DataItem>
          <span className="grow">Consommations d'énergie finale</span>
          <span className="font-medium">{Math.round(data.data.cef)}</span>
        </DataItem>

        <DataItem>
          <span className="grow">Consommations d'énergie primaire</span>
          <span className="font-medium">{Math.round(data.data.cep)}</span>
        </DataItem>

        <DataItem>
          <span className="grow">Emisssions de gaz à effet de serre</span>
          <span className="font-medium">{Math.round(data.data.eges)}</span>
        </DataItem>

        <Details>
          <ul className="list">
            <li>Consommations d'énergie finale en kWh/m².an</li>
            <li>Consommations d'énergie primaire en kWh/m².an</li>
            <li>Emisssions de gaz à effet de serre en kgCO₂/m².an</li>
          </ul>
        </Details>
      </DataCard>

      <DataCard title="Consommations" dialog={<Content slug="consommations" />}>
        <Consommations data={data.data.consommations} />

        <Details>
          <ul className="list">
            <li><b>CEF : </b>Consommations d'énergie finale en kWh/an</li>
            <li><b>CEP : </b>Consommations d'énergie primaire en kWh/an</li>
            <li><b>EGES : </b>Emissions de gaz à effet de serre en kgCO₂/an</li>
          </ul>
        </Details>
      </DataCard>

      <DataCard title="Performance de l'enveloppe" dialog={<Content slug="performance-enveloppe" />}>
        <DataItem>
          <span className="grow">Ubat</span>
          <PerformanceEnveloppe className="font-medium p-1" ubat={data.enveloppe.data.ubat} />
        </DataItem>

        <DataItem>
          <span className="grow">Confort été</span>
          <ConfortEte className="font-medium uppercase p-1" value={data.data.confort_ete} />
        </DataItem>

        <DataItem>
          <span className="grow">Déperditions thermiques</span>
          <span className="font-medium">{Math.round(data.enveloppe.data.gv)} W/K</span>
        </DataItem>

        <DataItem>
          <span className="grow">Inertie</span>
          <span className="font-medium"><Enum value={data.enveloppe.data.inertie} name="enveloppe:inertie" /></span>
        </DataItem>

        <DataItem>
          <span className="grow">Isolation des planchers hauts</span>
          <span className="font-medium">{boolval(data.enveloppe.data.isolation_planchers_hauts)}</span>
        </DataItem>

        <DataItem>
          <span className="grow">Logement traversant</span>
          <span className="font-medium">{boolval(data.enveloppe.data.logement_traversant)}</span>
        </DataItem>

        <DataItem>
          <span className="grow">Présence de protections solaires</span>
          <span className="font-medium">{boolval(data.enveloppe.data.presence_protection_solaire)}</span>
        </DataItem>

        <DataItem>
          <span className="grow">Présence de brasseurs d'air</span>
          <span className="font-medium">{boolval(data.enveloppe.presence_brasseurs_air)}</span>
        </DataItem>

        <Details>
          <ul className="list">
            <li><b>Ubat : </b>Coefficient de déperditions thermiques du bâtiment</li>
            <li><b>Déperditions : </b>Somme de l'ensemble des déperditions thermiques</li>
          </ul>
        </Details>
      </DataCard>

      <DataCard title="Répartition des déperditions" dialog={<Content slug="repartition-deperditions" />}>
        <Deperditions values={{
          dp_murs: data.enveloppe.data.dp_murs,
          dp_planchers_hauts: data.enveloppe.data.dp_planchers_hauts,
          dp_planchers_bas: data.enveloppe.data.dp_planchers_bas,
          dp_baies: data.enveloppe.data.dp_baies,
          dp_portes: data.enveloppe.data.dp_portes,
          dr: data.enveloppe.data.dr,
          pt: data.enveloppe.data.pt,
        }} />
      </DataCard>

      <DataCard title="Performance des parois" dialog={<Content slug="performance-parois" />}>
        <Parois data={data} />

        <Details>
          <ul className="list">
            <li><b>U : </b>Coefficient de transmission thermique en W/m².K</li>
            <li><b>SDEP : </b>Surface déperditive en m²</li>
            <li><b>DP : </b>Déperditions thermiques en W/K</li>
          </ul>
        </Details>
      </DataCard>

      <DataCard title="Équipements" dialog={<Content slug="performance-equipements" />}>
        <Equipements data={data} />
      </DataCard>
    </div>
  )
}
