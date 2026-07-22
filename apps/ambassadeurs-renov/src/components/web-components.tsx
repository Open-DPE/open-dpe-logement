import { useRef, useEffect, createElement } from "react";

type EventMap = Record<string, (detail: unknown) => void>;
type Props = Record<string, unknown>;

function createWebComponent(tagName: string) {
  return function WebComponent(allProps: Props & { events?: EventMap }) {
    const { events, ...props } = allProps;
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      const el = ref.current as (HTMLElement & Record<string, unknown>) | null;
      if (!el) return;

      Object.entries(props).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          el[key] = value;
        }
      });
    }, [props]);

    useEffect(() => {
      const el = ref.current;
      if (!el || !events) return;

      const handlers = Object.entries(events).map(([event, handler]) => {
        const listener = (e: Event) => handler((e as CustomEvent).detail);
        el.addEventListener(event, listener);
        return { event, listener };
      });

      return () => {
        handlers.forEach(({ event, listener }) =>
          el.removeEventListener(event, listener),
        );
      };
    }, [events]);

    const stringProps = Object.fromEntries(
      Object.entries(props).filter(([, v]) => typeof v !== "object"),
    );

    return createElement(tagName, { ref, ...stringProps });
  };
}

export const ClasseClimat = createWebComponent("open-dpe-logement-classe-climat");
export const ClasseEnergie = createWebComponent("open-dpe-logement-classe-energie");
export const ConfortEte = createWebComponent("open-dpe-logement-confort-ete");
export const Enum = createWebComponent("open-dpe-logement-enum");
export const Etiquette = createWebComponent("open-dpe-logement-etiquette");
export const EtiquetteClimat = createWebComponent("open-dpe-logement-etiquette-climat");
export const EtiquetteEnergie = createWebComponent("open-dpe-logement-etiquette-energie");
export const IconConfortEte = createWebComponent("open-dpe-logement-icon-confort-ete");
export const IconEnergie = createWebComponent("open-dpe-logement-icon-energie");
export const Icon = createWebComponent("open-dpe-logement-icon");
export const IconUsage = createWebComponent("open-dpe-logement-icon-usage");
export const PerformanceEnveloppe = createWebComponent("open-dpe-logement-performance-enveloppe");
export const PerformanceMenuiserie = createWebComponent("open-dpe-logement-performance-menuiserie");
export const PerformanceMur = createWebComponent("open-dpe-logement-performance-mur");
export const PerformancePlancherBas = createWebComponent("open-dpe-logement-performance-plancher-bas");
export const PerformancePlancherHaut = createWebComponent("open-dpe-logement-performance-plancher-haut");
export const RepartitionDeperditions = createWebComponent("open-dpe-logement-repartition-deperditions");
