import { useStore } from "@nanostores/react";
import { useNavigate } from "react-router";
import { $user } from "../stores/user";
import { Layout } from "@/components/layout";
import { AvantApres } from "@/components/avant-apres";
import { Dpe } from "@/components/dpe";

export function Simulation() {
  const navigate = useNavigate();
  const { diagnostic, simulation } = useStore($user);

  if (diagnostic === null || simulation === null) {
    navigate("/mon-logement", { viewTransition: true });
    return;
  }

  return (
    <Layout>
      <header className="mb-8 text-center">
        <h1 className="text-lg font-medium">Devenez un Ambassadeur de la rénovation énergétique</h1>
        <p>Evaluez l'impact énergétique et carbone d'un plan de rénovation en quelques minutes.</p>
      </header>

      <AvantApres hasDiagnostic={true} hasSimulation={true} />

      <Dpe data={simulation} />
    </Layout>
  );
}
