import { useEffect, useState, type FormEvent } from "react";
import { MapPinIcon, SearchIcon } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useDebounce } from "@/hooks/use-debounce";
import { searchAdresse, type Adresse } from "@/services/search-adresse";
import { searchDPE, type DPE } from "@/services/search-dpe";
import { RechercheDpeResultats } from "@/components/recherche-dpe-resultats";

interface Props {
  onSelect?: (dpe: DPE) => void;
}

export function RechercheDpe({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [adresse, setAdresse] = useState<Adresse | null>(null);
  const [suggestions, setSuggestions] = useState<Array<Adresse>>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState<string>();

  const [pending, setPending] = useState(false);
  const [searchError, setSearchError] = useState<string>();
  const [results, setResults] = useState<Array<DPE>>();

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (adresse || debouncedQuery.length < 3) {
      // Réinitialisation synchrone évitée : le setState passe par un timer à délai 0
      // pour rester dans un callback async (règle react-hooks/set-state-in-effect).
      const reset = setTimeout(() => {
        setSuggestions([]);
        setSuggestionsOpen(false);
      }, 0);
      return () => clearTimeout(reset);
    }

    let cancelled = false;

    searchAdresse(debouncedQuery)
      .then((data) => {
        if (cancelled) return;
        setSuggestions(data.features);
        setSuggestionsOpen(data.features.length > 0);
        setSuggestionsError(undefined);
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setSuggestions([]);
        setSuggestionsOpen(false);
        setSuggestionsError(error.message);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, adresse]);

  function handleSelectSuggestion(feature: Adresse) {
    setAdresse(feature);
    setQuery(feature.properties.label);
    setSuggestions([]);
    setSuggestionsOpen(false);
  }

  function handleChange(value: string) {
    setQuery(value);
    setAdresse(null);
    setResults(undefined);
    setSearchError(undefined);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!adresse) {
      setSearchError("Sélectionnez une adresse dans la liste de suggestions.");
      return;
    }

    setPending(true);
    setSearchError(undefined);

    try {
      const { results } = await searchDPE(adresse.properties.label);
      setResults(results);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="recherche-dpe-adresse">Adresse du logement</FieldLabel>
          <div className="relative">
            <Input
              id="recherche-dpe-adresse"
              autoComplete="off"
              placeholder="Rechercher une adresse…"
              value={query}
              onChange={(e) => handleChange(e.target.value)}
              onFocus={() => setSuggestionsOpen(suggestions.length > 0)}
              onBlur={() => setTimeout(() => setSuggestionsOpen(false), 150)}
            />

            {suggestionsOpen && (
              <ul className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md">
                {suggestions.map((feature) => (
                  <li key={feature.properties.id}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectSuggestion(feature)}
                      className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                    >
                      <MapPinIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
                      <span>{feature.properties.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {suggestionsError && <FieldError>{suggestionsError}</FieldError>}
        </Field>

        {searchError && <FieldError>{searchError}</FieldError>}

        <Button type="submit" disabled={pending}>
          {pending
            ? (<><Spinner data-icon="inline-start" /> Recherche...</>)
            : (<><SearchIcon /> Rechercher</>)
          }
        </Button>
      </form>

      {results !== undefined && (
        results.length === 0 ? (
          <Alert>
            <AlertTitle>Aucun résultat</AlertTitle>
            <AlertDescription>
              Aucun DPE n'a été trouvé pour l'adresse sélectionnée.
            </AlertDescription>
          </Alert>
        ) : (
          <RechercheDpeResultats
            results={results}
            onSelect={(dpe) => onSelect?.(dpe)}
          />
        )
      )}
    </div>
  );
}
