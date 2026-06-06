import { describe, expect, expectTypeOf, it } from 'vitest'
import { isRefroidissement, type Refroidissement } from '../../src/refroidissement/refroidissement.js'
import type { Generateur } from '../../src/refroidissement/generateur.js'
import type { Installation } from '../../src/refroidissement/installation.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Refroidissement — types', () => {
  it('generateurs est un tableau (peut être vide)', () => {
    expectTypeOf<Refroidissement['generateurs']>().toEqualTypeOf<Generateur[]>()
  })

  it('installations est un tableau (peut être vide)', () => {
    expectTypeOf<Refroidissement['installations']>().toEqualTypeOf<Installation[]>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_REFROIDISSEMENT_VIDE: unknown = {
  generateurs: [],
  installations: [],
}

describe('isRefroidissement — guard', () => {
  it('accepte un refroidissement vide (aucun équipement)', () => {
    expect(isRefroidissement(VALID_REFROIDISSEMENT_VIDE)).toBe(true)
  })

  it('rejette si generateurs est absent', () => {
    const { generateurs: _, ...rest } = VALID_REFROIDISSEMENT_VIDE as { generateurs: unknown }
    expect(isRefroidissement(rest)).toBe(false)
  })

  it('rejette si installations est absent', () => {
    const { installations: _, ...rest } = VALID_REFROIDISSEMENT_VIDE as { installations: unknown }
    expect(isRefroidissement(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isRefroidissement(null)).toBe(false)
  })
})
