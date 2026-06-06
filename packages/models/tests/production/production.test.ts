import { describe, expect, expectTypeOf, it } from 'vitest'
import { isProduction, type Production } from '../../src/production/production.js'
import type { PanneauPhotovoltaique } from '../../src/production/panneau-photovoltaique.js'
import { UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Production — types', () => {
  it('panneaux_photovoltaiques est un tableau (peut être vide)', () => {
    expectTypeOf<Production['panneaux_photovoltaiques']>().toEqualTypeOf<PanneauPhotovoltaique[]>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PRODUCTION_VIDE: unknown = {
  panneaux_photovoltaiques: [],
}

const VALID_PANNEAU: unknown = {
  id: UUID,
  description: 'Panneaux photovoltaïques toiture',
  orientation: 'sud',
  inclinaison: 30,
  modules: 12,
  surface: null,
  installation_collective: false,
}

const VALID_PRODUCTION_AVEC_PANNEAUX: unknown = {
  panneaux_photovoltaiques: [VALID_PANNEAU],
}

describe('isProduction — guard', () => {
  it('accepte une production sans panneaux', () => {
    expect(isProduction(VALID_PRODUCTION_VIDE)).toBe(true)
  })

  it('accepte une production avec des panneaux', () => {
    expect(isProduction(VALID_PRODUCTION_AVEC_PANNEAUX)).toBe(true)
  })

  it('rejette si panneaux_photovoltaiques est absent', () => {
    expect(isProduction({})).toBe(false)
  })

  it('rejette null', () => {
    expect(isProduction(null)).toBe(false)
  })
})
