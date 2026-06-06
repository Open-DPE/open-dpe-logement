import { describe, expect, expectTypeOf, it } from 'vitest'
import { isSysteme, type Systeme, type SystemeCentral, type SystemeDivise } from '../../src/chauffage/systeme.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Systeme chauffage — types', () => {
  it('est une union SystemeCentral | SystemeDivise', () => {
    expectTypeOf<Systeme>().toMatchTypeOf<SystemeCentral | SystemeDivise>()
  })

  it('SystemeCentral a un reseau obligatoire', () => {
    expectTypeOf<SystemeCentral['reseau']>().not.toBeNull()
  })

  it('SystemeDivise a reseau null', () => {
    expectTypeOf<SystemeDivise['reseau']>().toBeNull()
  })

  it('generateur_id est un UUID requis', () => {
    expectTypeOf<Systeme['generateur_id']>().toEqualTypeOf<UUID>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_SYSTEME_DIVISE: unknown = {
  id: FIXTURE_UUID,
  description: 'Système divise',
  type: 'divise',
  generateur_id: UUID2,
  reseau: null,
}

const VALID_SYSTEME_CENTRAL: unknown = {
  id: FIXTURE_UUID,
  description: 'Système central hydraulique',
  type: 'central',
  generateur_id: UUID2,
  reseau: {
    type_distribution: 'hydraulique',
    presence_fluide_frigorigene: false,
    presence_circulateur_externe: false,
    niveaux_desservis: 3,
    isolation: null,
    temperature_distribution: 'moyenne',
    emetteurs: [UUID2],
  },
}

describe('isSysteme chauffage — guard', () => {
  it('accepte un système divise valide', () => {
    expect(isSysteme(VALID_SYSTEME_DIVISE)).toBe(true)
  })

  it('accepte un système central hydraulique valide', () => {
    expect(isSysteme(VALID_SYSTEME_CENTRAL)).toBe(true)
  })

  it('rejette si type est invalide', () => {
    expect(isSysteme({ ...VALID_SYSTEME_DIVISE as object, type: 'mixte' })).toBe(false)
  })

  it('rejette si generateur_id est absent', () => {
    const { generateur_id: _, ...rest } = VALID_SYSTEME_DIVISE as { generateur_id: unknown }
    expect(isSysteme(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isSysteme(null)).toBe(false)
  })
})
