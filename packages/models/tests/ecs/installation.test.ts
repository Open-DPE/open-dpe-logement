import { describe, expect, it } from 'vitest'
import { isInstallation, type Installation } from '../../src/ecs/installation.js'
import { type Systeme } from '../../src/ecs/systeme.js'
import { UUID, UUID2, p } from '../helpers.js'

const SYSTEME: Systeme = {
  id: UUID2,
  description: 'Système ECS',
  generateur_id: UUID2,
  reseau: {
    alimentation_contigue: true,
    niveaux_desservis: 1,
    isolation: null,
    bouclage: null,
  },
}

describe('isInstallation ECS — guard', () => {
  it('accepte une installation ECS individuelle avec 1 système', () => {
    const installation: Installation = {
      id: UUID,
      description: 'Installation ECS individuelle',
      surface: p(80),
      installation_collective: false,
      systemes: [SYSTEME],
      solaire_thermique: null,
    }
    expect(isInstallation(installation)).toBe(true)
  })
})
