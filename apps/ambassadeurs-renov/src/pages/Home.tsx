import { useStore } from "@nanostores/react";
import { $user } from "../stores/user";
import { Layout } from "@/components/layout";
import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dpe } from "@/components/dpe";

export function Home() {
  const { diagnostic, simulation } = useStore($user);

  return (
    <Layout>
      <section className="mb-8">
        <header className="text-center">
          <h1 className="text-2xl font-medium">
            Ambassadeur Rénov'
          </h1>
          <h2>
            Tout comprendre sur la performance énergétique des logements et les gestes pour l'améliorer.
          </h2>
        </header>
      </section>

      <section className="max-w-[768px] m-auto">
        <Tabs defaultValue="avant">
          <TabsList className="w-full max-w-[640px] m-auto mb-4">
            <TabsTrigger className="cursor-pointer" value="avant">
              Avant travaux
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="apres" disabled={!simulation}>
              Après travaux
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="comparaison" disabled={!simulation}>
              Comparaison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="avant">
            {diagnostic ? <Dpe data={diagnostic} /> : (
              <Alert>
                <AlertCircleIcon />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>Impossible de charger le diagnostic.</AlertDescription>
              </Alert>
            )}
          </TabsContent>
          <TabsContent value="apres">
            <p>Contenu de l'onglet "Après"</p>
          </TabsContent>
          <TabsContent value="comparaison">
            <p>Contenu de l'onglet "Comparaison"</p>
          </TabsContent>
        </Tabs>
      </section>

    </Layout>
  );
}
