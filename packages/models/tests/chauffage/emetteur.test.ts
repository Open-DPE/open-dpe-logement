import { describe, expect, expectTypeOf, it } from 'vitest'
import { isEmetteur, type Emetteur } from '../../src/chauffage/emetteur.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Emetteur — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Emetteur['id']>().toEqualTypeOf<UUID>()
  })

  it('type est requis', () => {
    expectTypeOf<Emetteur['type']>().toMatchTypeOf<string>()
  })

  it('temperature_distribution est nullable', () => {
    expectTypeOf<Emetteur['temperature_distribution']>().toMatchTypeOf<string | null>()
  })

  it('annee_installation est nullable', () => {
    expectTypeOf<Emetteur['annee_installation']>().toEqualTypeOf<number | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_EMETTEUR: unknown = {
  id: FIXTURE_UUID,
  description: 'Radiateur bitube',
  type: 'radiateur_bitube',
  temperature_distribution: null,
  presence_robinet_thermostatique: true,
  annee_installation: null,
}

describe('isEmetteur — guard', () => {
  it('accepte un émetteur valide', () => {
    expect(isEmetteur(VALID_EMETTEUR)).toBe(true)
  })

  it('rejette si type est invalide', () => {
    expect(isEmetteur({ ...VALID_EMETTEUR as object, type: 'convecteur' })).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_EMETTEUR as { id: unknown }
    expect(isEmetteur(rest)).toBe(false)
  })

  it('rejette si presence_robinet_thermostatique est absent', () => {
    const { presence_robinet_thermostatique: _, ...rest } = VALID_EMETTEUR as { presence_robinet_thermostatique: unknown }
    expect(isEmetteur(rest)).toBe(false)
  })

  it('accepte chaque type d\'émetteur valide', () => {
    for (const type of ['plancher_chauffant', 'plafond_chauffant', 'radiateur_monotube', 'radiateur_bitube', 'radiateur', 'autres']) {
      expect(isEmetteur({ ...VALID_EMETTEUR as object, type })).toBe(true)
    }
  })
})
