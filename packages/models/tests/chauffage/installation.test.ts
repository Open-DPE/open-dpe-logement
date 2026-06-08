import { describe, expect, it } from 'vitest'
import { isInstallation, type Installation } from '../../src/chauffage/installation.js'
import { type SystemeDivise } from '../../src/chauffage/systeme.js'
import { UUID, UUID2, p } from '../helpers.js'

const SYSTEME_DIVISE: SystemeDivise = {
  id: UUID2,
  description: 'Système divise',
  type: 'divise',
  generateur_id: UUID2,
  reseau: null,
}

describe('isInstallation chauffage — guard', () => {
  it('accepte une installation de chauffage divise', () => {
    const installation: Installation = {
      id: UUID,
      description: 'Installation chauffage principale',
      surface: p(80),
      type: 'divise',
      installation_collective: false,
      comptage_individuel: null,
      regulation_terminale: null,
      programmation: 'absent',
      solaire_thermique: null,
      systemes: [SYSTEME_DIVISE],
    }
    expect(isInstallation(installation)).toBe(true)
  })
})
