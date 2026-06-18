import * as models from "@open-dpe-logement/models";
import { useState } from "react";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { IconEnergie, IconUsage, Enum } from "./web";

interface Props {
  data: models.common.Consommations;
  className?: string;
}

export function Consommations({ data, className = "" }: Props) {
  const [showPercent, setShowPercent] = useState(false);

  const total = models.common.reduceConsommations(data);
  const parEnergie = models.common.reduceConsommationsParEnergie(data);
  const parUsage = models.common.reduceConsommationsParUsage(data);
  const tableParEnergie = Array.from(Object.entries(parEnergie)).map(([energie, consommation]) => ({
    key: energie,
    cef: consommation.cef,
    cep: consommation.cep,
    eges: consommation.eges,
  }));
  const tableParUsage = Array.from(Object.entries(parUsage)).map(([usage, consommation]) => ({
    key: usage,
    cef: consommation.cef,
    cep: consommation.cep,
    eges: consommation.eges,
  }));

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

      <ScrollArea>
        <table className="table text-center">
          <thead>
            <tr>
              <th>Energie</th>
              <th>EF</th>
              <th>EP</th>
              <th>EGES</th>
            </tr>
          </thead>

          <tbody>
            {tableParEnergie.map((item) => (
              <tr key={item.key}>
                <td className="w-full gap-2">
                  <div className="flex items-center gap-2">
                    <IconEnergie className="icon-primary" value={item.key} />
                    <Enum value={item.key} name="energie" />
                  </div>
                </td>
                <td>{formatValue(item.cef, total.cef)}</td>
                <td>{formatValue(item.cep, total.cep)}</td>
                <td>{formatValue(item.eges, total.eges)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{showPercent ? "100 %" : Math.trunc(total.cef).toLocaleString("fr-FR")}</td>
              <td>{showPercent ? "100 %" : Math.trunc(total.cep).toLocaleString("fr-FR")}</td>
              <td>{showPercent ? "100 %" : Math.trunc(total.eges).toLocaleString("fr-FR")}</td>
            </tr>
          </tfoot>
        </table>

        <table className="table scrollbar-x-none xl:overflow-x-auto mt-8 text-center">
          <thead>
            <tr>
              <th>Usage</th>
              <th>EF</th>
              <th>EP</th>
              <th>EGES</th>
            </tr>
          </thead>

          <tbody>
            {tableParUsage.map((item) => (
              <tr key={item.key}>
                <td className="w-full">
                  <div className="flex items-center gap-2">
                    <IconUsage className="icon-primary" value={item.key} />
                    <Enum value={item.key} name="usage" />
                  </div>
                </td>
                <td>{formatValue(item.cef, total.cef)}</td>
                <td>{formatValue(item.cep, total.cep)}</td>
                <td>{formatValue(item.eges, total.eges)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td>{showPercent ? "100 %" : Math.trunc(total.cef).toLocaleString("fr-FR")}</td>
              <td>{showPercent ? "100 %" : Math.trunc(total.cep).toLocaleString("fr-FR")}</td>
              <td>{showPercent ? "100 %" : Math.trunc(total.eges).toLocaleString("fr-FR")}</td>
            </tr>
          </tfoot>
        </table>

        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}