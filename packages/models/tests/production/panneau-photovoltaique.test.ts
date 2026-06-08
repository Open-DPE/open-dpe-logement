import { describe, expect, it } from 'vitest'
import { isPanneauPhotovoltaique, type PanneauPhotovoltaique } from '../../src/production/panneau-photovoltaique.js'
import { UUID } from '../helpers.js'

describe('isPanneauPhotovoltaique — guard', () => {
  it('accepte des panneaux en toiture orientés sud', () => {
    const panneau: PanneauPhotovoltaique = {
      id: UUID,
      description: 'Panneaux toiture sud',
      orientation: 'sud',
      inclinaison: 30,
      modules: 12,
      surface: null,
      installation_collective: false,
    }
    expect(isPanneauPhotovoltaique(panneau)).toBe(true)
  })
})
