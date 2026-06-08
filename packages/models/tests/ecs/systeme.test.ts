import { describe, expect, it } from 'vitest'
import { isSysteme, type Systeme } from '../../src/ecs/systeme.js'
import { UUID, UUID2 } from '../helpers.js'

describe('isSysteme ECS — guard', () => {
  it('accepte un système ECS sans bouclage', () => {
    const systeme: Systeme = {
      id: UUID,
      description: 'Système ECS individuel',
      generateur_id: UUID2,
      reseau: {
        alimentation_contigue: true,
        niveaux_desservis: 1,
        isolation: null,
        bouclage: null,
      },
    }
    expect(isSysteme(systeme)).toBe(true)
  })

  it('accepte un système ECS avec bouclage', () => {
    const systeme: Systeme = {
      id: UUID,
      description: 'Système ECS collectif bouclé',
      generateur_id: UUID2,
      reseau: {
        alimentation_contigue: false,
        niveaux_desservis: 5,
        isolation: true,
        bouclage: 'boucle',
      },
    }
    expect(isSysteme(systeme)).toBe(true)
  })
})
