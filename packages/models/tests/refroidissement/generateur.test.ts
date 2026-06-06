import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  isGenerateur,
  type Generateur,
  type GenerateurPAC,
  type GenerateurReseauFroid,
  type GenerateurClimatiseur,
} from '../../src/refroidissement/generateur.js'
import { UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Generateur refroidissement — types', () => {
  it('est une union PAC | Climatiseur | ReseauFroid', () => {
    expectTypeOf<Generateur>().toMatchTypeOf<GenerateurPAC | GenerateurClimatiseur | GenerateurReseauFroid>()
  })

  it('GenerateurPAC a energie electricite', () => {
    expectTypeOf<GenerateurPAC['energie']>().toEqualTypeOf<'electricite'>()
  })

  it('GenerateurReseauFroid a energie reseau_froid', () => {
    expectTypeOf<GenerateurReseauFroid['energie']>().toEqualTypeOf<'reseau_froid'>()
  })

  it('seer est nullable sur toutes les variantes', () => {
    expectTypeOf<Generateur['seer']>().toEqualTypeOf<number | null>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_PAC: unknown = {
  id: UUID,
  description: 'PAC air/air réversible',
  type: 'pac_air_air',
  energie: 'electricite',
  annee_installation: 2018,
  seer: 4.5,
  reseau_froid_id: null,
}

const VALID_RESEAU_FROID: unknown = {
  id: UUID,
  description: 'Réseau de froid urbain',
  type: 'reseau_froid',
  energie: 'reseau_froid',
  annee_installation: null,
  seer: null,
  reseau_froid_id: null,
}

const VALID_CLIMATISEUR: unknown = {
  id: UUID,
  description: 'Climatiseur monosplit',
  type: 'autre',
  energie: 'electricite',
  annee_installation: 2020,
  seer: 5.0,
  reseau_froid_id: null,
}

describe('isGenerateur refroidissement — guard', () => {
  it('accepte une PAC valide', () => {
    expect(isGenerateur(VALID_PAC)).toBe(true)
  })

  it('accepte un réseau de froid valide', () => {
    expect(isGenerateur(VALID_RESEAU_FROID)).toBe(true)
  })

  it('accepte un climatiseur valide', () => {
    expect(isGenerateur(VALID_CLIMATISEUR)).toBe(true)
  })

  it('rejette si type est invalide', () => {
    expect(isGenerateur({ ...VALID_PAC as object, type: 'ventilo_convecteur' })).toBe(false)
  })

  it('rejette si energie est invalide', () => {
    expect(isGenerateur({ ...VALID_PAC as object, energie: 'charbon' })).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_PAC as { id: unknown }
    expect(isGenerateur(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isGenerateur(null)).toBe(false)
  })
})
