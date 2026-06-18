import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
}

export function DataItem({ children, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-2 h-[40px] ${className}`}>
      {children}
    </div>
  )
}
