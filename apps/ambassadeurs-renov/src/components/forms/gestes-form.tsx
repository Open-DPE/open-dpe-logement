
import { useState } from "react";
import { gestes } from "../../models/geste";
import { useUserStore } from "../../stores/user";
import { changeGestes } from "../../handlers/change-gestes";
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
    if (!diagnostic) return null;
    setPending(true);

    const response = await changeGestes({ diagnostic, gestesIDs: selectedGestes });
    const { success, message } = response;

    if (success) {
      toast.success(message);
      onSuccess();
    } else {
      toast.error(message);
    }
    setPending(false);
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
