import { describe, expect, expectTypeOf, it } from 'vitest'
import { isPlancherHaut, type PlancherHaut } from '../../src/enveloppe/plancher-haut.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, ISOLATION_SANS, POSITION_EXTERIEUR } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('PlancherHaut — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<PlancherHaut['id']>().toEqualTypeOf<UUID>()
  })

  it('configuration est requise', () => {
    expectTypeOf<PlancherHaut['configuration']>().toEqualTypeOf<'plancher' | 'rampants' | 'terrasse'>()
  })

  it('type est nullable', () => {
    expectTypeOf<PlancherHaut['type']>().toMatchTypeOf<string | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PLANCHER_HAUT: unknown = {
  id: FIXTURE_UUID,
  description: 'Toiture terrasse',
  configuration: 'terrasse',
  type: null,
  inertie: null,
  annee_construction: null,
  annee_renovation: null,
  u0: null,
  u: null,
  position: { ...POSITION_EXTERIEUR, orientation: 'horizontale' },
  isolation: ISOLATION_SANS,
}

describe('isPlancherHaut — guard', () => {
  it('accepte un plancher haut valide', () => {
    expect(isPlancherHaut(VALID_PLANCHER_HAUT)).toBe(true)
  })

  it('rejette si configuration est invalide', () => {
    expect(isPlancherHaut({ ...VALID_PLANCHER_HAUT as object, configuration: 'combles' })).toBe(false)
  })

  it('rejette si configuration est absent', () => {
    const { configuration: _, ...rest } = VALID_PLANCHER_HAUT as { configuration: unknown }
    expect(isPlancherHaut(rest)).toBe(false)
  })

  it('rejette si isolation est absent', () => {
    const { isolation: _, ...rest } = VALID_PLANCHER_HAUT as { isolation: unknown }
    expect(isPlancherHaut(rest)).toBe(false)
  })

  it('accepte chaque configuration valide', () => {
    for (const configuration of ['plancher', 'rampants', 'terrasse']) {
      expect(isPlancherHaut({ ...VALID_PLANCHER_HAUT as object, configuration })).toBe(true)
    }
  })
})
