import { NavLink, Outlet, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";
import Action21Logo from "@svg/action21.svg";
import BTPCFAOccitanieLogo from "@svg/btp-cfa-occitanie.svg";
import CCCABTPLogo from "@svg/ccca-btp.svg";
import { cn } from "@/lib/utils"

export function Home() {
  const { diagnostic, simulation } = useUser();
  const location = useLocation();

  const tab = location.pathname.endsWith("/apres") ? "/apres" : "/";

  return (
    <Layout>
      <header className="mb-8 text-center">
        <h1 className="text-lg font-medium">Devenez un Ambassadeur de la rénovation énergétique</h1>
        <p>Evaluez l'impact énergétique et carbone d'un plan de rénovation en quelques minutes.</p>
      </header>

      <section>
        {
          diagnostic && (

            <Tabs value={tab}>
              <TabsList className="mx-auto">
                <TabsTrigger value="/" disabled={diagnostic === null} asChild>
                  <NavLink
                    to="/"
                    aria-disabled={diagnostic === null}
                    onClick={(e) => diagnostic === null && e.preventDefault()}
                    className={cn(diagnostic === null && "pointer-events-none opacity-50")}
                    end
                    viewTransition
                  >
                    Avant travaux
                  </NavLink>
                </TabsTrigger>
                <TabsTrigger value="/apres" asChild>
                  <NavLink
                    to="/apres"
                    aria-disabled={diagnostic === null || simulation === null}
                    onClick={(e) => (diagnostic === null || simulation === null) && e.preventDefault()}
                    className={cn((diagnostic === null || simulation === null) && "pointer-events-none opacity-50")}
                    viewTransition
                  >
                    Après travaux
                  </NavLink>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )
        }
        {
          null === diagnostic && (
            <div className="text-center">
              <Button asChild variant="default" size="lg" >
                <NavLink to="/mon-logement" viewTransition>Commencer</NavLink>
              </Button>
            </div>
          )
        }

        <div className="flex flex-col gap-4 mt-4">
          <Outlet />
        </div>
      </section>

      <footer className="mt-12 text-center">
        <div className="px-14 py-6 grid gap-8 grid-flow-col items-center text-center justify-center">
          <a href="https://action21.fr/" target="_blank" rel="noopener noreferrer">
            <img src={Action21Logo} alt="Action 21" className="w-[120px]" />
          </a>
          <a href="https://www.btpcfa-occitanie.com/" target="_blank" rel="noopener noreferrer">
            <img src={BTPCFAOccitanieLogo} alt="BTP CFA Occitanie" className="w-[120px]" />
          </a>
          <a href="https://www.ccca-btp.fr/" target="_blank" rel="noopener noreferrer">
            <img src={CCCABTPLogo} alt="CCCA BTP" className="w-[120px]" />
          </a>
        </div>
      </footer>
    </Layout>
  );
}
