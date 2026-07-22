import { useState, type SubmitEvent, type MouseEvent } from "react";
import { toast } from "sonner"
import { SearchIcon } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Spinner } from "@/components/ui/spinner";
import { type Adresse } from "@/services/search-adresse";
import { searchDPE, type DPE } from "@/services/search-dpe";
import { AdresseAutocomplete } from "./adresse-autocomplete";

interface Props {
  onSuccess: () => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR");
}

export function RechercheDpeForm({ onSuccess }: Props) {
  const [adresse, setAdresse] = useState<Adresse | null>(null);

  const [searchPending, setSearchPending] = useState(false);
  const [searchError, setSearchError] = useState<string>();

  const [pending, setPending] = useState(false);
  const [results, setResults] = useState<Array<DPE>>();

  async function handleSearch(e: MouseEvent) {
    e.preventDefault();

    if (!adresse) {
      setSearchError("Sélectionnez une adresse dans la liste de suggestions.");
      return;
    }

    setSearchPending(true);
    setSearchError(undefined);

    try {
      const { results } = await searchDPE(adresse.properties.label);
      setResults(results);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setSearchPending(false);
    }
  }

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();

    setPending(true);
    setPending(false);
    onSuccess()
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field>
          <ButtonGroup>
            <AdresseAutocomplete className="flex-1 bg-white" onChange={setAdresse} />
            <Button type="button" onClick={(e) => handleSearch(e)} disabled={searchPending || !adresse}>
              {searchPending
                ? (<><Spinner data-icon="inline-start" /> Recherche...</>)
                : (<><SearchIcon /> Rechercher</>)
              }
            </Button>
          </ButtonGroup>
          {searchError && (
            <FieldError className="mt-1">{searchError}</FieldError>
          )}
        </Field>

        {results && results.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Aucun DPE trouvé pour cette adresse.
          </p>
        )}

        <RadioGroup required>
          {results && results.map((dpe) => (
            <FieldLabel key={dpe.numero_dpe} htmlFor={dpe.numero_dpe} className="bg-white">
              <Field orientation="horizontal">
                <FieldContent>
                  <FieldTitle>{dpe.adresse_ban ?? dpe.adresse_complete_brut}</FieldTitle>
                  <FieldDescription>
                    Type de bâtiment : {dpe.type_batiment} <br />
                    Date d'établissement : {formatDate(dpe.date_etablissement_dpe)}
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem value={dpe.numero_dpe} id={dpe.numero_dpe} />
              </Field>
            </FieldLabel>
          ))}
        </RadioGroup>

        {
          results && (
            <Button type="submit" className="w-full" disabled={pending}>
              {pending
                ? <><Spinner data-icon="inline-start" /> Calcul...</>
                : "Valider"
              }
            </Button>
          )
        }
      </form>
    </div>
  );
}
