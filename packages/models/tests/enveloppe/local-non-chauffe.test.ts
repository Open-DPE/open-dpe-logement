import { describe, expect, expectTypeOf, it } from 'vitest'
import { isLocalNonChauffe, type LocalNonChauffe, type AutreLocalNonChauffe, type EspaceTamponSolarise } from '../../src/enveloppe/local-non-chauffe.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('LocalNonChauffe — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<LocalNonChauffe['id']>().toEqualTypeOf<UUID>()
  })

  it('EspaceTamponSolarise a baies non vides', () => {
    expectTypeOf<EspaceTamponSolarise['baies']>().toMatchTypeOf<[unknown, ...unknown[]]>()
  })

  it('AutreLocalNonChauffe a parois non vides', () => {
    expectTypeOf<AutreLocalNonChauffe['parois']>().toMatchTypeOf<[unknown, ...unknown[]]>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const PAROI = {
  id: UUID2,
  description: 'Paroi sur extérieur',
  isolation: null,
  position: { mitoyennete: 'exterieur', surface: 10 },
}

const VALID_GARAGE: unknown = {
  id: FIXTURE_UUID,
  description: 'Garage attenant',
  type: 'garage',
  parois: [PAROI],
  baies: [],
}

const BAIE_LNC = {
  id: UUID2,
  description: 'Fenêtre LNC',
  type_vitrage: 'simple_vitrage',
  materiau_menuiserie: 'pvc',
  presence_rupteur_pont_thermique: null,
  position: { mitoyennete: 'exterieur', surface: 2, orientation: 'nord', inclinaison: 90 },
}

const VALID_ETS: unknown = {
  id: FIXTURE_UUID,
  description: 'Véranda',
  type: 'espace_tampon_solarise',
  parois: [],
  baies: [BAIE_LNC],
}

describe('isLocalNonChauffe — guard', () => {
  it('accepte un garage (autre local non chauffé) valide', () => {
    expect(isLocalNonChauffe(VALID_GARAGE)).toBe(true)
  })

  it('accepte un espace tampon solarisé valide', () => {
    expect(isLocalNonChauffe(VALID_ETS)).toBe(true)
  })

  it('rejette si type est invalide', () => {
    expect(isLocalNonChauffe({ ...VALID_GARAGE as object, type: 'grenier' })).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_GARAGE as { id: unknown }
    expect(isLocalNonChauffe(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isLocalNonChauffe(null)).toBe(false)
  })
})
