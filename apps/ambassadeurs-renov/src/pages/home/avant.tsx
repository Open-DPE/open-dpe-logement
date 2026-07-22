import { Consommations, Deperditions, Enveloppe, Equipements, Parois, Performance } from "@/components/features/dpe";
import { useUser } from "@/hooks/use-user";

export function Avant() {
  const { diagnostic } = useUser();
  if (!diagnostic) return null;

  return (
    <>
      <Performance data={diagnostic} />
      <Consommations data={diagnostic} />
      <Enveloppe data={diagnostic} />
      <Deperditions data={diagnostic} />
      <Parois data={diagnostic} />
      <Equipements data={diagnostic} />
    </>
  );
}
