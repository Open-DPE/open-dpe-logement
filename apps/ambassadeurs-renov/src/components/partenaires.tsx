import Action21Logo from "@svg/action21.svg";
import BTPCFAOccitanieLogo from "@svg/btp-cfa-occitanie.svg";
import CCCABTPLogo from "@svg/ccca-btp.svg";

interface Props {
  className?: string;
}

export function Partenaires({ className = "" }: Props) {
  return (
    <div className={`px-14 py-6 ${className}`}>
      <div className="grid gap-8 grid-flow-col items-center">
        <a href="https://action21.fr/" target="_blank" rel="noopener noreferrer">
          <img src={Action21Logo} alt="Action 21" className="w-[120px]" />
        </a>
        <a href="https://www.btpcfa-occitanie.com/" target="_blank" rel="noopener noreferrer">
          <img src={BTPCFAOccitanieLogo} alt="BTP CFA Occitanie" className="w-[120px]" />
        </a>
        <a href="https://www.ccca-btp.fr/" target="_blank" rel="noopener noreferrer">
          <img src={CCCABTPLogo} alt="CCCA BTP" className="w-[120px]" />
        </a>
      </div>
    </div>
  );
}
