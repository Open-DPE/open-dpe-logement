import { describe, expect, expectTypeOf, it } from 'vitest'
import { isAppartement, type Appartement } from '../../src/batiment/appartement.js'
import type { PositiveNumber, UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Appartement — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Appartement['id']>().toEqualTypeOf<UUID>()
  })

  it('surface_habitable est un PositiveNumber requis', () => {
    expectTypeOf<Appartement['surface_habitable']>().toEqualTypeOf<PositiveNumber>()
  })

  it('position est limité aux valeurs enum', () => {
    expectTypeOf<Appartement['position']>().toEqualTypeOf<'rdc' | 'etage_intermediaire' | 'dernier_etage'>()
  })

  it('typologie est limité aux valeurs enum', () => {
    expectTypeOf<Appartement['typologie']>().toEqualTypeOf<'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7'>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_APPARTEMENT: unknown = {
  id: FIXTURE_UUID,
  description: 'Appartement T2 au 3e étage',
  surface_habitable: 50,
  hauteur_sous_plafond: 2.5,
  position: 'etage_intermediaire',
  typologie: 'T2',
}

describe('isAppartement — guard', () => {
  it('accepte un appartement valide', () => {
    expect(isAppartement(VALID_APPARTEMENT)).toBe(true)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_APPARTEMENT as { id: unknown }
    expect(isAppartement(rest)).toBe(false)
  })

  it('rejette si position est invalide', () => {
    expect(isAppartement({ ...VALID_APPARTEMENT as object, position: 'grenier' })).toBe(false)
  })

  it('rejette si typologie est invalide', () => {
    expect(isAppartement({ ...VALID_APPARTEMENT as object, typologie: 'T10' })).toBe(false)
  })

  it('rejette si surface_habitable est 0', () => {
    expect(isAppartement({ ...VALID_APPARTEMENT as object, surface_habitable: 0 })).toBe(false)
  })

  it('accepte chaque valeur de position', () => {
    for (const position of ['rdc', 'etage_intermediaire', 'dernier_etage']) {
      expect(isAppartement({ ...VALID_APPARTEMENT as object, position })).toBe(true)
    }
  })
})
