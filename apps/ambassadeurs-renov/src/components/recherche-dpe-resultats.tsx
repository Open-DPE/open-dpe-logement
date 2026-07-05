import { FileTextIcon } from "lucide-react";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import type { DPE } from "@/services/search-dpe";

interface Props {
  results: Array<DPE>;
  onSelect: (dpe: DPE) => void;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("fr-FR");
}

export function RechercheDpeResultats({ results, onSelect }: Props) {
  if (results.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun DPE trouvé pour cette adresse.
      </p>
    );
  }

  return (
    <ItemGroup>
      {results.map((dpe) => (
        <Item
          key={dpe.numero_dpe}
          variant="outline"
          role="button"
          tabIndex={0}
          onClick={() => onSelect(dpe)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onSelect(dpe);
            }
          }}
          className="cursor-pointer"
        >
          <ItemMedia variant="icon">
            <FileTextIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{dpe.adresse_ban ?? dpe.adresse_complete_brut}</ItemTitle>
            <ItemDescription>
              DPE n°{dpe.numero_dpe} · établi le {formatDate(dpe.date_etablissement_dpe)} · {dpe.type_batiment}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="ghost" size="sm" type="button" tabIndex={-1}>
              Sélectionner
            </Button>
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  );
}
