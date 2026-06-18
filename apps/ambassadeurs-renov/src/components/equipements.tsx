import * as models from "@open-dpe-logement/models";
import { IconUsage, IconEnergie } from "./web"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface Props {
  data: models.diagnostic.DiagnosticWithData;
  className?: string;
}

export function Equipements({ data, className = "" }: Props) {
  const generateursVentilation = data.ventilation.installations
    .filter((installation: models.ventilation.installation.InstallationWithData) => false === models.ventilation.installation.isVentilationNaturelle(installation))

  return (
    <ScrollArea className={className}>
      <table className="table text-center">
        <thead>
          <tr>
            <th>USAGE</th>
            <th className="text-left">DESCRIPTION</th>
            <th>ENERGIE</th>
          </tr>
        </thead>
        <tbody>
          {data.chauffage.generateurs.map((item: models.chauffage.generateur.GenerateurWithData) => (
            <tr key={item.id}>
              <td><IconUsage value="chauffage" className="icon-primary" /></td>
              <td className="w-full text-left">{item.description}</td>
              <td>{item.energie ? <IconEnergie value={item.energie} className="icon-primary" /> : "-"}</td>
            </tr>
          ))}
          {data.ecs.generateurs.map((item: models.ecs.generateur.GenerateurWithData) => (
            <tr key={item.id}>
              <td><IconUsage value="ecs" className="icon-primary" /></td>
              <td className="w-full text-left">{item.description}</td>
              <td>{item.energie ? <IconEnergie value={item.energie} className="icon-primary" /> : "-"}</td>
            </tr>
          ))}
          {data.refroidissement.generateurs.map((item: models.refroidissement.generateur.GenerateurWithData) => (
            <tr key={item.id}>
              <td><IconUsage value="refroidissement" className="icon-primary" /></td>
              <td className="w-full text-left">{item.description}</td>
              <td>{item.energie ? <IconEnergie value={item.energie} className="icon-primary" /> : "-"}</td>
            </tr>
          ))}
          {generateursVentilation.map((item: models.ventilation.installation.InstallationWithData) => (
            <tr key={item.id}>
              <td><IconUsage value="auxiliaire" className="icon-primary" /></td>
              <td className="w-full text-left">{item.description}</td>
              <td><IconEnergie value="electricite" className="icon-primary" /></td>
            </tr>
          ))}
        </tbody>
      </table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}