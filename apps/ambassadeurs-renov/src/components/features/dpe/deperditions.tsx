import { useState } from "react";
import * as models from "@open-dpe-logement/models";
import { Content } from "@/components/content";
import { RepartitionDeperditions } from "@/components/web-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { objectToHundred } from "./utils";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
}

export function Deperditions({ data }: Props) {
  const [showPercent, setShowPercent] = useState(false);

  const values = {
    dp_murs: data.enveloppe.data.dp_murs,
    dp_planchers_hauts: data.enveloppe.data.dp_planchers_hauts,
    dp_planchers_bas: data.enveloppe.data.dp_planchers_bas,
    dp_baies: data.enveloppe.data.dp_baies,
    dp_portes: data.enveloppe.data.dp_portes,
    dr: data.enveloppe.data.dr,
    pt: data.enveloppe.data.pt,
  };

  const percentValues = objectToHundred(values);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md text-center relative">
          Répartition des déperditions
          <div className="absolute -top-2 right-0">
            <Content slug="repartition-deperditions" />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-end gap-2 my-4">
          <Switch
            id="toggle-unit"
            checked={showPercent}
            onCheckedChange={setShowPercent}
          />
          <Label htmlFor="toggle-unit">Pourcentage</Label>
        </div>

        <div className="max-w-[360px] m-auto">
          <RepartitionDeperditions
            size={800}
            percent={showPercent}
            dp-murs={showPercent ? percentValues.dp_murs : values.dp_murs}
            dp-planchers-bas={showPercent ? percentValues.dp_planchers_bas : values.dp_planchers_bas}
            dp-planchers-hauts={showPercent ? percentValues.dp_planchers_hauts : values.dp_planchers_hauts}
            dp-baies={showPercent ? percentValues.dp_baies : values.dp_baies}
            dp-portes={showPercent ? percentValues.dp_portes : values.dp_portes}
            dr={showPercent ? percentValues.dr : values.dr}
            pt={showPercent ? percentValues.pt : values.pt}
          />
        </div>
      </CardContent>
    </Card>
  )
}
