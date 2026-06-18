import { useState } from "react";
import { ressources, tags, filterRessourcesByTags } from '@/models/ressource';
import { Button } from '@/components/ui/button';
import { ChevronRightIcon } from "lucide-react"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

export function Ressources() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filters = tags.map((tag) => ({
    label: tag,
    count: ressources.filter((r) => r.tags.includes(tag)).length,
  }));

  const filteredRessources = selectedTags.length === 0
    ? ressources
    : filterRessourcesByTags(ressources, selectedTags);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-[768px] mx-auto">
      <header className="flex flex-row gap-2 items-center">
        {filters.map((filter) => (
          <Button
            key={filter.label}
            variant="outline"
            size="sm"
            aria-pressed={selectedTags.includes(filter.label)}
            className={selectedTags.includes(filter.label) ? "ring-1 ring-primary tag" : "tag"}
            onClick={() => toggleTag(filter.label)}
          >
            {filter.label}
            <span className="bg-white rounded-full ml-2 p-1">{filter.count}</span>
          </Button>
        ))}
        {selectedTags.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setSelectedTags([])}>
            ×
          </Button>
        )}
      </header>

      <div className="flex w-full flex-col gap-4">
        {
          filteredRessources.map((ressource) => (
            <Item key={ressource.titre} variant="outline">
              <ItemContent>
                <ItemTitle>{ressource.titre}</ItemTitle>
                <ItemDescription>{ressource.description}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <a href={ressource.url} target="_blank" rel="noopener noreferrer">
                  <ChevronRightIcon />
                </a>
              </ItemActions>
            </Item>
          ))
        }
      </div>
    </div>
  );
}
