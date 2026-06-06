import { describe, expect, expectTypeOf, it } from 'vitest'
import { isDiagnostic, type Diagnostic } from '../../src/diagnostic/diagnostic.js'
import type { Batiment } from '../../src/batiment/batiment.js'
import type { Enveloppe } from '../../src/enveloppe/enveloppe.js'
import type { Chauffage } from '../../src/chauffage/chauffage.js'
import type { Ecs } from '../../src/ecs/ecs.js'
import type { Ventilation } from '../../src/ventilation/ventilation.js'
import type { Refroidissement } from '../../src/refroidissement/refroidissement.js'
import type { Production } from '../../src/production/production.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Diagnostic — types', () => {
  it('batiment est requis', () => {
    expectTypeOf<Diagnostic['batiment']>().toEqualTypeOf<Batiment>()
  })

  it('enveloppe est requis', () => {
    expectTypeOf<Diagnostic['enveloppe']>().toEqualTypeOf<Enveloppe>()
  })

  it('chauffage est requis', () => {
    expectTypeOf<Diagnostic['chauffage']>().toEqualTypeOf<Chauffage>()
  })

  it('ecs est requis', () => {
    expectTypeOf<Diagnostic['ecs']>().toEqualTypeOf<Ecs>()
  })

  it('ventilation est requis', () => {
    expectTypeOf<Diagnostic['ventilation']>().toEqualTypeOf<Ventilation>()
  })

  it('refroidissement est requis', () => {
    expectTypeOf<Diagnostic['refroidissement']>().toEqualTypeOf<Refroidissement>()
  })

  it('production est requis', () => {
    expectTypeOf<Diagnostic['production']>().toEqualTypeOf<Production>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────
// Un diagnostic valide nécessite la composition de toutes les entités.
// Ces tests couvrent les cas de rejet ; les tests d'acceptation sont dans
// les tests d'intégration (packages/engine).

describe('isDiagnostic — guard (rejections)', () => {
  it('rejette un objet vide', () => {
    expect(isDiagnostic({})).toBe(false)
  })

  it('rejette null', () => {
    expect(isDiagnostic(null)).toBe(false)
  })

  it('rejette si batiment est absent', () => {
    expect(isDiagnostic({
      date_visite: '2024-01-01',
      date_etablissement: '2024-01-15',
      enveloppe: {},
      chauffage: {},
      ecs: {},
      ventilation: {},
      refroidissement: {},
      production: {},
    })).toBe(false)
  })

  it('rejette si date_visite est absent', () => {
    expect(isDiagnostic({
      date_etablissement: '2024-01-15',
      batiment: {},
      enveloppe: {},
      chauffage: {},
      ecs: {},
      ventilation: {},
      refroidissement: {},
      production: {},
    })).toBe(false)
  })
})
