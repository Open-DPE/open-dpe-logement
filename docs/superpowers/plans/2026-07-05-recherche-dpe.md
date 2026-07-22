# Composant recherche-dpe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construire le composant `recherche-dpe` de l'app `ambassadeurs-renov` : un formulaire qui recherche une adresse via autocomplétion, puis recherche les DPE existants de l'ADEME pour cette adresse et affiche les résultats sous forme de liste.

**Architecture:**
Le composant est autonome et réutilisable : il expose une prop `onSelect(dpe)` optionnelle appelée quand l'utilisateur clique sur un résultat — c'est à la page appelante de décider quoi faire (pré-remplissage, navigation, etc.), le composant ne fait aucune navigation lui-même. Il s'appuie sur les services existants `searchAdresse` (`src/services/search-adresse.ts`) et `searchDPE` (`src/services/search-dpe.ts`), déjà fonctionnels et non modifiés par ce plan. L'autocomplétion réutilise le hook existant `useDebounce` (`src/hooks/use-debounce.ts`) plutôt que de dupliquer une logique de debounce.

`src/components/input-adresse.tsx` (un composant `AddressAutocomplete` qui interroge une API différente — `api-adresse.data.gouv.fr` au lieu de `data.geopf.fr`) est laissé tel quel : les deux composants coexistent indépendamment, `recherche-dpe.tsx` construit sa propre autocomplétion via `search-adresse.ts` sans dépendre de `input-adresse.tsx`.

**Tech Stack:** React 19, TypeScript, Tailwind, composants `ui/*` existants (shadcn-style : `Field`, `Input`, `Button`, `Spinner`, `Alert`, `Item*`).

**Note sur les tests:** l'app `ambassadeurs-renov` n'a pas de runner de tests unitaire configuré (aucun composant existant — `avant-apres.tsx`, `dpe.tsx`, etc. — n'a de test associé). Ce plan suit donc la convention du projet : vérification par `tsc` (type-check) après chaque étape de code, et vérification manuelle finale dans le navigateur (dev server) plutôt que des tests automatisés.

---

## File Structure

- Delete: `apps/ambassadeurs-renov/src/components/recherche-dpe.ts` (stub vide, remplacé par `recherche-dpe.tsx`)
- Create: `apps/ambassadeurs-renov/src/components/recherche-dpe-resultats.tsx` — affichage de la liste des DPE trouvés (présentation pure)
- Create: `apps/ambassadeurs-renov/src/components/recherche-dpe.tsx` — orchestration : input adresse avec autocomplétion, bouton "Rechercher", validation, appel `searchDPE`, affichage des résultats/erreurs
- Non modifié : `apps/ambassadeurs-renov/src/components/input-adresse.tsx` (conservé tel quel, coexiste indépendamment)

---

### Task 1: Nettoyage du stub vide

**Files:**
- Delete: `apps/ambassadeurs-renov/src/components/recherche-dpe.ts`

- [ ] **Step 1: Supprimer le stub vide**

```bash
rm apps/ambassadeurs-renov/src/components/recherche-dpe.ts
```

- [ ] **Step 2: Vérifier qu'aucun fichier ne le référence encore**

Run: `grep -rn "recherche-dpe" apps/ambassadeurs-renov/src --include="*.ts*"`
Expected: aucune sortie (aucune référence existante, ce fichier n'est utilisé nulle part)

- [ ] **Step 3: Commit**

```bash
git add apps/ambassadeurs-renov/src/components/recherche-dpe.ts
git commit -m "chore(ambassadeurs-renov): supprime le stub vide recherche-dpe.ts"
```

---

### Task 2: Liste des résultats (recherche-dpe-resultats.tsx)

**Files:**
- Create: `apps/ambassadeurs-renov/src/components/recherche-dpe-resultats.tsx`

- [ ] **Step 1: Créer le composant de présentation de la liste**

```tsx
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
```

- [ ] **Step 2: Vérifier les types**

Run: `(cd apps/ambassadeurs-renov && npx tsc -b)`
Expected: aucune erreur de type sur `recherche-dpe-resultats.tsx`

- [ ] **Step 3: Commit**

```bash
git add apps/ambassadeurs-renov/src/components/recherche-dpe-resultats.tsx
git commit -m "feat(ambassadeurs-renov): ajoute la liste de résultats recherche-dpe"
```

---

### Task 3: Composant recherche-dpe (autocomplétion + bouton + validation)

**Files:**
- Create: `apps/ambassadeurs-renov/src/components/recherche-dpe.tsx`

- [ ] **Step 1: Créer le composant principal**

```tsx
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
      setSuggestions([]);
      setSuggestionsOpen(false);
      return;
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
```

- [ ] **Step 2: Vérifier les types**

Run: `(cd apps/ambassadeurs-renov && npx tsc -b)`
Expected: aucune erreur de type sur `recherche-dpe.tsx`

- [ ] **Step 3: Lint**

Run: `npx turbo lint --filter=ambassadeurs-renov`
Expected: aucune erreur (warnings existants du projet non liés à ces fichiers acceptés)

- [ ] **Step 4: Commit**

```bash
git add apps/ambassadeurs-renov/src/components/recherche-dpe.tsx
git commit -m "feat(ambassadeurs-renov): ajoute le composant recherche-dpe"
```

---

### Task 4: Vérification manuelle dans le navigateur

Le composant n'est volontairement rattaché à aucune page (cf. Architecture) : il expose uniquement `onSelect`. Pour le tester visuellement, on le monte temporairement dans `home.tsx`, on vérifie le comportement, puis on annule ce montage temporaire (il ne fait pas partie du livrable de ce plan — le choix de la page d'intégration finale reviendra à une décision produit séparée).

**Files:**
- Modify temporarily: `apps/ambassadeurs-renov/src/pages/home.tsx` (revert avant le commit final)

- [ ] **Step 1: Monter temporairement le composant pour test**

Dans `apps/ambassadeurs-renov/src/pages/home.tsx`, ajouter temporairement (ne pas commit) :

```tsx
import { RechercheDpe } from "@/components/recherche-dpe";
// ...
<RechercheDpe onSelect={(dpe) => console.log("DPE sélectionné", dpe)} />
```

- [ ] **Step 2: Lancer le serveur de dev**

Run: `npx turbo dev --filter=ambassadeurs-renov`
Expected: le serveur démarre sans erreur

- [ ] **Step 3: Tester le parcours dans le navigateur**

Ouvrir la page d'accueil et vérifier :
1. Taper 3+ caractères d'une adresse réelle (ex: "12 rue de la paix paris") affiche des suggestions
2. Cliquer une suggestion renseigne le champ et ferme la liste
3. Cliquer "Rechercher" sans avoir sélectionné de suggestion affiche l'erreur de validation
4. Cliquer "Rechercher" après sélection d'une adresse affiche un spinner puis la liste des DPE (ou le message "Aucun résultat")
5. Cliquer un résultat déclenche `onSelect` (visible dans la console du navigateur)

Expected: les 5 comportements fonctionnent comme décrit

- [ ] **Step 4: Annuler le montage temporaire**

```bash
git checkout -- apps/ambassadeurs-renov/src/pages/home.tsx
```

Expected: `git status` ne montre plus de modification sur `home.tsx`
