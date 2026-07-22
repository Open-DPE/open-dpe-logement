import * as models from "@open-dpe-logement/models";
import { Content } from "@/components/content";
import { ClasseClimat, ClasseEnergie, Icon } from "@/components/web-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Legende } from "./legende";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
}

export function Performance({ data }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md text-center relative">
          Performance globale
          <div className="absolute -top-2 right-0">
            <Content slug="performance-globale" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Etiquette énergie</span>
          {["F", "G"].includes(data.data.etiquette_energie) && (
            <Icon name="passoire" size={42} />
          )}
          <ClasseEnergie className="p-1" value={data.data.etiquette_energie} size={24} />
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Etiquette climat</span>
          <ClasseClimat className="p-1" value={data.data.etiquette_climat} size={24} />
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Consommations d'énergie finale</span>
          <span className="font-medium">{Math.round(data.data.cef)}</span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Consommations d'énergie primaire</span>
          <span className="font-medium">{Math.round(data.data.cep)}</span>
        </div>

        <div className="flex items-center gap-2 h-[40px]">
          <span className="grow">Emisssions de gaz à effet de serre</span>
          <span className="font-medium">{Math.round(data.data.eges)}</span>
        </div>

        <Legende>
          <ul className="list">
            <li>Consommations d'énergie finale en kWh/m².an</li>
            <li>Consommations d'énergie primaire en kWh/m².an</li>
            <li>Emisssions de gaz à effet de serre en kgCO₂/m².an</li>
          </ul>
        </Legende>
      </CardContent>
    </Card>
  )
}
