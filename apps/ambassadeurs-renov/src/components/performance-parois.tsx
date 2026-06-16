import * as models from "@open-dpe-logement/models";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PerformanceEnveloppe, PerformanceMur, PerformanceMenuiserie, PerformancePlancherBas, PerformancePlancherHaut } from "./web";

interface Props {
  data: models.diagnostic.DiagnosticWithData;
  className?: string;
}

export function PerformanceParois({ data, className = "" }: Props) {
  const [showPercent, setShowPercent] = useState(false);

  const formatValue = (value: number, total: number) => {
    if (showPercent) {
      return total > 0 ? `${Math.round((value / total) * 100)} %` : "0 %";
    }
    return Math.round(value).toLocaleString("fr-FR");
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-end gap-2 my-4">
        <Switch
          id="toggle-unit"
          checked={showPercent}
          onCheckedChange={setShowPercent}
        />
        <Label htmlFor="toggle-unit">Pourcentage</Label>
      </div>

      <table className="table scrollbar-x-none xl:overflow-x-auto text-center">
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
              <td><PerformanceMur u={item.data.u} /></td>
              <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
              <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
            </tr>
          ))}
          {data.enveloppe.planchers_bas.map((item: models.enveloppe.plancherBas.PlancherBasWithData) => (
            <tr key={item.id}>
              <td className="w-full">{item.description}</td>
              <td><PerformancePlancherBas u={item.data.u} /></td>
              <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
              <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
            </tr>
          ))}
          {data.enveloppe.planchers_hauts.map((item: models.enveloppe.plancherHaut.PlancherHautWithData) => (
            <tr key={item.id}>
              <td className="w-full">{item.description}</td>
              <td><PerformancePlancherHaut configuration={item.configuration} u={item.data.u} /></td>
              <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
              <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
            </tr>
          ))}
          {data.enveloppe.baies.map((item: models.enveloppe.baie.BaieWithData) => (
            <tr key={item.id}>
              <td className="w-full">{item.description}</td>
              <td><PerformanceMenuiserie u={item.data.u} /></td>
              <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
              <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
            </tr>
          ))}
          {data.enveloppe.portes.map((item: models.enveloppe.porte.PorteWithData) => (
            <tr key={item.id}>
              <td className="w-full">{item.description}</td>
              <td><PerformanceMenuiserie u={item.data.u} /></td>
              <td>{formatValue(item.data.sdep, data.enveloppe.data.sdep)}</td>
              <td>{formatValue(item.data.dp, data.enveloppe.data.dp)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td><PerformanceEnveloppe ubat={data.enveloppe.data.ubat} /></td>
            <td>{showPercent ? "100 %" : Math.trunc(data.enveloppe.data.sdep).toLocaleString("fr-FR")}</td>
            <td>{showPercent ? "100 %" : Math.trunc(data.enveloppe.data.dp).toLocaleString("fr-FR")}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
