import ChauffageIcon from "@/assets/icons/poste/chauffage.svg";
import ECSIcon from "@/assets/icons/poste/ecs.svg";
import IsolationMenuiseriesIcon from "@/assets/icons/poste/isolation-menuiseries.svg";
import IsolationMursIcon from "@/assets/icons/poste/isolation-murs.svg";
import IsolationPlanchersBasIcon from "@/assets/icons/poste/isolation-planchers-bas.svg";
import IsolationPlanchersHautsIcon from "@/assets/icons/poste/isolation-planchers-hauts.svg";
import ProductionIcon from "@/assets/icons/poste/production.svg";
import ProtectionSolaireIcon from "@/assets/icons/poste/protection-solaire.svg";
import RefroidissementIcon from "@/assets/icons/poste/refroidissement.svg";
import VentilationIcon from "@/assets/icons/poste/ventilation.svg";

interface Props {
  poste: string;
  className?: string;
}

export function IconPoste({ poste, className = "" }: Props) {
  switch (poste) {
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
    case "isolation-menuiseries":
      return <img src={IsolationMenuiseriesIcon} className={className} />;
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
