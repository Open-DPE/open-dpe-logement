import ChauffageIcon from "@/assets/icons/chauffage.svg";
import ECSIcon from "@/assets/icons/ecs.svg";
import IsolationBaiesIcon from "@/assets/icons/isolation-baies.svg";
import IsolationMursIcon from "@/assets/icons/isolation-murs.svg";
import IsolationPlanchersBasIcon from "@/assets/icons/isolation-planchers-bas.svg";
import IsolationPlanchersHautsIcon from "@/assets/icons/isolation-planchers-hauts.svg";
import IsolationPortesIcon from "@/assets/icons/isolation-portes.svg";
import ProductionIcon from "@/assets/icons/production.svg";
import ProtectionSolaireIcon from "@/assets/icons/protection-solaire.svg";
import RefroidissementIcon from "@/assets/icons/refroidissement.svg";
import VentilationIcon from "@/assets/icons/ventilation.svg";

interface Props {
  geste: string;
  className?: string;
}

export function IconGeste({ geste, className = "" }: Props) {
  switch (geste) {
    case "chauffage":
      return <img src={ChauffageIcon} className={className} />;
    case "ecs":
      return <img src={ECSIcon} className={className} />;
    case "isolation-murs":
      return <img src={IsolationMursIcon} className={className} />;
    case "isolation-planchers-bas":
      return <img src={IsolationPlanchersBasIcon} className={className} />;
    case "isolation-planchers-hauts":
      return <img src={IsolationPlanchersHautsIcon} className={className} />;
    case "isolation-baies":
      return <img src={IsolationBaiesIcon} className={className} />;
    case "isolation-portes":
      return <img src={IsolationPortesIcon} className={className} />;
    case "production":
      return <img src={ProductionIcon} className={className} />;
    case "protection-solaire":
      return <img src={ProtectionSolaireIcon} className={className} />;
    case "refroidissement":
      return <img src={RefroidissementIcon} className={className} />;
    case "ventilation":
      return <img src={VentilationIcon} className={className} />;
    default:
      return null;
  }
}
