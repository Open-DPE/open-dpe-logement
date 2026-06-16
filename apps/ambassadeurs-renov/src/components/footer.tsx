import { Link } from "react-router-dom";

export function Footer() {
  return (
    <div className="pb-[54px] md:pb-0">
      <footer className="py-6 bg-primary text-white">
        <div className="w-[90%] md:w-full md:max-w-7xl m-auto">
          <div className="grid gap-2">
            <Link to="/a-propos">Qui sommes-nous ?</Link>
            <Link to="/mentions-legales">Mentions légales</Link>
            <a href="https://github.com/Open-DPE/open-dpe-logement" target="_blank" rel="noopener noreferrer">
              Github
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
