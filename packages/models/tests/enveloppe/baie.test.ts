import { describe, expect, expectTypeOf, it } from 'vitest'
import { isBaie, type Baie, type BaieFenetreOuPorteFenetre, type BaieBriqueVerre } from '../../src/enveloppe/baie.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID, POSITION_EXTERIEUR } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Baie — types', () => {
  it('type est une union des 3 variantes', () => {
    expectTypeOf<Baie>().toMatchTypeOf<BaieBriqueVerre | BaieFenetreOuPorteFenetre>()
  })

  it('id est un UUID requis', () => {
    expectTypeOf<Baie['id']>().toEqualTypeOf<UUID>()
  })

  it('ug, uw, ujn, sw sont nullable', () => {
    expectTypeOf<Baie['ug']>().toEqualTypeOf<number | null>()
    expectTypeOf<Baie['uw']>().toEqualTypeOf<number | null>()
    expectTypeOf<Baie['ujn']>().toEqualTypeOf<number | null>()
    expectTypeOf<Baie['sw']>().toEqualTypeOf<number | null>()
  })

  it('BaieFenetreOuPorteFenetre a une menuiserie obligatoire', () => {
    expectTypeOf<BaieFenetreOuPorteFenetre['menuiserie']>().not.toBeNull()
  })

  it('BaieBriqueVerre a menuiserie null', () => {
    expectTypeOf<BaieBriqueVerre['menuiserie']>().toBeNull()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const POSITION_BAIE = {
  ...POSITION_EXTERIEUR,
  paroi_id: null,
  baie_id: null,
  type_pose: 'nu_interieur',
  inclinaison: 90,
  orientation: 'nord',
  masques: [],
}

const VALID_BRIQUE_VERRE: unknown = {
  id: FIXTURE_UUID,
  description: 'Brique de verre',
  type: 'brique_verre_pleine',
  presence_protection_solaire: false,
  type_fermeture: 'sans_fermeture',
  annee_installation: null,
  ug: null,
  uw: null,
  ujn: null,
  sw: null,
  position: POSITION_BAIE,
  menuiserie: null,
  vitrage: { type: 'brique_verre', nature_lame: null, epaisseur_lame: null },
  survitrage: null,
}

const VALID_FENETRE: unknown = {
  id: FIXTURE_UUID,
  description: 'Fenêtre double vitrage',
  type: 'fenetre_battante',
  presence_protection_solaire: false,
  type_fermeture: 'sans_fermeture',
  annee_installation: null,
  ug: null,
  uw: null,
  ujn: null,
  sw: null,
  position: POSITION_BAIE,
  menuiserie: {
    materiau: 'pvc',
    largeur_dormant: null,
    presence_soubassement: false,
    presence_joint: null,
    presence_retour_isolation: null,
    presence_rupteur_pont_thermique: null,
  },
  vitrage: { type: 'double_vitrage', nature_lame: null, epaisseur_lame: null },
  survitrage: null,
}

describe('isBaie — guard', () => {
  it('accepte une baie brique de verre valide', () => {
    expect(isBaie(VALID_BRIQUE_VERRE)).toBe(true)
  })

  it('accepte une fenêtre double vitrage valide', () => {
    expect(isBaie(VALID_FENETRE)).toBe(true)
  })

  it('rejette si type est invalide', () => {
    expect(isBaie({ ...VALID_FENETRE as object, type: 'lucarne' })).toBe(false)
  })

  it('rejette si type_fermeture est invalide', () => {
    expect(isBaie({ ...VALID_FENETRE as object, type_fermeture: 'rideau' })).toBe(false)
  })

  it('rejette si position est absent', () => {
    const { position: _, ...rest } = VALID_FENETRE as { position: unknown }
    expect(isBaie(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isBaie(null)).toBe(false)
  })
})
