import { useState } from "react";
import type { ReactNode } from "react";
import LogoWhite from "@svg/logos/ambassadeur-renov-white.svg";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  CircleQuestionMarkIcon,
  HousePlusIcon,
  ShieldUserIcon,
  TargetIcon,
  ToolboxIcon
} from "lucide-react"
import { Ressources } from "./ressources";
import { ChangeScenario } from "./change-scenario";

interface Props {
  children: ReactNode;
}

export function Layout({ children }: Props) {
  const [scenarioOpen, setScenarioOpen] = useState(false);


  return (
    <>
      <header className="fixed w-full top-0 left-0 right-0 bg-primary z-10 h-[48px] md:h-[60px]">
        <div className="flex items-center justify-between h-full gap-4 p-2 md:p-4 max-w-[1024px] m-auto">
          <img src={LogoWhite} alt="Logo Ambassadeur Rénov'" className="w-[160px] md:w-[180px]" />

          <div className="flex items-center gap-4 text-white">
            <CircleQuestionMarkIcon size={20} />
            <ShieldUserIcon size={20} />
          </div>
        </div>
      </header>

      <main className="max-w-[1024px] m-auto mt-[48px] mb-[56px] md:mt-[60px] py-8 px-4 min-h-screen">
        {children}
      </main>

      <nav className="fixed w-full h-[56px] bottom-0 left-0 right-0 md:w-auto bg-white shadow-2xl">
        <div className="rounded-md grid grid-flow-col items-center justify-center gap-8 p-2">
          <Drawer key="scenario" open={scenarioOpen} onOpenChange={setScenarioOpen}>
            <DrawerTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <HousePlusIcon size={20} />
                <span className="font-medium text-xs">Mon logement</span>
              </div>
            </DrawerTrigger>

            <DrawerContent className="!h-screen !max-h-screen">
              <DrawerHeader>
                <DrawerTitle>Mon logement</DrawerTitle>
                <DrawerDescription>
                  Modifiez les caractéristiques de votre logement pour obtenir un diagnostic personnalisé.
                </DrawerDescription>
              </DrawerHeader>

              <div className="w-full max-w-[540px] m-auto px-4 no-scrollbar overflow-y-auto">
                <ChangeScenario onSuccess={() => setScenarioOpen(false)} />

                <DrawerFooter className="w-full max-w-[540px] m-auto px-0">
                  <DrawerClose asChild>
                    <Button variant="outline">Fermer</Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>

          <Drawer key="gestes">
            <DrawerTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <TargetIcon size={20} />
                <span className="font-medium text-xs">Mes gestes</span>
              </div>
            </DrawerTrigger>
            <DrawerContent className="!h-screen !max-h-screen">
              <DrawerHeader>
                <DrawerTitle>Modifiez vos gestes</DrawerTitle>
                <DrawerDescription>
                  Set your daily activity goal.
                </DrawerDescription>
              </DrawerHeader>
              B
            </DrawerContent>
          </Drawer>


          <Drawer key="ressources">
            <DrawerTrigger asChild>
              <div className="flex flex-col items-center justify-center gap-1 cursor-pointer">
                <ToolboxIcon size={20} />
                <span className="font-medium text-xs">Ressources</span>
              </div>
            </DrawerTrigger>
            <DrawerContent className="!h-screen !max-h-screen">
              <DrawerHeader>
                <DrawerTitle>Outils et ressources</DrawerTitle>
                <DrawerDescription>
                  Vidéos, podcasts, quizz ou services pour me former à la rénovation énergétique.
                </DrawerDescription>
              </DrawerHeader>
              <div className="no-scrollbar overflow-y-auto p-4">
                <Ressources />
              </div>
              <DrawerFooter className="w-full max-w-[768px] m-auto px-4">
                <DrawerClose asChild>
                  <Button variant="outline">Fermer</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
      </nav >
    </>
  );
}
