import { describe, expect, it } from 'vitest'
import { isEcs, type Ecs } from '../../src/ecs/ecs.js'
import { type ChauffeEauElectrique } from '../../src/ecs/generateur.js'
import { type Systeme } from '../../src/ecs/systeme.js'
import { type Installation } from '../../src/ecs/installation.js'
import { UUID, UUID2, p } from '../helpers.js'

const GENERATEUR: ChauffeEauElectrique = {
  id: UUID,
  description: 'Chauffe-eau électrique',
  type: 'chauffe_eau',
  energie: 'electricite',
  bienergie: null,
  annee_installation: 2010,
  position: {
    position_chauffe_eau: 'chauffe_eau_vertical',
    generateur_collectif: false,
    generateur_multi_batiment: false,
    position_volume_chauffe: false,
    generateur_mixte_id: null,
    reseau_chaleur_id: null,
  },
  stockage: { volume: 200, type: 'integre', position_volume_chauffe: false },
  signaletique: { pn: p(2.5), cop: null, label: null, mode_combustion: null, presence_ventouse: null, pveilleuse: null, qp0: null, rpn: null },
}

const SYSTEME: Systeme = {
  id: UUID2,
  description: 'Système ECS',
  generateur_id: UUID,
  reseau: { alimentation_contigue: true, niveaux_desservis: 1, isolation: null, bouclage: null },
}

const INSTALLATION: Installation = {
  id: UUID2,
  description: 'Installation ECS',
  surface: p(80),
  installation_collective: false,
  systemes: [SYSTEME],
  solaire_thermique: null,
}

describe('isEcs — guard', () => {
  it('accepte un ECS valide', () => {
    const ecs: Ecs = {
      generateurs: [GENERATEUR],
      installations: [INSTALLATION],
    }
    expect(isEcs(ecs)).toBe(true)
  })
})
