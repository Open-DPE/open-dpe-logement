import { describe, expect, expectTypeOf, it } from 'vitest'
import { isPanneauPhotovoltaique, type PanneauPhotovoltaique } from '../../src/production/panneau-photovoltaique.js'
import type { UUID, Orientation } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('PanneauPhotovoltaique — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<PanneauPhotovoltaique['id']>().toEqualTypeOf<UUID>()
  })

  it('orientation est requis', () => {
    expectTypeOf<PanneauPhotovoltaique['orientation']>().toEqualTypeOf<Orientation>()
  })

  it('surface est nullable', () => {
    expectTypeOf<PanneauPhotovoltaique['surface']>().toEqualTypeOf<number | null>()
  })

  it('modules est un number requis', () => {
    expectTypeOf<PanneauPhotovoltaique['modules']>().toEqualTypeOf<number>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PANNEAU: unknown = {
  id: FIXTURE_UUID,
  description: 'Panneaux sud toiture',
  orientation: 'sud',
  inclinaison: 30,
  modules: 12,
  surface: null,
  installation_collective: false,
}

describe('isPanneauPhotovoltaique — guard', () => {
  it('accepte un panneau valide', () => {
    expect(isPanneauPhotovoltaique(VALID_PANNEAU)).toBe(true)
  })

  it('accepte avec une surface renseignée', () => {
    expect(isPanneauPhotovoltaique({ ...VALID_PANNEAU as object, surface: 24 })).toBe(true)
  })

  it('rejette si orientation est invalide', () => {
    expect(isPanneauPhotovoltaique({ ...VALID_PANNEAU as object, orientation: 'est-sud' })).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_PANNEAU as { id: unknown }
    expect(isPanneauPhotovoltaique(rest)).toBe(false)
  })

  it('rejette si modules est absent', () => {
    const { modules: _, ...rest } = VALID_PANNEAU as { modules: unknown }
    expect(isPanneauPhotovoltaique(rest)).toBe(false)
  })

  it('accepte chaque orientation cardinale', () => {
    for (const orientation of ['nord', 'sud', 'est', 'ouest']) {
      expect(isPanneauPhotovoltaique({ ...VALID_PANNEAU as object, orientation })).toBe(true)
    }
  })
})
