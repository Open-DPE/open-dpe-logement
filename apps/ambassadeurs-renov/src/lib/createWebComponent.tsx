import { useRef, useEffect, createElement } from "react";

type EventMap = Record<string, (detail: unknown) => void>;
type Props = Record<string, unknown>;

export function createWebComponent(tagName: string) {
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
          el.removeEventListener(event, listener)
        );
      };
    }, [events]);

    const stringProps = Object.fromEntries(
      Object.entries(props).filter(([, v]) => typeof v !== "object")
    );

    return createElement(tagName, { ref, ...stringProps });
  };
}