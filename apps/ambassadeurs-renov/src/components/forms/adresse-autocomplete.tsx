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
  onChange: (adresse: Adresse | null) => void;
}

export function AdresseAutocomplete({ className = "", onChange }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<Array<Adresse>>([]);

  const debouncedQuery = useDebounce(query, 300);
  const skipNextSearchRef = useRef(false);

  useEffect(() => {
    if (skipNextSearchRef.current) {
      skipNextSearchRef.current = false;
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
    skipNextSearchRef.current = true;
    setOpen(false);
    onChange(value)
  }

  return (
    <Combobox
      items={suggestions}
      itemToStringLabel={(item: Adresse) => item.properties.label}
      itemToStringValue={(item: Adresse) => item.properties.id}
      open={open}
      openOnInputClick={false}
      onInputValueChange={handleQueryChange}
      onValueChange={handleValueChange}
    >
      <ComboboxInput className={className} placeholder="1 rue de l'exemple, 84000 Avignon" />
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
