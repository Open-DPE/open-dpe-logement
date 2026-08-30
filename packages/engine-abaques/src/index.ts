import * as chauffage from "./repositories/chauffage/index.js";
import * as climat from "./repositories/climat/index.js";
import * as diagnostic from "./repositories/diagnostic/index.js";
import * as eclairage from "./repositories/eclairage/index.js";
import * as ecs from "./repositories/ecs/index.js";
import * as enveloppe from "./repositories/enveloppe/index.js";
import * as performance from "./repositories/performance/index.js";
import * as production from "./repositories/production/index.js";
import * as refroidissement from "./repositories/refroidissement/index.js";
import * as ventilation from "./repositories/ventilation/index.js";

export { init } from "./cache.js";

export const abaques = {
	chauffage,
	climat,
	diagnostic,
	eclairage,
	ecs,
	enveloppe,
	performance,
	production,
	refroidissement,
	ventilation,
};

export type Abaques = typeof abaques;
