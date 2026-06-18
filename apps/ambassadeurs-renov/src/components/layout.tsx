import type { ReactNode } from "react";
import Logo from "@svg/ambassadeur-renov.svg";
import LogoWhite from "@svg/ambassadeur-renov-white.svg";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  CircleQuestionMarkIcon,
  HousePlusIcon,
  ShieldUserIcon,
  TargetIcon,
  ToolboxIcon
} from "lucide-react"
import { Ressources } from "./ressources";
import { Partenaires } from "./partenaires";
import { ChangeScenario } from "./change-scenario";
import { ChangeGestes } from "./change-gestes";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  return (
    <>
      <header className="sticky w-full top-0 left-0 right-0 bg-primary z-10 h-[48px] md:h-[60px]">
        <div className="flex items-center justify-between h-full gap-4 p-2 md:p-4 max-w-[1024px] m-auto">
          <img src={LogoWhite} alt="Logo Ambassadeur Rénov'" className="w-[160px] md:w-[180px]" />

          <div className="flex items-center gap-4 text-white">
            <Sheet>
              <SheetTrigger>
                <CircleQuestionMarkIcon size={20} />
              </SheetTrigger>

              <SheetContent side="bottom" className="!h-screen !max-h-screen p-4 md:!h-[75vh] md:!max-h-[75vh] text-center">
                <SheetHeader className="text-center mt-4">
                  <SheetTitle>
                    <img src={Logo} alt="Logo Ambassadeur Rénov'" className="w-[160px] md:w-[180px] m-auto" />
                  </SheetTitle>
                  <SheetDescription>
                    Un projet Open Source gratuit et libre d'accès
                  </SheetDescription>
                </SheetHeader>
                <div className="w-full max-w-[768px] m-auto p-4 no-scrollbar overflow-y-auto">
                  <p>
                    La rénovation énergétique est un enjeu majeur de la lutte contre le réchauffement climatique et
                    raréfaction des ressources. Ce projet vise à sensibiliser le plus grand nombre aux gestes 
                    les plus efficaces pour réduire l'empreinte énergétique et carbone des logements.
                  </p>
                  <Partenaires />
                </div>
              </SheetContent>
            </Sheet>

            <Dialog>
              <DialogTrigger>
                <ShieldUserIcon size={20} />
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Protection de vos données personnelles</DialogTitle>
                </DialogHeader>

                <p>Votre vie privée compte. Ce site ne collecte aucune donnée personnelle. Aucun cookie de suivi n'est utilisé, aucune information d'identification n'est demandée, et rien n'est partagé avec des tiers. Votre navigation reste totalement anonyme.</p>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <main className="max-w-[1024px] m-auto py-8 px-4 min-h-screen">
        {children}
      </main>

      <nav className="sticky w-full h-[56px] bottom-0 left-0 right-0 md:w-auto bg-white shadow-2xl">
        <div className="rounded-md grid grid-flow-col items-center justify-center gap-8 p-2">
          <Sheet>
            <SheetTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <HousePlusIcon size={20} />
                <span className="font-medium text-xs">Mon logement</span>
              </div>
            </SheetTrigger>

            <SheetContent side="bottom" className="!h-screen !max-h-screen p-4 md:!h-[75vh] md:!max-h-[75vh]">
              <SheetHeader className="text-center mt-4">
                <SheetTitle>Mon logement</SheetTitle>
                <SheetDescription>
                  Modifiez les caractéristiques de votre logement pour obtenir un diagnostic personnalisé.
                </SheetDescription>
              </SheetHeader>

              <div className="w-full max-w-[540px] m-auto p-4 no-scrollbar overflow-y-auto">
                <ChangeScenario />

                <SheetFooter className="px-0">
                  <SheetClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <TargetIcon size={20} />
                <span className="font-medium text-xs">Mes gestes</span>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="!h-screen !max-h-screen p-4 md:!h-[75vh] md:!max-h-[75vh]">
              <SheetHeader className="text-center mt-4">
                <SheetTitle>Modifiez vos gestes</SheetTitle>
                <SheetDescription>
                  Évaluez l'impact de vos gestes sur la performance de votre logement.
                </SheetDescription>
              </SheetHeader>
              <div className="w-full max-w-[768px] m-auto p-4 no-scrollbar overflow-y-auto">
                <ChangeGestes />

                <SheetFooter className="px-0">
                  <SheetClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <ToolboxIcon size={20} />
                <span className="font-medium text-xs">Ressources</span>
              </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="!h-screen !max-h-screen p-4 md:!h-[75vh] md:!max-h-[75vh]">
              <SheetHeader className="text-center mt-4">
                <SheetTitle>Outils et ressources</SheetTitle>
                <SheetDescription>
                  Vidéos, podcasts, quizz ou services pour me former à la rénovation énergétique.
                </SheetDescription>
              </SheetHeader>
              <div className="w-full max-w-[768px] m-auto p-4 no-scrollbar overflow-y-auto">
                <Ressources />
                <SheetFooter className="px-0">
                  <SheetClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </SheetClose>
                </SheetFooter>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      <Toaster />
    </>
  );
}
