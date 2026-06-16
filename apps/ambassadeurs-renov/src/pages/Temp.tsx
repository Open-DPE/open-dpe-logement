import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Partenaires } from "../components/partenaires";
import Hero from "@svg/home-ambassadeur.svg";

export function Home() {
  return (
    <Layout>
      <section className="bg-color px-6 pt-12 pb-18">
        <div className="max-w-[1024px] m-auto">
          <div className="grid grid-flow-col items-center gap-6">
            <div className="grow grid grid-flow-row grid-rows-min gap-4 text-center md:text-left">
              <h1 className="text-2xl font-medium">
                Ambassadeur Rénov'
              </h1>
              <p className="text-lg">
                Evaluez l'impact{" "}
                <span className="color-primary font-semibold">
                  énergétique et carbone
                </span>{" "}
                d'un plan de rénovation en{" "}
                <span className="color-secondary font-semibold">
                  quelques minutes
                </span>
                .
              </p>
              <Link
                to="/mon-logement/formulaire"
                className="btn btn-md btn-primary w-3xs m-auto md:m-0 rounded-xl"
              >
                Commencer
              </Link>
            </div>
            <div className="grow hidden md:block">
              <img src={Hero} alt="Hero" className="w-full" />
            </div>
          </div>
        </div>
      </section>

      <section className="-mt-6">
        <Partenaires className="bg-white w-fit m-auto rounded-full" />
      </section>

      <section className="px-6 py-12">
        <div className="max-w-[1024px] m-auto grid gap-6 text-center">
          <h2 className="text-xl font-medium">
            Construisez le bâtiment de demain
          </h2>
          <p className="text-md">
            La <b className="text-primary">rénovation énergétique</b> est un
            enjeu majeur de la lutte contre le réchauffement climatique et
            raréfaction des ressources. Devenir Ambassadeur de la Rénovation, c'est contribuer
            activement à relever ce défi en{" "}
            <b className="text-primary">sensibilisant son entourage</b> aux
            gestes les plus efficaces pour réduire{" "}
            <b className="text-primary">l'empreinte énergétique et carbone</b>{" "}
            des logements.
          </p>
        </div>
      </section>
    </Layout>
  );
}