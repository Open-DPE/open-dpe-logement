import { describe, expect, expectTypeOf, it } from 'vitest'
import { isInstallation, type Installation } from '../../src/refroidissement/installation.js'
import type { UUID, NonEmptyArray } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Installation refroidissement — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Installation['id']>().toEqualTypeOf<UUID>()
  })

  it('surface est un number requis', () => {
    expectTypeOf<Installation['surface']>().toEqualTypeOf<number>()
  })

  it('generateurs est un tableau non vide d\'UUID', () => {
    expectTypeOf<Installation['generateurs']>().toEqualTypeOf<NonEmptyArray<UUID>>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_INSTALLATION: unknown = {
  id: FIXTURE_UUID,
  description: 'Installation de refroidissement',
  surface: 80,
  generateurs: [UUID2],
}

describe('isInstallation refroidissement — guard', () => {
  it('accepte une installation valide', () => {
    expect(isInstallation(VALID_INSTALLATION)).toBe(true)
  })

  it('rejette si generateurs est vide', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, generateurs: [] })).toBe(false)
  })

  it('rejette si surface est absent', () => {
    const { surface: _, ...rest } = VALID_INSTALLATION as { surface: unknown }
    expect(isInstallation(rest)).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_INSTALLATION as { id: unknown }
    expect(isInstallation(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isInstallation(null)).toBe(false)
  })
})
