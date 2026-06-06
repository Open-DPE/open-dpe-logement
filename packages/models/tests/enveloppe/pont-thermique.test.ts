import { describe, expect, expectTypeOf, it } from 'vitest'
import { isPontThermique, type PontThermique, type Liaison } from '../../src/enveloppe/pont-thermique.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('PontThermique — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<PontThermique['id']>().toEqualTypeOf<UUID>()
  })

  it('longueur est un number requis', () => {
    expectTypeOf<PontThermique['longueur']>().toEqualTypeOf<number>()
  })

  it('kpt est nullable', () => {
    expectTypeOf<PontThermique['kpt']>().toEqualTypeOf<number | null>()
  })

  it('liaison est requis', () => {
    expectTypeOf<PontThermique['liaison']>().toEqualTypeOf<Liaison>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PT_REFEND: unknown = {
  id: FIXTURE_UUID,
  description: 'Pont thermique refend-mur',
  longueur: 2.5,
  kpt: null,
  liaison: {
    type: 'refend_mur',
    mur_id: UUID2,
    plancher_id: null,
    ouverture_id: null,
    pont_thermique_partiel: false,
  },
}

const VALID_PT_PLANCHER_BAS: unknown = {
  id: FIXTURE_UUID,
  description: 'Pont thermique plancher bas-mur',
  longueur: 10,
  kpt: 0.5,
  liaison: {
    type: 'plancher_bas_mur',
    mur_id: UUID2,
    plancher_id: UUID2,
    ouverture_id: null,
    pont_thermique_partiel: false,
  },
}

describe('isPontThermique — guard', () => {
  it('accepte un pont thermique refend-mur valide', () => {
    expect(isPontThermique(VALID_PT_REFEND)).toBe(true)
  })

  it('accepte un pont thermique plancher-bas-mur valide', () => {
    expect(isPontThermique(VALID_PT_PLANCHER_BAS)).toBe(true)
  })

  it('rejette si type de liaison est invalide', () => {
    expect(isPontThermique({
      ...VALID_PT_REFEND as object,
      liaison: { ...((VALID_PT_REFEND as { liaison: object }).liaison), type: 'dalot_mur' },
    })).toBe(false)
  })

  it('rejette si longueur est absent', () => {
    const { longueur: _, ...rest } = VALID_PT_REFEND as { longueur: unknown }
    expect(isPontThermique(rest)).toBe(false)
  })

  it('rejette si liaison est absent', () => {
    const { liaison: _, ...rest } = VALID_PT_REFEND as { liaison: unknown }
    expect(isPontThermique(rest)).toBe(false)
  })
})
