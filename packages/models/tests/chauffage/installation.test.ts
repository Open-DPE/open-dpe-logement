import { describe, expect, expectTypeOf, it } from 'vitest'
import { isInstallation, type Installation } from '../../src/chauffage/installation.js'
import type { UUID, NonEmptyArray, PositiveNumber } from '../../src/common/common.js'
import type { Systeme } from '../../src/chauffage/systeme.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Installation chauffage — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Installation['id']>().toEqualTypeOf<UUID>()
  })

  it('surface est un PositiveNumber requis', () => {
    expectTypeOf<Installation['surface']>().toEqualTypeOf<PositiveNumber>()
  })

  it('systemes est un tableau non vide', () => {
    expectTypeOf<Installation['systemes']>().toEqualTypeOf<NonEmptyArray<Systeme>>()
  })

  it('solaire_thermique est nullable', () => {
    expectTypeOf<Installation['solaire_thermique']>().toMatchTypeOf<object | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const SYSTEME: unknown = {
  id: UUID2,
  description: 'Système divise',
  type: 'divise',
  generateur_id: UUID2,
  reseau: null,
}

const VALID_INSTALLATION: unknown = {
  id: FIXTURE_UUID,
  description: 'Installation chauffage principale',
  surface: 80,
  type: 'divise',
  installation_collective: false,
  comptage_individuel: null,
  regulation_terminale: null,
  programmation: 'absent',
  solaire_thermique: null,
  systemes: [SYSTEME],
}

describe('isInstallation chauffage — guard', () => {
  it('accepte une installation valide', () => {
    expect(isInstallation(VALID_INSTALLATION)).toBe(true)
  })

  it('rejette si systemes est vide', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, systemes: [] })).toBe(false)
  })

  it('rejette si type est invalide', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, type: 'mixte' })).toBe(false)
  })

  it('rejette si programmation est invalide', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, programmation: 'inconnu' })).toBe(false)
  })

  it('rejette si surface est 0', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, surface: 0 })).toBe(false)
  })

  it('rejette null', () => {
    expect(isInstallation(null)).toBe(false)
  })
})
