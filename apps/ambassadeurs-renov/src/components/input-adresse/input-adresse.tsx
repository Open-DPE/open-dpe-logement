/**
 * AddressAutocomplete
 * Composant de saisie d'adresse avec autocomplétion via l'API Adresse (BAN)
 * https://www.data.gouv.fr/dataservices/api-adresse-base-adresse-nationale-ban
 *
 * Props :
 *   - onSelect       : callback appelé avec le Feature GeoJSON sélectionné
 *   - typeFilter     : filtre de type BAN ('housenumber' | 'street' | 'municipality' | 'locality')
 *                      défaut : 'housenumber'
 *   - placeholder    : texte du champ, défaut : 'Rechercher une adresse…'
 *   - label          : libellé du champ
 *   - required       : affiche une erreur si on quitte sans sélectionner
 *   - className      : classes Tailwind supplémentaires sur le wrapper
 */

import { useState, useRef, useCallback, useEffect, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin, Loader2, AlertCircle, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BanProperties {
  label: string;
  score: number;
  housenumber?: string;
  id: string;
  type: "housenumber" | "street" | "locality" | "municipality";
  name: string;
  postcode: string;
  citycode: string;
  x: number;
  y: number;
  city: string;
  context: string;
  importance: number;
  street?: string;
}

export interface BanFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: BanProperties;
}

interface AddressAutocompleteProps {
  onSelect: (feature: BanFeature) => void;
  typeFilter?: "housenumber" | "street" | "municipality" | "locality";
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
  defaultValue?: string;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const BAN_API = "https://api-adresse.data.gouv.fr/search/";
const DEBOUNCE_MS = 300;
const MIN_CHARS = 3;

// ─── Composant principal ──────────────────────────────────────────────────────

export function AddressAutocomplete({
  onSelect,
  typeFilter = "housenumber",
  placeholder = "Rechercher une adresse…",
  label = "Adresse",
  required = false,
  className,
  defaultValue = "",
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<BanFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [hasSelection, setHasSelection] = useState(!!defaultValue);
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Refs stables pour éviter les re-renders dans l'effet
  const hasSelectionRef = useRef(hasSelection);
  hasSelectionRef.current = hasSelection;

  // ── Fetch avec debounce intégré ─────────────────────────────────────────────
  // Toutes les setState sont appelées dans des callbacks asynchrones (.then, finally),
  // jamais de manière synchrone dans le corps de l'effet — conformément aux règles React.

  useEffect(() => {
    if (query.length < MIN_CHARS || hasSelectionRef.current) {
      // Réinitialisation synchrone uniquement via les refs ; les setState passent
      // par un timer à délai 0 pour rester dans un callback async.
      const reset = setTimeout(() => {
        setSuggestions([]);
        setIsOpen(false);
      }, 0);
      return () => clearTimeout(reset);
    }

    const debounceTimer = setTimeout(() => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      const params = new URLSearchParams({
        q: query,
        limit: "6",
        ...(typeFilter ? { type: typeFilter } : {}),
      });

      setIsLoading(true);

      fetch(`${BAN_API}?${params}`, { signal: abortRef.current.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          const features: BanFeature[] = data.features ?? [];
          setSuggestions(features);
          setIsOpen(features.length > 0);
          setActiveIndex(-1);
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error("[AddressAutocomplete] Erreur BAN:", err);
          }
        })
        .finally(() => setIsLoading(false));
    }, DEBOUNCE_MS);

    return () => {
      clearTimeout(debounceTimer);
      abortRef.current?.abort();
    };
  }, [query, typeFilter]);

  // ── Sélection d'une suggestion ──────────────────────────────────────────────

  const handleSelect = useCallback(
    (feature: BanFeature) => {
      setQuery(feature.properties.label);
      setHasSelection(true);
      setSuggestions([]);
      setIsOpen(false);
      setError(null);
      onSelect(feature);
      inputRef.current?.blur();
    },
    [onSelect]
  );

  // ── Réinitialisation ────────────────────────────────────────────────────────

  const handleClear = useCallback(() => {
    setQuery("");
    setHasSelection(false);
    setSuggestions([]);
    setIsOpen(false);
    setError(null);
    setTouched(false);
    inputRef.current?.focus();
  }, []);

  // ── Navigation clavier ──────────────────────────────────────────────────────

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIndex]);
      } else if (e.key === "Escape") {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    },
    [isOpen, suggestions, activeIndex, handleSelect]
  );

  // ── Validation à la sortie du champ ─────────────────────────────────────────

  const handleBlur = useCallback(() => {
    setTouched(true);
    // Délai pour laisser le mousedown de la suggestion se déclencher avant fermeture
    setTimeout(() => {
      if (required && query && !hasSelectionRef.current) {
        setError("Sélectionnez une adresse dans la liste de suggestions.");
      }
      setIsOpen(false);
    }, 150);
  }, [required, query]);

  // ── Changement de saisie ─────────────────────────────────────────────────────

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasSelection(false);
    setError(null);
  }, []);

  const showError = touched && required && !hasSelection && query.length > 0;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className={cn("relative w-full space-y-1.5", className)}>
      {/* Label */}
      <Label
        htmlFor="address-input"
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {/* Champ de saisie */}
      <div className="relative">
        {/* Icône gauche */}
        <MapPin
          className={cn(
            "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
            hasSelection ? "text-primary" : "text-muted-foreground"
          )}
          aria-hidden="true"
        />

        <Input
          ref={inputRef}
          id="address-input"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="address-listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `address-option-${activeIndex}` : undefined
          }
          aria-invalid={showError}
          autoComplete="off"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0 && !hasSelection) setIsOpen(true);
          }}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={cn(
            "pl-9 pr-8 transition-colors",
            showError && "border-destructive focus-visible:ring-destructive"
          )}
        />

        {/* Indicateurs droite : loader ou bouton clear */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
          {isLoading && (
            <Loader2
              className="h-4 w-4 animate-spin text-muted-foreground"
              aria-label="Recherche en cours…"
            />
          )}
          {!isLoading && query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Effacer l'adresse"
              className="rounded-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message d'erreur */}
      {showError && error && (
        <p
          role="alert"
          className="flex items-center gap-1.5 text-xs text-destructive"
        >
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {/* Liste de suggestions */}
      {isOpen && suggestions.length > 0 && (
        <ul
          ref={listRef}
          id="address-listbox"
          role="listbox"
          aria-label="Suggestions d'adresses"
          className={cn(
            "absolute z-50 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow-md",
            "animate-in fade-in-0 zoom-in-95"
          )}
        >
          {suggestions.map((feature, index) => {
            const { label: addrLabel, postcode, city } = feature.properties;
            const isActive = index === activeIndex;

            return (
              <li
                key={feature.properties.id}
                id={`address-option-${index}`}
                role="option"
                aria-selected={isActive}
                onMouseDown={(e) => {
                  // Prévenir le blur avant le click
                  e.preventDefault();
                  handleSelect(feature);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={cn(
                  "flex cursor-pointer items-start gap-2.5 px-3 py-2.5 text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <MapPin
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium leading-tight">
                    {addrLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {postcode} {city}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Exemple d'utilisation ────────────────────────────────────────────────────

/*
import { AddressAutocomplete, BanFeature } from "./AddressAutocomplete";

function DpeForm() {
  const handleSelect = (feature: BanFeature) => {
    const { label, postcode, citycode, x, y } = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;
    console.log({ label, postcode, citycode, x, y, lng, lat });
  };

  return (
    <AddressAutocomplete
      label="Adresse du bien"
      onSelect={handleSelect}
      typeFilter="housenumber"
      required
    />
  );
}
*/