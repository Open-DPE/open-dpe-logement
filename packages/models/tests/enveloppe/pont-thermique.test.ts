import { describe, expect, it } from 'vitest'
import {
  isPontThermique,
  type PontThermique,
  type RefendMur,
  type PlancherBasMur,
  type BaieMur,
} from '../../src/enveloppe/pont-thermique.js'
import { UUID, UUID2 } from '../helpers.js'

describe('isPontThermique — guard', () => {
  it('accepte un pont thermique refend-mur', () => {
    const liaison: RefendMur = {
      type: 'refend_mur',
      mur_id: UUID2,
      plancher_id: null,
      ouverture_id: null,
      pont_thermique_partiel: false,
    }
    const pt: PontThermique = {
      id: UUID,
      description: 'Pont thermique refend-mur',
      longueur: 2.5,
      kpt: null,
      liaison,
    }
    expect(isPontThermique(pt)).toBe(true)
  })

  it('accepte un pont thermique plancher-bas-mur', () => {
    const liaison: PlancherBasMur = {
      type: 'plancher_bas_mur',
      mur_id: UUID2,
      plancher_id: UUID2,
      ouverture_id: null,
      pont_thermique_partiel: false,
    }
    const pt: PontThermique = {
      id: UUID,
      description: 'Liaison plancher bas - mur',
      longueur: 10,
      kpt: 0.5,
      liaison,
    }
    expect(isPontThermique(pt)).toBe(true)
  })

  it('accepte un pont thermique baie-mur', () => {
    const liaison: BaieMur = {
      type: 'baie_mur',
      mur_id: UUID2,
      plancher_id: null,
      ouverture_id: UUID2,
      pont_thermique_partiel: false,
    }
    const pt: PontThermique = {
      id: UUID,
      description: 'Liaison baie - mur',
      longueur: 3,
      kpt: 0.1,
      liaison,
    }
    expect(isPontThermique(pt)).toBe(true)
  })
})
