import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  title: string;
  className?: string;
}

export function DataItem({ children, title, className = "" }: Props) {
  return (
    <div className={`flex items-center gap-4 h-[40px] ${className}`}>
      <span className="grow">{title}</span>
      {children}
    </div>
  )
}
