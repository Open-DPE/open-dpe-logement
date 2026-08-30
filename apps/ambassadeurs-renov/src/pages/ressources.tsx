import { useState } from "react";
import { ressource, tag } from '@/models/ressource';
import { ChevronRightIcon } from "lucide-react"
import { Layout } from "@/components/layout/layout";
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"

export function Ressources() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filters = tag.all().map((tag) => ({
    label: tag,
    count: ressource.all().filter((r) => r.tags.includes(tag)).length,
  }));

  const ressources = selectedTags.length === 0
    ? ressource.all()
    : ressource.byTags(selectedTags);

  function toggleTag(tag: string) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  return (
    <Layout>
      <header className="mb-8 text-center">
        <h1 className="font-medium text-lg">Ressources et outils</h1>
        <p>
          Vidéos, podcasts, quizz ou services pour tout savoir sur la rénovation énergétique.
        </p>
      </header>

      <div className="flex flex-col gap-6 max-w-[768px] mx-auto">
        <nav className="flex flex-row gap-2 items-center">
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
        </nav>

        <div className="flex w-full flex-col gap-4">
          {
            ressources.map((r) => (
              <Item key={r.titre} variant="outline" className="white bg-white hover:bg-gray-50">
                <ItemContent>
                  <ItemTitle>{r.titre}</ItemTitle>
                  <ItemDescription>{r.description}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <a href={r.url} target="_blank" rel="noopener noreferrer">
                    <ChevronRightIcon />
                  </a>
                </ItemActions>
              </Item>
            ))
          }
        </div>
      </div>
    </Layout>
  );
}
