import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface Props {
  title: string;
  children: ReactNode;
  dialog?: ReactNode;
  className?: string;
}

export function DataCard({ title, children, dialog, className = "" }: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-md text-center">
          {title}
          {dialog && dialog}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}
