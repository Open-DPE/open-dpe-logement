import * as models from "@open-dpe-logement/models";
import { useState } from "react";
import { Content } from "@/components/content";
import { PerformanceEnveloppe, PerformanceMur, PerformanceMenuiserie, PerformancePlancherBas, PerformancePlancherHaut } from "@/components/web-components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Legende } from "./legende";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
}

export function Parois({ data }: Props) {
  const [showPercent, setShowPercent] = useState(false);

  const formatValue = (value: number, total: number) => {
    if (showPercent) {
      return total > 0 ? `${Math.round((value / total) * 100)} %` : "0 %";
    }
    return Math.round(value).toLocaleString("fr-FR");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md text-center relative">
          Performance des parois
          <div className="absolute -top-2 right-0">
            <Content slug="performance-parois" />
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

        <ScrollArea>
          <table className="table text-center">
            <thead>
              <tr>
                <th>Description</th>
                <th>U</th>
                <th>SDEP</th>
                <th>DP</th>
              </tr>
            </thead>

            <tbody>
              {data.enveloppe.murs.map((item: models.enveloppe.mur.MurWithData) => (
                <tr key={item.id}>
                  <td className="w-full">{item.description}</td>
                  <td><PerformanceMur className="font-medium p-1 min-w-[40px]" u={item.data.u} /></td>
                  <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
                  <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
                </tr>
              ))}
              {data.enveloppe.planchers_bas.map((item: models.enveloppe.plancherBas.PlancherBasWithData) => (
                <tr key={item.id}>
                  <td className="w-full">{item.description}</td>
                  <td><PerformancePlancherBas className="font-medium p-1 min-w-[40px]" u={item.data.u} /></td>
                  <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
                  <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
                </tr>
              ))}
              {data.enveloppe.planchers_hauts.map((item: models.enveloppe.plancherHaut.PlancherHautWithData) => (
                <tr key={item.id}>
                  <td className="w-full">{item.description}</td>
                  <td><PerformancePlancherHaut className="font-medium p-1 min-w-[40px]" configuration={item.configuration} u={item.data.u} /></td>
                  <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
                  <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
                </tr>
              ))}
              {data.enveloppe.baies.map((item: models.enveloppe.baie.BaieWithData) => (
                <tr key={item.id}>
                  <td className="w-full">{item.description}</td>
                  <td><PerformanceMenuiserie className="font-medium p-1 min-w-[40px]" u={item.data.u} /></td>
                  <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
                  <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
                </tr>
              ))}
              {data.enveloppe.portes.map((item: models.enveloppe.porte.PorteWithData) => (
                <tr key={item.id}>
                  <td className="w-full">{item.description}</td>
                  <td><PerformanceMenuiserie className="font-medium p-1 min-w-[40px]" u={item.data.u} /></td>
                  <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
                  <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td><PerformanceEnveloppe className="font-medium p-1 min-w-[40px]" ubat={data.enveloppe.data.ubat} /></td>
                <td>{showPercent ? "100 %" : Math.trunc(data.enveloppe.data.sdep).toLocaleString("fr-FR")}</td>
                <td>{showPercent ? "100 %" : Math.trunc(data.enveloppe.data.dp).toLocaleString("fr-FR")}</td>
              </tr>
            </tfoot>
          </table>

          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <Legende>
          <ul className="list">
            <li><b>U : </b>Coefficient de transmission thermique en W/m².K</li>
            <li><b>SDEP : </b>Surface déperditive en m²</li>
            <li><b>DP : </b>Déperditions thermiques en W/K</li>
          </ul>
        </Legende>
      </CardContent>
    </Card>
  )
}
