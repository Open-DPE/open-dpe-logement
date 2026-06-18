import { useStore } from "@nanostores/react";
import { $user } from "../stores/user";
import { NavLink } from "react-router-dom";
import Action21Logo from "@svg/action21.svg";
import BTPCFAOccitanieLogo from "@svg/btp-cfa-occitanie.svg";
import CCCABTPLogo from "@svg/ccca-btp.svg";
import { Layout } from "@/components/layout";
import { AvantApres } from "@/components/avant-apres";
import { Button } from "@/components/ui/button"
import { Dpe } from "@/components/dpe";

export function Home() {
  const { diagnostic, simulation } = useStore($user);

  console.log("Home", { diagnostic, simulation });

  return (
    <Layout>
      <header className="mb-8 text-center">
        <h1 className="text-lg font-medium">Devenez un Ambassadeur de la rénovation énergétique</h1>
        <p>Evaluez l'impact énergétique et carbone d'un plan de rénovation en quelques minutes.</p>

        {
          null === diagnostic && (
            <Button asChild variant="default" size="lg" className="mt-6">
              <NavLink to="/mon-logement" viewTransition>Commencer</NavLink>
            </Button>
          )
        }
      </header>

      {
        diagnostic && (<AvantApres hasDiagnostic={diagnostic !== null} hasSimulation={simulation !== null} />)
      }
      {
        diagnostic && (<Dpe data={diagnostic} />)
      }

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
