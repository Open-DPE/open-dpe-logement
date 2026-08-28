# @open-dpe-logement/ademe-client

Client HTTP typé pour l'API REST publique de l'[observatoire DPE-Audit](https://eu1.anypoint.mulesoft.com/exchange/portals/ademe/) (ADEME) : récupère le XML brut d'un DPE / Audit à partir de son numéro, le normalise en objet JS ([`ademe-parser`](../ademe-parser)) puis le valide contre les schémas ([`ademe-models`](../ademe-models)). `fetchDPE`/`fetchAudit` retournent directement l'objet validé, jamais le XML brut.

> Positionnement dans le monorepo : ce package orchestre l'appel API et la politique de versions supportées (`NotSupportedError` sur les versions DPE/Audit 1.x, obsolètes). La normalisation XML → objet JS est déléguée à [`packages/ademe-parser`](../ademe-parser) (réutilisé tel quel par `ademe-models` pour ses propres tests sur fixtures, sans dépendre de ce package), et la validation de schéma à [`packages/ademe-models`](../ademe-models). La conversion vers le schéma interne du projet est à la charge de [`packages/ademe-mapper`](../ademe-mapper).

## Installation

```sh
npm i @open-dpe-logement/ademe-client
```

## Usage

```ts
import { fetchDPE, fetchAudit } from "@open-dpe-logement/ademe-client";

try {
  const dpe = await fetchDPE("2233E1234567A", {
    client_id: "xxxxxxx",
    client_secret: "xxxxxxx",
  });
} catch (e) {
  console.log(e)
}

try {
  const audit = await fetchAudit("2233E1234567A", {
    client_id: "xxxxxxx",
    client_secret: "xxxxxxx",
  });
} catch (e) {
  console.log(e)
}
```

## Tests

```sh
npm run test
```

## Scripts

| Commande              | Effet                                        |
| --------------------- | -------------------------------------------- |
| `npm run build`       | Compile `src/` → `dist/` (types + JS, `tsc`) |
| `npm run check-types` | Vérification TypeScript sans émission        |
| `npm run test`        | Lance la suite Vitest                        |
