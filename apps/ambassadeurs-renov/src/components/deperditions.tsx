import { useState } from "react";
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RepartitionDeperditions } from "./web";
import { objectToHundred } from "@/lib/math";

interface Props {
  values: {
    dp_murs: number;
    dp_planchers_hauts: number;
    dp_planchers_bas: number;
    dp_baies: number;
    dp_portes: number;
    dr: number;
    pt: number;
  }
  className?: string;
}

export function Deperditions({ values, className = "" }: Props) {
  const [showPercent, setShowPercent] = useState(false);
  const percentValues = objectToHundred(values);
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
    </div>
  )
}
