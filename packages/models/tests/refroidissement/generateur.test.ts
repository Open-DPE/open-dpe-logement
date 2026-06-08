import { describe, expect, it } from 'vitest'
import {
  isGenerateur,
  type GenerateurPAC,
  type GenerateurClimatiseur,
  type GenerateurReseauFroid,
} from '../../src/refroidissement/generateur.js'
import { UUID } from '../helpers.js'

describe('isGenerateur refroidissement — guard', () => {
  it('accepte une PAC air/air', () => {
    const generateur: GenerateurPAC = {
      id: UUID,
      description: 'PAC air/air réversible',
      type: 'pac_air_air',
      energie: 'electricite',
      annee_installation: 2018,
      seer: null,
      reseau_froid_id: null,
    }
    expect(isGenerateur(generateur)).toBe(true)
  })

  it('accepte un climatiseur monosplit', () => {
    const generateur: GenerateurClimatiseur = {
      id: UUID,
      description: 'Climatiseur monosplit',
      type: 'autre',
      energie: 'electricite',
      annee_installation: 2020,
      seer: null,
      reseau_froid_id: null,
    }
    expect(isGenerateur(generateur)).toBe(true)
  })

  it('accepte un réseau de froid', () => {
    const generateur: GenerateurReseauFroid = {
      id: UUID,
      description: 'Réseau de froid urbain',
      type: 'reseau_froid',
      energie: 'reseau_froid',
      annee_installation: null,
      seer: null,
      reseau_froid_id: null,
    }
    expect(isGenerateur(generateur)).toBe(true)
  })
})
