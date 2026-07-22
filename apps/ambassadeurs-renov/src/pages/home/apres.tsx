import { Comparaison, Consommations, Deperditions, Enveloppe, Equipements, Parois } from "@/components/features/dpe";
import { useUser } from "@/hooks/use-user";

export function Apres() {
  const { diagnostic, simulation } = useUser();
  if (!diagnostic || !simulation) return null;

  return (
    <>
      <Comparaison avant={diagnostic} apres={simulation} />
      <Consommations data={simulation} />
      <Enveloppe data={simulation} />
      <Deperditions data={simulation} />
      <Parois data={simulation} />
      <Equipements data={simulation} />
    </>
  );
}
