import { describe, expect, expectTypeOf, it } from 'vitest'
import { isInstallation, type Installation } from '../../src/ecs/installation.js'
import type { UUID, PositiveNumber } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Installation ECS — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Installation['id']>().toEqualTypeOf<UUID>()
  })

  it('surface est un PositiveNumber requis', () => {
    expectTypeOf<Installation['surface']>().toEqualTypeOf<PositiveNumber>()
  })

  it('systemes est limité à 1 ou 2 systèmes', () => {
    // [Systeme] | [Systeme, Systeme] — tableau non vide de 1 ou 2 éléments
    expectTypeOf<Installation['systemes']>().toMatchTypeOf<[unknown] | [unknown, unknown]>()
  })

  it('solaire_thermique est nullable', () => {
    expectTypeOf<Installation['solaire_thermique']>().toMatchTypeOf<object | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const SYSTEME: unknown = {
  id: UUID2,
  description: 'Système ECS',
  generateur_id: UUID2,
  reseau: { alimentation_contigue: true, niveaux_desservis: 1, isolation: null, bouclage: null },
}

const VALID_INSTALLATION: unknown = {
  id: FIXTURE_UUID,
  description: 'Installation ECS individuelle',
  surface: 80,
  installation_collective: false,
  systemes: [SYSTEME],
  solaire_thermique: null,
}

describe('isInstallation ECS — guard', () => {
  it('accepte une installation valide avec 1 système', () => {
    expect(isInstallation(VALID_INSTALLATION)).toBe(true)
  })

  it('rejette si systemes est vide', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, systemes: [] })).toBe(false)
  })

  it('rejette si surface est 0', () => {
    expect(isInstallation({ ...VALID_INSTALLATION as object, surface: 0 })).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_INSTALLATION as { id: unknown }
    expect(isInstallation(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isInstallation(null)).toBe(false)
  })
})
