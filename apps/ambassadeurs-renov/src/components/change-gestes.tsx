import { useState } from "react";
import * as models from "@open-dpe-logement/models";
import { createContext, services } from "@open-dpe-logement/engine";
import { gestes, withGeste } from "../models/geste";
import { $user, setSimulation } from "../stores/user";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { XIcon, PlusIcon } from "lucide-react"
import { IconGeste } from "./icon-geste";

interface Props {
  className?: string;
}

export function ChangeGestes({ className = "" }: Props) {
  const { diagnostic, gestes: gestesIds } = $user.get();
  const [pending, setPending] = useState(false);
  const [selectedGestes, setSelectedGestes] = useState<string[]>(() =>
    gestes.filter((geste) => gestesIds.includes(geste.id)).map((geste) => geste.id),
  );

  if (!diagnostic) {
    return null;
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    if (!diagnostic) {
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
    setPending(true);

    let data = structuredClone(diagnostic) as models.diagnostic.Diagnostic;

    for (const gesteId of selectedGestes) {
      const geste = gestes.find((g) => g.id === gesteId);
      if (geste) {
        data = withGeste(data, geste);
      }
    }

    try {
      const context = createContext(data);
      const simulation = services.diagnostic.calcule(context);
      setSimulation(simulation, selectedGestes);
      setPending(false);
      toast.success("Gestes mis à jour");
    } catch (error) {
      console.error(error, data);
      toast.error("Une erreur est survenue lors de la simulation.");
      setPending(false);
      return;
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
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
