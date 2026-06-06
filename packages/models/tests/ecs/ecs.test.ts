import { describe, expect, expectTypeOf, it } from 'vitest'
import { isEcs, type Ecs } from '../../src/ecs/ecs.js'
import type { NonEmptyArray } from '../../src/common/common.js'
import type { Generateur } from '../../src/ecs/generateur.js'
import type { Installation } from '../../src/ecs/installation.js'
import { UUID, UUID2 } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Ecs — types', () => {
  it('generateurs est un tableau non vide', () => {
    expectTypeOf<Ecs['generateurs']>().toEqualTypeOf<NonEmptyArray<Generateur>>()
  })

  it('installations est un tableau non vide', () => {
    expectTypeOf<Ecs['installations']>().toEqualTypeOf<NonEmptyArray<Installation>>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const GENERATEUR_CHAUFFE_EAU: unknown = {
  id: UUID,
  description: 'Chauffe-eau électrique',
  type: 'chauffe_eau',
  energie: 'electricite',
  bienergie: null,
  annee_installation: 2010,
  position: {
    position_chauffe_eau: 'chauffe_eau_vertical',
    generateur_collectif: false,
    generateur_multi_batiment: false,
    position_volume_chauffe: false,
    generateur_mixte_id: null,
    reseau_chaleur_id: null,
  },
  stockage: { volume: 200, type: 'integre', position_volume_chauffe: false },
  signaletique: { pn: 2.5, cop: null, label: null, mode_combustion: null, presence_ventouse: null, pveilleuse: null, qp0: null, rpn: null },
}

const SYSTEME_ECS: unknown = {
  id: UUID2,
  description: 'Système ECS',
  generateur_id: UUID,
  reseau: { alimentation_contigue: true, niveaux_desservis: 1, isolation: null, bouclage: null },
}

const INSTALLATION_ECS: unknown = {
  id: UUID2,
  description: 'Installation ECS',
  surface: 80,
  installation_collective: false,
  systemes: [SYSTEME_ECS],
  solaire_thermique: null,
}

const VALID_ECS: unknown = {
  generateurs: [GENERATEUR_CHAUFFE_EAU],
  installations: [INSTALLATION_ECS],
}

describe('isEcs — guard', () => {
  it('accepte un ECS valide', () => {
    expect(isEcs(VALID_ECS)).toBe(true)
  })

  it('rejette si generateurs est vide', () => {
    expect(isEcs({ ...VALID_ECS as object, generateurs: [] })).toBe(false)
  })

  it('rejette si installations est vide', () => {
    expect(isEcs({ ...VALID_ECS as object, installations: [] })).toBe(false)
  })

  it('rejette si generateurs est absent', () => {
    const { generateurs: _, ...rest } = VALID_ECS as { generateurs: unknown }
    expect(isEcs(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isEcs(null)).toBe(false)
  })
})
