import { useEffect } from "react";
import { useNavigate } from "react-router";
import { $user } from "../stores/user";
import { Layout } from "@/components/layout";
import { GestesForm } from "@/components/forms";

export function MesTravaux() {
  const navigate = useNavigate();
  const { diagnostic } = $user.get();

  useEffect(() => {
    if (null === diagnostic) {
      navigate("/mon-logement", { viewTransition: true });
    }
  }, [diagnostic, navigate]);

  function handleSuccess() {
    navigate("/apres", { viewTransition: true, state: { toast: "Gestes mis à jour" } });
  }

  return (
    <Layout prev>
      <header className="mb-8 text-center">
        <h1 className="font-medium text-lg">Mes travaux</h1>
        <p>
          Évaluez l'impact de vos travaux sur la performance de votre logement.
        </p>
      </header>

      <GestesForm onSuccess={handleSuccess} />
    </Layout>
  );
}
