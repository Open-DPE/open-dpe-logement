import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { useStore } from "@nanostores/react";
import { $user } from "../stores/user";
import Logo from "@svg/ambassadeur-renov.svg";
import LogoWhite from "@svg/ambassadeur-renov-white.svg";
import { Button } from "./ui/button";
import { Toaster } from "./ui/sonner"
import { ScrollToTop } from "./scroll-to-top";
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CircleQuestionMarkIcon,
  HousePlusIcon,
  MoveLeftIcon,
  ShieldUserIcon,
  TargetIcon,
  ToolboxIcon
} from "lucide-react"

interface Props {
  children: ReactNode;
  prev?: boolean;
}

export function Layout({ children, prev }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const toastShown = useRef(false);
  const { diagnostic } = useStore($user);

  useEffect(() => {
    if (location.state?.toast && !toastShown.current) {
      toastShown.current = true;
      toast.success(location.state.toast);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  return (
    <>
      <header className="sticky w-full top-0 left-0 right-0 bg-primary z-10 h-[48px] md:h-[60px]">
        <div className="flex items-center justify-between h-full gap-4 p-2 md:p-4 max-w-[1024px] m-auto">
          {
            prev && (
              <Button variant="ghost" size="icon" className="text-white" onClick={() => navigate(-1)}>
                <MoveLeftIcon size={20} />
              </Button>
            )
          }
          <NavLink to="/" viewTransition>
            <img src={LogoWhite} alt="Logo Ambassadeur Rénov'" className="w-[160px] md:w-[180px]" />
          </NavLink>

          <div className="flex items-center gap-4 text-white">
            <Dialog>
              <DialogTrigger>
                <CircleQuestionMarkIcon size={20} />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader className="text-center">
                  <DialogTitle>
                    <img src={Logo} alt="Logo Ambassadeur Rénov'" className="w-[160px] md:w-[180px] m-auto" />
                  </DialogTitle>
                  <DialogDescription>
                    Comment ça marche ?
                  </DialogDescription>
                </DialogHeader>
                <p>
                  Cette application vous permet d'évaluer l'impact énergétique et carbone d'un plan de
                  rénovation pour un logement. Vous pouvez modifier les caractéristiques d'un logement,
                  sélectionner des scénarios de rénovation, et obtenir un diagnostic personnalisé.
                  <br /><br />
                  Les résultats sont basés sur la méthode de calcul officielle, vous permettant de comprendre
                  l'impact de vos choix de rénovation sur la performance énergétique et l'empreinte carbone
                  d'un logement.
                </p>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger>
                <ShieldUserIcon size={20} />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader className="text-center">
                  <DialogTitle>Protection de vos données personnelles</DialogTitle>
                </DialogHeader>

                <p>Votre vie privée compte. Ce site ne collecte aucune donnée personnelle. Aucun cookie de suivi n'est utilisé, aucune information d'identification n'est demandée, et rien n'est partagé avec des tiers. Votre navigation reste totalement anonyme.</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-[768px] m-auto py-8 px-4 min-h-screen">
        {children}
      </main>

      <nav className="sticky navbar w-full bottom-0 left-0 right-0 md:w-auto bg-white shadow-2xl">
        <div className="rounded-md grid grid-flow-col items-center justify-center gap-8 p-2">
          <Button variant="ghost" className="py-6" asChild>
            <NavLink to="/mon-logement" className="flex flex-col" viewTransition>
              <HousePlusIcon size={20} />
              <span className="font-medium text-xs">Mon logement</span>
            </NavLink>
          </Button>
          {
            diagnostic ? (
              <Button variant="ghost" className="py-6" asChild>
                <NavLink to="/mes-travaux" className="flex flex-col" viewTransition>
                  <TargetIcon size={20} />
                  <span className="font-medium text-xs">Mes travaux</span>
                </NavLink>
              </Button>
            ) : (
              <Button variant="ghost" className="py-6 flex flex-col" disabled>
                <TargetIcon size={20} />
                <span className="font-medium text-xs">Mes travaux</span>
              </Button>
            )
          }
          <Button variant="ghost" className="py-6" asChild>
            <NavLink to="/ressources" className="flex flex-col" viewTransition>
              <ToolboxIcon size={20} />
              <span className="font-medium text-xs">Ressources</span>
            </NavLink>
          </Button>
        </div>
      </nav >

      <ScrollToTop />
      <Toaster />
    </>
  );
}
