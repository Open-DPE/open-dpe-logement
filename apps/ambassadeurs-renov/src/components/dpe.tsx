import * as models from "@open-dpe-logement/models";
import { ClasseClimat, ClasseEnergie, ConfortEte, Enum, PerformanceEnveloppe, RepartitionDeperditions, IconPassoire } from "./web";
import { DataCard } from "./data-card";
import { DataItem } from "./data-item";
import { Details } from "./details";
import { Consommations } from "./consommations";
import { PerformanceParois } from "./performance-parois";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
}

function toEnum(value: boolean | null): string {
  if (value === true) return "Oui";
  if (value === false) return "Non";
  return "-";
}

export function Dpe({ data }: Props) {
  return (
    <div className="flex flex-col gap-4">
      <DataCard title="Performance globale">
        <DataItem title="Etiquette climat">
          <ClasseClimat value={data.data.etiquette_climat} size={28} />
        </DataItem>

        <DataItem title="Etiquette énergie">
          <ClasseEnergie value={data.data.etiquette_energie} size={28} />
          {["F", "G"].includes(data.data.etiquette_energie) && (
            <IconPassoire size={28} />
          )}
        </DataItem>

        <DataItem title="Consommations d'énergie finale">
          <span className="font-medium">{Math.round(data.data.cef)} kWh/m².an</span>
        </DataItem>

        <DataItem title="Consommations d'énergie primaire">
          <span className="font-medium">{Math.round(data.data.cep)} kWh/m².an</span>
        </DataItem>

        <DataItem title="Emisssions de gaz à effet de serre">
          <span className="font-medium">{Math.round(data.data.eges)} kgCO₂/m².an</span>
        </DataItem>
      </DataCard>

      <DataCard title="Consommations">
        <Consommations data={data.data.consommations} />

        <Details>
          <ul className="list">
            <li><b>CEF : </b>Consommations d'énergie finale en kWh/an</li>
            <li><b>CEP : </b>Consommations d'énergie primaire en kWh/an</li>
            <li><b>EGES : </b>Emissions de gaz à effet de serre en kgCO₂/an</li>
          </ul>
        </Details>
      </DataCard>

      <DataCard title="Performance de l'enveloppe">
        <DataItem title="Ubat">
          <PerformanceEnveloppe className="font-medium" ubat={data.enveloppe.data.ubat} />
        </DataItem>

        <DataItem title="Confort été">
          <ConfortEte className="font-medium uppercase" value={data.data.confort_ete} />
        </DataItem>

        <DataItem title="Déperditions thermiques">
          <span className="font-medium">{Math.round(data.enveloppe.data.gv)} W/K</span>
        </DataItem>

        <DataItem title="Inertie" className="font-medium">
          <Enum value={data.enveloppe.data.inertie} data-key="enveloppe:inertie" />
        </DataItem>

        <DataItem title="Isolation des planchers hauts" className="font-medium">
          {toEnum(data.enveloppe.data.isolation_planchers_hauts)}
        </DataItem>

        <DataItem title="Logement traversant" className="font-medium">
          {toEnum(data.enveloppe.data.logement_traversant)}
        </DataItem>

        <DataItem title="Présence de protections solaires" className="font-medium">
          {toEnum(data.enveloppe.data.presence_protection_solaire)}
        </DataItem>

        <DataItem title="Présence de brasseurs d'air" className="font-medium">
          {toEnum(data.enveloppe.presence_brasseurs_air)}
        </DataItem>

        <Details>
          <ul className="list">
            <li><b>Ubat : </b>Coefficient de déperditions thermiques du bâtiment</li>
            <li><b>Déperditions : </b>Somme de l'ensemble des déperditions thermiques</li>
          </ul>
        </Details>
      </DataCard>

      <DataCard title="Répartition des déperditions">
        <RepartitionDeperditions
          className="block w-fit m-auto"
          dp_murs={data.enveloppe.data.dp_murs}
          dp_planchers_bas={data.enveloppe.data.dp_planchers_bas}
          dp_planchers_hauts={data.enveloppe.data.dp_planchers_hauts}
          dp_baies={data.enveloppe.data.dp_baies}
          dp_portes={data.enveloppe.data.dp_portes}
          pt={data.enveloppe.data.pt}
          dr={data.enveloppe.data.dr}
        />
      </DataCard>

      <DataCard title="Performance des parois">
        <PerformanceParois data={data} />

        <Details>
          <ul className="list">
            <li><b>U : </b>Coefficient de transmission thermique en W/m².K</li>
            <li><b>SDEP : </b>Surface déperditive en m²</li>
            <li><b>DP : </b>Déperditions thermiques en W/K</li>
          </ul>
        </Details>
      </DataCard>
    </div>
  )
}
