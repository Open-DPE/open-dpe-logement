import { useEffect, useRef, useState } from "react";
import { toast } from "sonner"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useDebounce } from "@/hooks/use-debounce";
import { searchAdresse, type Adresse } from "@/services/search-adresse";

interface Props {
  className?: string;
  /** Libellé affiché à l'initialisation (adresse déjà connue). */
  defaultValue?: string;
  onChange: (adresse: Adresse | null) => void;
}

export function AdresseAutocomplete({ className = "", defaultValue = "", onChange }: Props) {
  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Array<Adresse>>([]);

  const debouncedQuery = useDebounce(query, 300);
  // Libellé déjà résolu (valeur initiale ou suggestion sélectionnée) : il ne doit
  // pas relancer de recherche. Comparaison sur la valeur plutôt qu'un drapeau à
  // usage unique, que le double montage de StrictMode consommerait.
  const resolvedQueryRef = useRef(defaultValue);

  useEffect(() => {
    if (debouncedQuery === resolvedQueryRef.current) {
      return;
    }
    if (debouncedQuery.length <= 5) {
      return;
    }
    searchAdresse(debouncedQuery)
      .then((data) => {
        setSuggestions(data.features);
        setOpen(true);
      })
      .catch((error: Error) => {
        setSuggestions([]);
        toast.error(error.message);
      });

  }, [debouncedQuery]);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    if (value.length <= 5) {
      setSuggestions([]);
    }
  };

  const handleValueChange = (value: Adresse | null) => {
    resolvedQueryRef.current = value ? value.properties.label : "";
    setOpen(false);
    onChange(value)
  }

  return (
    <Combobox
      items={suggestions}
      itemToStringLabel={(item: Adresse) => item.properties.label}
      itemToStringValue={(item: Adresse) => item.properties.id}
      defaultInputValue={defaultValue}
      open={open}
      openOnInputClick={false}
      onInputValueChange={handleQueryChange}
      onValueChange={handleValueChange}
    >
      <ComboboxInput
        className={className}
        placeholder="1 rue de l'exemple, 84000 Avignon"
        // Le champ peut être pré-rempli : la prise de focus sélectionne le
        // libellé pour que la saisie le remplace au lieu de s'y ajouter.
        onFocus={(e) => e.currentTarget.select()}
      />
      <ComboboxContent>
        {
          suggestions.length === 0 && (<ComboboxEmpty>Aucune adresse trouvée</ComboboxEmpty>)
        }
        <ComboboxList>
          {
            suggestions.map((item) => (
              <ComboboxItem key={item.properties.id} value={item}>
                {item.properties.label}
              </ComboboxItem>
            ))
          }
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
