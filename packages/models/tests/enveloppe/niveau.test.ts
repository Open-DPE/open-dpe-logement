import { describe, expect, expectTypeOf, it } from 'vitest'
import { isNiveau, type Niveau } from '../../src/enveloppe/niveau.js'
import type { UUID } from '../../src/common/common.js'
import type { InertieParoi } from '../../src/enveloppe/common.js'
import { UUID as FIXTURE_UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Niveau — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Niveau['id']>().toEqualTypeOf<UUID>()
  })

  it('surface est un number requis', () => {
    expectTypeOf<Niveau['surface']>().toEqualTypeOf<number>()
  })

  it('inertie_paroi_verticale est nullable', () => {
    expectTypeOf<Niveau['inertie_paroi_verticale']>().toEqualTypeOf<InertieParoi | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_NIVEAU: unknown = {
  id: FIXTURE_UUID,
  description: 'RDC',
  surface: 80,
  inertie_paroi_verticale: null,
  inertie_plancher_bas: null,
  inertie_plancher_haut: null,
}

describe('isNiveau — guard', () => {
  it('accepte un niveau valide', () => {
    expect(isNiveau(VALID_NIVEAU)).toBe(true)
  })

  it('accepte avec des valeurs d\'inertie', () => {
    expect(isNiveau({ ...VALID_NIVEAU as object, inertie_paroi_verticale: 'lourde', inertie_plancher_bas: 'legere' })).toBe(true)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_NIVEAU as { id: unknown }
    expect(isNiveau(rest)).toBe(false)
  })

  it('rejette si surface est absent', () => {
    const { surface: _, ...rest } = VALID_NIVEAU as { surface: unknown }
    expect(isNiveau(rest)).toBe(false)
  })

  it('rejette si inertie_paroi_verticale est une valeur invalide', () => {
    expect(isNiveau({ ...VALID_NIVEAU as object, inertie_paroi_verticale: 'ultra_lourde' })).toBe(false)
  })
})
