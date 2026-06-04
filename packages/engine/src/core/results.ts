import type { Results as BatimentResults } from "#rules/batiment/registry.js";
import type { Results as ChauffageResults } from "#rules/chauffage/registry.js";
import type { Results as ClimatResults } from "#rules/climat/registry.js";
import type { Results as EclairageResults } from "#rules/eclairage/registry.js";
import type { Results as EcsResults } from "#rules/ecs/registry.js";
import type { Results as EnveloppeResults } from "#rules/enveloppe/registry.js";
import type { Results as ProductionResults } from "#rules/production/registry.js";
import type { Results as RefroidissementResults } from "#rules/refroidissement/registry.js";
import type { Results as VentilationResults } from "#rules/ventilation/registry.js";

export type Results = BatimentResults &
	ChauffageResults &
	ClimatResults &
	EclairageResults &
	EcsResults &
	EnveloppeResults &
	ProductionResults &
	RefroidissementResults &
	VentilationResults;
