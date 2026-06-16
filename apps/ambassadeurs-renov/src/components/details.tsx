

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Details({ children, title = "Légende", className = "" }: Props) {
  return (
    <details className={`rounded-sm mt-6 p-4 cursor-pointer ${className}`}>
      <summary className="font-medium">{title}</summary>
      <div className="mt-4">{children}</div>
    </details>
  )
}
