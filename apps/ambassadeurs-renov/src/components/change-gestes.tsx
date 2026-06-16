import { useState } from "react";
import * as models from "@open-dpe-logement/models";
import { createContext, services } from "@open-dpe-logement/engine";
import { gestes, withGeste, type Geste } from "../models/geste";
import { $user, setSimulation } from "../stores/user";
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { IconPoste } from "./icon-poste";

interface Props {
  onSuccess?: () => void;
  className?: string;
}


export function ChangeGestes({ className = "", onSuccess }: Props) {
  const { diagnostic, gestes: gestesIds } = $user.get();
  const [selectedGestes, setSelectedGestes] = useState<Geste[]>(() =>
    gestes.filter((geste) => gestesIds.includes(geste.id)),
  );

  if (!diagnostic) {
    return null;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!diagnostic) {
      return null;
    }

    let data = structuredClone(diagnostic) as models.diagnostic.Diagnostic;

    for (const geste of selectedGestes) {
      data = withGeste(data, geste);
    }

    const context = createContext(data);
    const simulation = services.diagnostic.calcule(context);

    setSimulation(simulation, selectedGestes.map(g => g.id));
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className={`${className} flex flex-col gap-4`}>
      <RadioGroup defaultValue="plus" className="max-w-sm">
        {gestes.map((geste) => (
          <FieldLabel htmlFor={`geste-${geste.id}`} key={geste.id}>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>
                  <IconPoste poste={geste.poste}  />
                    {geste.titre}
                </FieldTitle>
                <FieldDescription>
                  {geste.description}
                </FieldDescription>
              </FieldContent>
              <RadioGroupItem value={geste.id} id={`geste-${geste.id}`} />
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>

      <Button type="submit" className="self-end">
        Simuler
      </Button>
    </form>
  );
}
