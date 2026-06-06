import { describe, expect, expectTypeOf, it } from 'vitest'
import { isPlancherBas, type PlancherBas } from '../../src/enveloppe/plancher-bas.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, ISOLATION_SANS, POSITION_EXTERIEUR } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('PlancherBas — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<PlancherBas['id']>().toEqualTypeOf<UUID>()
  })

  it('type est nullable', () => {
    expectTypeOf<PlancherBas['type']>().toMatchTypeOf<string | null>()
  })

  it('u et u0 sont nullable', () => {
    expectTypeOf<PlancherBas['u']>().toEqualTypeOf<number | null>()
    expectTypeOf<PlancherBas['u0']>().toEqualTypeOf<number | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PLANCHER_BAS: unknown = {
  id: FIXTURE_UUID,
  description: 'Plancher bas sur vide sanitaire',
  type: null,
  inertie: null,
  annee_construction: null,
  annee_renovation: null,
  u0: null,
  u: null,
  position: { ...POSITION_EXTERIEUR, surface_ue: null, perimetre_ue: null },
  isolation: ISOLATION_SANS,
}

describe('isPlancherBas — guard', () => {
  it('accepte un plancher bas valide (position extérieur)', () => {
    expect(isPlancherBas(VALID_PLANCHER_BAS)).toBe(true)
  })

  it('accepte avec mitoyennete terre_plein (avec surface_ue/perimetre_ue)', () => {
    expect(isPlancherBas({
      ...VALID_PLANCHER_BAS as object,
      position: { surface: 20, mitoyennete: 'terre_plein', local_non_chauffe_id: null, surface_ue: 80, perimetre_ue: 36 },
    })).toBe(true)
  })

  it('rejette si position est absent', () => {
    const { position: _, ...rest } = VALID_PLANCHER_BAS as { position: unknown }
    expect(isPlancherBas(rest)).toBe(false)
  })

  it('rejette si isolation est absent', () => {
    const { isolation: _, ...rest } = VALID_PLANCHER_BAS as { isolation: unknown }
    expect(isPlancherBas(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isPlancherBas(null)).toBe(false)
  })
})
