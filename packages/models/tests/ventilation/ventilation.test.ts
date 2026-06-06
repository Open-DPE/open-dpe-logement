import { describe, expect, expectTypeOf, it } from 'vitest'
import { isVentilation, type Ventilation } from '../../src/ventilation/ventilation.js'
import type { NonEmptyArray } from '../../src/common/common.js'
import type { Installation } from '../../src/ventilation/installation.js'
import { UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Ventilation — types', () => {
  it('installations est un tableau non vide', () => {
    expectTypeOf<Ventilation['installations']>().toEqualTypeOf<NonEmptyArray<Installation>>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_INSTALLATION_NATURELLE: unknown = {
  id: UUID,
  description: 'Ventilation naturelle par fenêtres',
  surface: 80,
  type: 'ventilation_ouverture_fenetres',
  annee_installation: null,
  installation_collective: null,
  presence_echangeur_thermique: null,
}

const VALID_VENTILATION: unknown = {
  installations: [VALID_INSTALLATION_NATURELLE],
}

describe('isVentilation — guard', () => {
  it('accepte une ventilation valide', () => {
    expect(isVentilation(VALID_VENTILATION)).toBe(true)
  })

  it('rejette si installations est vide', () => {
    expect(isVentilation({ ...VALID_VENTILATION as object, installations: [] })).toBe(false)
  })

  it('rejette si installations est absent', () => {
    expect(isVentilation({})).toBe(false)
  })

  it('rejette null', () => {
    expect(isVentilation(null)).toBe(false)
  })
})
