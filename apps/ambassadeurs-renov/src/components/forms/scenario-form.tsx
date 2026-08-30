import { useState } from "react";
import { scenarios } from "../../models/scenario";
import { departement } from "../../models/departement";
import { useUserStore } from "../../stores/user";
import { changeScenario } from "../../handlers/change-scenario";
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner";

function toDepartement(code: string | null | undefined): string {
  if (!code) return departement.all()[0].code_departement;
  return code.substring(0, 2);
}

function toAltitude(altitude: number | null | undefined): string {
  if (altitude === null || altitude === undefined) return "0";
  if (altitude < 200) return "0";
  if (altitude < 800) return "600";
  return "1000";
}

function toAnneeConstruction(annee: number | null | undefined): string {
  if (annee === null || annee === undefined) return "1900";
  if (annee < 1948) return "1900";
  if (annee < 1975) return "1970";
  if (annee < 1978) return "1975";
  if (annee < 1983) return "1978";
  if (annee < 1989) return "1983";
  if (annee < 2001) return "1989";
  if (annee < 2006) return "2001";
  if (annee < 2013) return "2006";
  if (annee < 2022) return "2013";
  return "2022";
}

interface Props {
  onSuccess: () => void
}

export function ScenarioForm({ onSuccess }: Props) {
  const { diagnostic, scenario } = useUserStore();

  const [pending, setPending] = useState(false);
  const [scenarioId, setScenarioId] = useState<string>(
    scenario ?? scenarios[0].id
  );
  const [departementCode, setDepartementCode] = useState<string>(
    toDepartement(diagnostic?.batiment.adresse.code_insee)
  );
  const [altitude, setAltitude] = useState<string>(
    toAltitude(diagnostic?.batiment.altitude)
  );
  const [anneeConstruction, setAnneeConstruction] = useState<string>(
    toAnneeConstruction(diagnostic?.batiment.annee_construction)
  );
  const [error, setError] = useState<string>();

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setPending(true);
    setError(undefined);

    const { success, message } = await changeScenario({
      scenarioId,
      departementCode,
      altitude,
      anneeConstruction,
    });

    if (success) {
      toast.success(message);
      onSuccess();
    } else {
      toast.error(message);
    }

    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select value={scenarioId} onValueChange={setScenarioId}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Sélectionnez un scénario" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Chauffage</SelectLabel>
            {scenarios.map(({ id, titre }) => (
              <SelectItem key={id} value={id}>{titre}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={departementCode} onValueChange={setDepartementCode}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Sélectionnez un département" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Départements</SelectLabel>
            {departement.all().map(({ code_departement, departement }) => (
              <SelectItem key={code_departement} value={code_departement}>{`${code_departement} - ${departement}`}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={altitude} onValueChange={setAltitude}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Sélectionnez l'altitude" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Altitude</SelectLabel>
            <SelectItem value="0">Moins de 200m</SelectItem>
            <SelectItem value="600">Entre 200 et 800m</SelectItem>
            <SelectItem value="1000">Au-dessus de 800m</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={anneeConstruction} onValueChange={setAnneeConstruction}>
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Sélectionnez l'année de construction" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Année de construction</SelectLabel>
            <SelectItem value="1900">Avant 1948</SelectItem>
            <SelectItem value="1970">1948-1974</SelectItem>
            <SelectItem value="1975">1975-1977</SelectItem>
            <SelectItem value="1978">1978-1982</SelectItem>
            <SelectItem value="1983">1983-1988</SelectItem>
            <SelectItem value="1989">1989-2000</SelectItem>
            <SelectItem value="2001">2001-2005</SelectItem>
            <SelectItem value="2006">2006-2012</SelectItem>
            <SelectItem value="2013">2013-2021</SelectItem>
            <SelectItem value="2022">Après 2021</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>

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
