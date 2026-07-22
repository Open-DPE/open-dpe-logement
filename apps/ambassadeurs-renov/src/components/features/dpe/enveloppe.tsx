import * as models from "@open-dpe-logement/models";
import { Content } from "@/components/content";
import { ConfortEte, Enum, PerformanceEnveloppe } from "@/components/web-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Legende } from "./legende";
import { boolval } from "./utils";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
}

export function Enveloppe({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md text-center relative">
          Performance de l'enveloppe
          <div className="absolute -top-2 right-0">
            <Content slug="performance-enveloppe" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Ubat</span>
          <PerformanceEnveloppe className="font-medium p-1" ubat={data.enveloppe.data.ubat} />
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Confort été</span>
          <ConfortEte className="font-medium uppercase p-1" value={data.data.confort_ete} />
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Déperditions thermiques</span>
          <span className="font-medium">{Math.round(data.enveloppe.data.gv)} W/K</span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Inertie</span>
          <span className="font-medium"><Enum value={data.enveloppe.data.inertie} name="enveloppe:inertie" /></span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Isolation des planchers hauts</span>
          <span className="font-medium">{boolval(data.enveloppe.data.isolation_planchers_hauts)}</span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Logement traversant</span>
          <span className="font-medium">{boolval(data.enveloppe.data.logement_traversant)}</span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Présence de protections solaires</span>
          <span className="font-medium">{boolval(data.enveloppe.data.presence_protection_solaire)}</span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Présence de brasseurs d'air</span>
          <span className="font-medium">{boolval(data.enveloppe.presence_brasseurs_air)}</span>
        </div>

        <Legende>
          <ul className="list">
            <li><b>Ubat : </b>Coefficient de déperditions thermiques du bâtiment</li>
            <li><b>Déperditions : </b>Somme de l'ensemble des déperditions thermiques</li>
          </ul>
        </Legende>
      </CardContent>
    </Card>
  )
}
