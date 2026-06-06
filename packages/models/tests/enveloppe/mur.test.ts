import { describe, expect, expectTypeOf, it } from 'vitest'
import { isMur, type Mur } from '../../src/enveloppe/mur.js'
import type { UUID } from '../../src/common/common.js'
import type { Isolation } from '../../src/enveloppe/common.js'
import { UUID as FIXTURE_UUID, ISOLATION_SANS, POSITION_EXTERIEUR } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Mur — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Mur['id']>().toEqualTypeOf<UUID>()
  })

  it('isolation est requis', () => {
    expectTypeOf<Mur['isolation']>().toEqualTypeOf<Isolation>()
  })

  it('u et u0 sont nullable', () => {
    expectTypeOf<Mur['u']>().toEqualTypeOf<number | null>()
    expectTypeOf<Mur['u0']>().toEqualTypeOf<number | null>()
  })

  it('type_doublage est nullable', () => {
    expectTypeOf<Mur['type_doublage']>().toMatchTypeOf<string | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_MUR: unknown = {
  id: FIXTURE_UUID,
  description: 'Mur nord',
  structures: [],
  type_doublage: null,
  presence_enduit_isolant: null,
  inertie: null,
  annee_construction: null,
  annee_renovation: null,
  u0: null,
  u: null,
  position: { ...POSITION_EXTERIEUR, orientation: 'nord' },
  isolation: ISOLATION_SANS,
}

describe('isMur — guard', () => {
  it('accepte un mur valide', () => {
    expect(isMur(VALID_MUR)).toBe(true)
  })

  it('rejette si position est absent', () => {
    const { position: _, ...rest } = VALID_MUR as { position: unknown }
    expect(isMur(rest)).toBe(false)
  })

  it('rejette si isolation est absent', () => {
    const { isolation: _, ...rest } = VALID_MUR as { isolation: unknown }
    expect(isMur(rest)).toBe(false)
  })

  it('rejette si orientation est invalide', () => {
    expect(isMur({ ...VALID_MUR as object, position: { ...POSITION_EXTERIEUR, orientation: 'nord-est' } })).toBe(false)
  })

  it('rejette null', () => {
    expect(isMur(null)).toBe(false)
  })
})
