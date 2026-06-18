import { NavLink } from "react-router-dom";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

interface Props {
  hasDiagnostic: boolean;
  hasSimulation: boolean;
}

export function AvantApres({ hasDiagnostic, hasSimulation }: Props) {
  const { pathname } = useLocation();

  return (
    <nav>
      <ButtonGroup className="mb-8 w-full">
        {
          hasDiagnostic && (
            <Button
              variant={pathname === "/" ? "default" : "outline"}
              className="grow"
              asChild
            >
              <NavLink to="/" viewTransition>Avant travaux</NavLink>
            </Button>
          )
        }
        {
          !hasDiagnostic && (
            <Button variant="outline" disabled className="grow">
              Avant travaux
            </Button>
          )
        }
        {
          hasSimulation && (
            <Button
              variant={pathname === "/simulation" ? "default" : "outline"}
              className="grow"
              asChild
            >
              <NavLink to="/simulation" viewTransition>Après travaux</NavLink>
            </Button>
          )
        }
        {
          !hasSimulation && (
            <Button variant="outline" disabled className="grow">
              Après travaux
            </Button>
          )
        }
      </ButtonGroup>
    </nav>
  )
}
