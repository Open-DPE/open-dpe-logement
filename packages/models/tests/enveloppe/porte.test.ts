import { describe, expect, expectTypeOf, it } from 'vitest'
import { isPorte, type Porte } from '../../src/enveloppe/porte.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, POSITION_EXTERIEUR } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Porte — types', () => {
  it('id est un UUID requis', () => {
    expectTypeOf<Porte['id']>().toEqualTypeOf<UUID>()
  })

  it('isolation est nullable', () => {
    expectTypeOf<Porte['isolation']>().toEqualTypeOf<boolean | null>()
  })

  it('materiau est nullable', () => {
    expectTypeOf<Porte['materiau']>().toMatchTypeOf<string | null>()
  })

  it('u est nullable', () => {
    expectTypeOf<Porte['u']>().toEqualTypeOf<number | null>()
  })

  it('vitrage est nullable', () => {
    expectTypeOf<Porte['vitrage']>().toMatchTypeOf<object | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PORTE: unknown = {
  id: FIXTURE_UUID,
  description: 'Porte d\'entrée',
  isolation: null,
  materiau: null,
  annee_installation: null,
  u: null,
  position: {
    ...POSITION_EXTERIEUR,
    paroi_id: null,
    orientation: 'nord',
    type_pose: 'nu_interieur',
    presence_sas: false,
  },
  menuiserie: {
    largeur_dormant: null,
    presence_joint: null,
    presence_retour_isolation: null,
  },
  vitrage: null,
}

describe('isPorte — guard', () => {
  it('accepte une porte valide', () => {
    expect(isPorte(VALID_PORTE)).toBe(true)
  })

  it('rejette si menuiserie est absent', () => {
    const { menuiserie: _, ...rest } = VALID_PORTE as { menuiserie: unknown }
    expect(isPorte(rest)).toBe(false)
  })

  it('rejette si position est absent', () => {
    const { position: _, ...rest } = VALID_PORTE as { position: unknown }
    expect(isPorte(rest)).toBe(false)
  })

  it('rejette si type_pose est invalide', () => {
    expect(isPorte({
      ...VALID_PORTE as object,
      position: { ...POSITION_EXTERIEUR, paroi_id: null, orientation: 'nord', type_pose: 'invalide', presence_sas: false },
    })).toBe(false)
  })

  it('rejette null', () => {
    expect(isPorte(null)).toBe(false)
  })
})
