import { useNavigate } from "react-router";
import { Layout } from "@/components/layout/layout";
import { RechercheDpeForm, ScenarioForm } from "@/components/forms";
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MonLogement() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/", { viewTransition: true });
  }

  return (
    <Layout prev>
      <header className="mb-8 text-center">
        <h1 className="font-medium text-lg">Mon logement</h1>
        <p>Évaluez la performance énergétique de votre logement.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Rechercher un Diagnostic de Performance Énergétique (DPE) existant</CardTitle>
          <CardDescription>Renseignez votre adresse et sélectionnez un DPE dans la liste.</CardDescription>
        </CardHeader>

        <CardContent>
          <RechercheDpeForm onSuccess={handleSuccess} />
        </CardContent>

      </Card>

      <Marker variant="separator" className="my-8">
        <MarkerContent>ou</MarkerContent>
      </Marker>

      <Card>
        <CardHeader>
          <CardTitle>Utiliser un scénario prédéfini</CardTitle>
          <CardDescription>Sélectionnez un scénario dans la liste et configurez-le selon vos besoins.</CardDescription>
        </CardHeader>
        <CardContent>
          <ScenarioForm onSuccess={handleSuccess} />
        </CardContent>
      </Card>

    </Layout>
  )
}
