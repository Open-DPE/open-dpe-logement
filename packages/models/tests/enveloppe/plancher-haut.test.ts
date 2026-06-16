import { describe, expect, it } from 'vitest'
import { isPlancherHaut, type PlancherHaut } from '../../src/enveloppe/plancher-haut.js'
import { UUID, p, ISOLATION_SANS } from '../helpers.js'

describe('isPlancherHaut — guard', () => {
  it('accepte une terrasse sans isolation connue', () => {
    const plancherHaut: PlancherHaut = {
      id: UUID,
      description: 'Toiture terrasse',
      configuration: 'terrasse',
      type: null,
      inertie: null,
      annee_construction: null,
      annee_renovation: null,
      u0: null,
      u: null,
      position: {
        surface: p(80),
        mitoyennete: 'exterieur',
        local_non_chauffe_id: null,
      },
      isolation: ISOLATION_SANS,
    }
    expect(isPlancherHaut(plancherHaut)).toBe(true)
  })

  it('accepte des rampants avec isolation', () => {
    const plancherHaut: PlancherHaut = {
      id: UUID,
      description: 'Combles sous rampants',
      configuration: 'rampants',
      type: 'combles_amenages_sous_rampant',
      inertie: 'legere',
      annee_construction: 1985,
      annee_renovation: 2015,
      u0: p(3.2),
      u: p(0.25),
      position: {
        surface: p(60),
        mitoyennete: 'exterieur',
        local_non_chauffe_id: null,
      },
      isolation: {
        etat: true,
        type: 'itr',
        annee_installation: 2015,
        epaisseur: p(200),
        resistance_thermique: p(6.5),
      },
    }
    expect(isPlancherHaut(plancherHaut)).toBe(true)
  })
})
