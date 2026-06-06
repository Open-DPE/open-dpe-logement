import { describe, expect, expectTypeOf, it } from 'vitest'
import { isSysteme, type Systeme, type Reseau } from '../../src/ecs/systeme.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Systeme ECS — types', () => {
  it('id et generateur_id sont des UUID requis', () => {
    expectTypeOf<Systeme['id']>().toEqualTypeOf<UUID>()
    expectTypeOf<Systeme['generateur_id']>().toEqualTypeOf<UUID>()
  })

  it('reseau est requis', () => {
    expectTypeOf<Systeme['reseau']>().toEqualTypeOf<Reseau>()
  })

  it('reseau.bouclage est nullable', () => {
    expectTypeOf<Reseau['bouclage']>().toMatchTypeOf<string | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_SYSTEME: unknown = {
  id: FIXTURE_UUID,
  description: 'Système ECS distribution',
  generateur_id: UUID2,
  reseau: {
    alimentation_contigue: true,
    niveaux_desservis: 1,
    isolation: null,
    bouclage: null,
  },
}

describe('isSysteme ECS — guard', () => {
  it('accepte un système valide', () => {
    expect(isSysteme(VALID_SYSTEME)).toBe(true)
  })

  it('accepte avec un bouclage valide', () => {
    expect(isSysteme({
      ...VALID_SYSTEME as object,
      reseau: { ...(VALID_SYSTEME as { reseau: object }).reseau, bouclage: 'boucle' },
    })).toBe(true)
  })

  it('rejette si bouclage est invalide', () => {
    expect(isSysteme({
      ...VALID_SYSTEME as object,
      reseau: { ...(VALID_SYSTEME as { reseau: object }).reseau, bouclage: 'semi_boucle' },
    })).toBe(false)
  })

  it('rejette si reseau est absent', () => {
    const { reseau: _, ...rest } = VALID_SYSTEME as { reseau: unknown }
    expect(isSysteme(rest)).toBe(false)
  })

  it('rejette si generateur_id est absent', () => {
    const { generateur_id: _, ...rest } = VALID_SYSTEME as { generateur_id: unknown }
    expect(isSysteme(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isSysteme(null)).toBe(false)
  })
})
