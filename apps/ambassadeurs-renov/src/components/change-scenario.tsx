import { useState } from "react";
import { createContext, services } from "@open-dpe-logement/engine";
import { scenarios, zones, withAltitude, withAnneeConstruction, withZone } from "../models/scenario";
import { setDiagnostic } from "../stores/user";
import { Button } from "@/components/ui/button"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

interface Props {
  onSuccess?: () => void;
  className?: string;
}

export function ChangeScenario({ className = "", onSuccess }: Props) {
  const [scenarioId, setScenarioId] = useState<string>(scenarios[0].id);
  const [zoneClimatique, setZoneClimatique] = useState<string>(zones[0].zone_climatique);
  const [altitude, setAltitude] = useState<string>("0");
  const [anneeConstruction, setAnneeConstruction] = useState<string>("1970");
  const [error, setError] = useState<string>();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      setError(`Scénario introuvable`);
      return;
    }

    let data = scenario.data;
    if (zoneClimatique) data = withZone(data, zoneClimatique);
    if (altitude) data = withAltitude(data, Number(altitude));
    if (anneeConstruction) data = withAnneeConstruction(data, Number(anneeConstruction));

    const context = createContext(data);
    const result = services.diagnostic.calcule(context);

    setDiagnostic(result);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className={`${className} flex flex-col gap-4`}>
      <NativeSelect
        value={scenarioId}
        onChange={(e) => setScenarioId(e.target.value)}
        className="w-full"
      >
        {
          scenarios.map(({ id, titre }) => (
            <NativeSelectOption key={id} value={id}>{titre}</NativeSelectOption>
          ))
        }
      </NativeSelect>

      <NativeSelect
        value={zoneClimatique}
        onChange={(e) => setZoneClimatique(e.target.value)}
        className="w-full"
      >
        {
          zones.map(({ zone_climatique, commune }) => (
            <NativeSelectOption key={zone_climatique} value={zone_climatique}>{commune}</NativeSelectOption>
          ))
        }
      </NativeSelect>

      <NativeSelect
        value={altitude}
        onChange={(e) => setAltitude(e.target.value)}
        className="w-full"
      >
        <NativeSelectOption value="0">Moins de 200m</NativeSelectOption>
        <NativeSelectOption value="600">Entre 200 et 800m</NativeSelectOption>
        <NativeSelectOption value="1000">Au-dessus de 800m</NativeSelectOption>
      </NativeSelect>

      <NativeSelect
        value={anneeConstruction}
        onChange={(e) => setAnneeConstruction(e.target.value)}
        className="w-full"
      >
        <NativeSelectOption value="1900">Avant 1948</NativeSelectOption>
        <NativeSelectOption value="1970">1948-1974</NativeSelectOption>
        <NativeSelectOption value="1975">1975-1977</NativeSelectOption>
        <NativeSelectOption value="1978">1978-1982</NativeSelectOption>
        <NativeSelectOption value="1983">1983-1988</NativeSelectOption>
        <NativeSelectOption value="1989">1989-2000</NativeSelectOption>
        <NativeSelectOption value="2001">2001-2005</NativeSelectOption>
        <NativeSelectOption value="2006">2006-2012</NativeSelectOption>
        <NativeSelectOption value="2013">2013-2021</NativeSelectOption>
        <NativeSelectOption value="2022">Après 2021</NativeSelectOption>
      </NativeSelect>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button type="submit">Valider</Button>
    </form>
  )
}
