
import { useState } from "react";
import * as models from "@open-dpe-logement/models";
import { engine } from "@open-dpe-logement/engine";
import { gestes, withGeste } from "../../models/geste";
import { useUserStore, setSimulation } from "../../stores/user";

import { XIcon, PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { IconGeste } from "@/components/icons/geste";
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  onSuccess: () => void
}

export function GestesForm({ onSuccess }: Props) {
  const { diagnostic, gestes: gestesIds } = useUserStore();
  const [pending, setPending] = useState(false);
  const [selectedGestes, setSelectedGestes] = useState<string[]>(() =>
    gestes.filter((geste) => gestesIds.includes(geste.id)).map((geste) => geste.id),
  );

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!diagnostic) {
      return null;
    }

    setPending(true);

    let data = structuredClone(diagnostic) as models.diagnostic.Diagnostic;

    for (const gesteId of selectedGestes) {
      const geste = gestes.find((g) => g.id === gesteId);
      if (geste) {
        data = withGeste(data, geste);
      }
    }

    try {
      const simulation = engine.calcule(data);
      setSimulation(simulation.data, selectedGestes);
      onSuccess();
    } catch (error) {
      console.error(error, data);
      toast.error("Une erreur est survenue lors de la simulation.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-between gap-4">

        {gestes.map((geste) => (
          <Card
            key={geste.id}
            className="mx-auto w-full md:max-w-sm [--card-spacing:--spacing(4)] text-center"
          >
            <CardContent>
              <IconGeste geste={geste.id} className="w-[92px] h-auto m-auto" />
            </CardContent>

            <CardHeader className="grow content-start">
              <CardTitle>{geste.titre}</CardTitle>
              <CardDescription>
                <>
                  {geste.description.split("\n").map((line, index) => (
                    <span key={index}>
                      {line}
                      <br />
                    </span>
                  ))}
                </>
              </CardDescription>
            </CardHeader>

            <CardFooter>
              {selectedGestes.includes(geste.id) ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="mx-auto"
                  disabled={pending}
                  onClick={() => {
                    setSelectedGestes((prev) => prev.filter((id) => id !== geste.id));
                  }}
                >
                  <XIcon /> Supprimer
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="success"
                  size="sm"
                  className="mx-auto"
                  disabled={pending}
                  onClick={() => {
                    setSelectedGestes((prev) => [...prev, geste.id]);
                  }}
                >
                  <PlusIcon /> Ajouter
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Button className="mt-8 w-full" disabled={pending}>
        {pending
          ? <><Spinner data-icon="inline-start" /> Calcul...</>
          : "Valider"
        }
      </Button>
    </form>
  );
}
