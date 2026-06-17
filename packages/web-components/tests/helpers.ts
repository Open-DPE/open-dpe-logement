export function mount(el: HTMLElement): { el: HTMLElement; unmount: () => void } {
  document.body.appendChild(el);
  return {
    el,
    unmount: () => {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },
  };
}

export function shadow(el: HTMLElement): string {
  return el.shadowRoot?.innerHTML ?? "";
}
