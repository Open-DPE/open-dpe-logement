import { describe, expect, it } from 'vitest'
import { isMur, type Mur } from '../../src/enveloppe/mur.js'
import { UUID, p, ISOLATION_SANS } from '../helpers.js'

describe('isMur — guard', () => {
  it('accepte un mur extérieur valide sans isolation connue', () => {
    const mur: Mur = {
      id: UUID,
      description: 'Mur façade nord',
      structures: [],
      type_doublage: null,
      presence_enduit_isolant: null,
      inertie: null,
      annee_construction: null,
      annee_renovation: null,
      u0: null,
      u: null,
      position: {
        surface: p(20),
        mitoyennete: 'exterieur',
        local_non_chauffe_id: null,
        orientation: 'nord',
      },
      isolation: ISOLATION_SANS,
    }
    expect(isMur(mur)).toBe(true)
  })

  it('accepte un mur avec structure et isolation connue', () => {
    const mur: Mur = {
      id: UUID,
      description: 'Mur isolé',
      structures: [{ materiau: 'brique_creuse', epaisseur: 200, materiau_ancien: false }],
      type_doublage: 'materiaux_connu',
      presence_enduit_isolant: false,
      inertie: 'lourde',
      annee_construction: 1970,
      annee_renovation: 2010,
      u0: p(1),
      u: p(1),
      position: {
        surface: p(15),
        mitoyennete: 'exterieur',
        local_non_chauffe_id: null,
        orientation: 'sud',
      },
      isolation: {
        etat: true,
        type: 'ite',
        annee_installation: 2010,
        epaisseur: p(100),
        resistance_thermique: p(3.5),
      },
    }
    expect(isMur(mur)).toBe(true)
  })
})
