import Action21Logo from "@svg/logos/action21.svg";
import BTPCFAOccitanieLogo from "@svg/logos/btp-cfa-occitanie.svg";

interface Props {
  className?: string;
}

export function Partenaires({ className = "" }: Props) {
  return (
    <div className={`px-14 py-6 ${className}`}>
      <div className="grid gap-8 grid-flow-col items-center">
        <img src={BTPCFAOccitanieLogo} alt="BTP CFA Occitanie" className="w-[120px]" />
        <img src={Action21Logo} alt="Action 21" className="w-[120px]" />
      </div>
    </div>
  );
}
