import { describe, expect, expectTypeOf, it } from 'vitest'
import { isEnveloppe, type Enveloppe } from '../../src/enveloppe/enveloppe.js'
import type { NonEmptyArray } from '../../src/common/common.js'
import type { Niveau } from '../../src/enveloppe/niveau.js'
import { UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Enveloppe — types', () => {
  it('exposition est requis et limité à simple | multiple', () => {
    expectTypeOf<Enveloppe['exposition']>().toEqualTypeOf<'simple' | 'multiple'>()
  })

  it('q4pa_conv est nullable (requis)', () => {
    expectTypeOf<Enveloppe['q4pa_conv']>().toEqualTypeOf<number | null>()
  })

  it('niveaux est un tableau non vide de Niveau', () => {
    expectTypeOf<Enveloppe['niveaux']>().toEqualTypeOf<NonEmptyArray<Niveau>>()
  })

  it('murs, baies, portes, ponts_thermiques, masques sont des tableaux', () => {
    expectTypeOf<Enveloppe['murs']>().toMatchTypeOf<unknown[]>()
    expectTypeOf<Enveloppe['baies']>().toMatchTypeOf<unknown[]>()
    expectTypeOf<Enveloppe['portes']>().toMatchTypeOf<unknown[]>()
    expectTypeOf<Enveloppe['ponts_thermiques']>().toMatchTypeOf<unknown[]>()
    expectTypeOf<Enveloppe['masques']>().toMatchTypeOf<unknown[]>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_NIVEAU = {
  id: UUID,
  description: 'RDC',
  surface: 80,
  inertie_paroi_verticale: null,
  inertie_plancher_bas: null,
  inertie_plancher_haut: null,
}

const VALID_ENVELOPPE: unknown = {
  exposition: 'simple',
  q4pa_conv: null,
  presence_brasseurs_air: false,
  niveaux: [VALID_NIVEAU],
  locaux_non_chauffes: [],
  murs: [],
  planchers_hauts: [],
  planchers_bas: [],
  baies: [],
  portes: [],
  ponts_thermiques: [],
  masques: [],
}

describe('isEnveloppe — guard', () => {
  it('accepte une enveloppe valide', () => {
    expect(isEnveloppe(VALID_ENVELOPPE)).toBe(true)
  })

  it('rejette si niveaux est vide', () => {
    expect(isEnveloppe({ ...VALID_ENVELOPPE as object, niveaux: [] })).toBe(false)
  })

  it('rejette si exposition est invalide', () => {
    expect(isEnveloppe({ ...VALID_ENVELOPPE as object, exposition: 'triple' })).toBe(false)
  })

  it('rejette si exposition est absent', () => {
    const { exposition: _, ...rest } = VALID_ENVELOPPE as { exposition: unknown }
    expect(isEnveloppe(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isEnveloppe(null)).toBe(false)
  })
})
