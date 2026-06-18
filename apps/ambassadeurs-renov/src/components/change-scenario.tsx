import { useState } from "react";
import { createContext, services } from "@open-dpe-logement/engine";
import { scenarios, withAltitude, withAnneeConstruction, withDepartement } from "../models/scenario";
import { departements } from "../models/departement";
import { useUserStore, setDiagnostic } from "../stores/user";
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"

interface Props {
  className?: string;
}

export function ChangeScenario({ className = "" }: Props) {
  const { diagnostic, scenario } = useUserStore();

  const [pending, setPending] = useState(false);
  const [scenarioId, setScenarioId] = useState<string>(
    scenario ?? scenarios[0].id
  );
  const [departementCode, setDepartementCode] = useState<string>(
    diagnostic?.batiment.adresse.code_insee.substring(0, 2) ?? departements[0].code_departement
  );
  const [altitude, setAltitude] = useState<string>(
    diagnostic?.batiment.altitude.toString() ?? "0"
  );
  const [anneeConstruction, setAnneeConstruction] = useState<string>(
    diagnostic?.batiment.annee_construction.toString() ?? "1900"
  );
  const [error, setError] = useState<string>();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setPending(true);
    setError(undefined);

    await new Promise((resolve) => setTimeout(resolve, 0));

    const scenario = scenarios.find((s) => s.id === scenarioId);
    if (!scenario) {
      setError(`Scénario introuvable`);
      setPending(false);
      return;
    }

    let data = scenario.data;
    const departement = departements.find((d) => d.code_departement === departementCode);
    if (departement) data = withDepartement(data, departement);
    if (altitude) data = withAltitude(data, Number(altitude));
    if (anneeConstruction) data = withAnneeConstruction(data, Number(anneeConstruction));

    const context = createContext(data);
    const result = services.diagnostic.calcule(context);

    setDiagnostic(scenario.id, result);
    setPending(false);
    toast.success("Scénario mis à jour");
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
        value={departementCode}
        onChange={(e) => setDepartementCode(e.target.value)}
        className="w-full"
      >
        {departements.map(({ code_departement, departement }) => (
          <NativeSelectOption key={code_departement} value={code_departement}>{departement}</NativeSelectOption>
        ))}
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

      <Button type="submit" disabled={pending}>
        {pending
          ? <><Spinner data-icon="inline-start" /> Calcul...</>
          : "Valider"
        }
      </Button>
    </form>
  )
}
