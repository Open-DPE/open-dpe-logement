import { describe, expect, expectTypeOf, it } from 'vitest'
import { isChauffage, type Chauffage } from '../../src/chauffage/chauffage.js'
import type { NonEmptyArray } from '../../src/common/common.js'
import type { Generateur } from '../../src/chauffage/generateur.js'
import type { Installation } from '../../src/chauffage/installation.js'
import { UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Chauffage — types', () => {
  it('generateurs est un tableau non vide', () => {
    expectTypeOf<Chauffage['generateurs']>().toEqualTypeOf<NonEmptyArray<Generateur>>()
  })

  it('installations est un tableau non vide', () => {
    expectTypeOf<Chauffage['installations']>().toEqualTypeOf<NonEmptyArray<Installation>>()
  })

  it('emetteurs est un tableau (peut être vide)', () => {
    expectTypeOf<Chauffage['emetteurs']>().toMatchTypeOf<unknown[]>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const GENERATEUR_PAC: unknown = {
  id: UUID,
  description: 'PAC air/eau',
  type: 'pac_air_eau',
  energie: 'electricite',
  bienergie: null,
  annee_installation: 2015,
  position: {
    cascade: null,
    position_chaudiere: null,
    generateur_collectif: false,
    generateur_multi_batiment: false,
    position_volume_chauffe: false,
    generateur_mixte_id: null,
    reseau_chaleur_id: null,
  },
  signaletique: {
    pn: 8,
    label: null,
    scop: 3.5,
    mode_combustion: null,
    presence_ventouse: null,
    presence_regulation: null,
    pveilleuse: null,
    qp0: null,
    rpn: null,
    rpint: null,
    tfonc30: null,
    tfonc100: null,
  },
}

const EMETTEUR: unknown = {
  id: UUID2,
  description: 'Radiateur',
  type: 'radiateur',
  temperature_distribution: null,
  presence_robinet_thermostatique: true,
  annee_installation: null,
}

const SYSTEME: unknown = {
  id: UUID2,
  description: 'Système divise PAC',
  type: 'divise',
  generateur_id: UUID,
  reseau: null,
}

const INSTALLATION: unknown = {
  id: UUID2,
  description: 'Installation principale',
  surface: 80,
  type: 'divise',
  installation_collective: false,
  comptage_individuel: null,
  regulation_terminale: null,
  programmation: 'absent',
  solaire_thermique: null,
  systemes: [SYSTEME],
}

const VALID_CHAUFFAGE: unknown = {
  emetteurs: [EMETTEUR],
  generateurs: [GENERATEUR_PAC],
  installations: [INSTALLATION],
}

describe('isChauffage — guard', () => {
  it('accepte un chauffage valide', () => {
    expect(isChauffage(VALID_CHAUFFAGE)).toBe(true)
  })

  it('rejette si generateurs est vide', () => {
    expect(isChauffage({ ...VALID_CHAUFFAGE as object, generateurs: [] })).toBe(false)
  })

  it('rejette si installations est vide', () => {
    expect(isChauffage({ ...VALID_CHAUFFAGE as object, installations: [] })).toBe(false)
  })

  it('rejette si generateurs est absent', () => {
    const { generateurs: _, ...rest } = VALID_CHAUFFAGE as { generateurs: unknown }
    expect(isChauffage(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isChauffage(null)).toBe(false)
  })
})
