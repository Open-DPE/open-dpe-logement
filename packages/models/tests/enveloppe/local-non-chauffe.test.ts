import { describe, expect, it } from 'vitest'
import {
  isLocalNonChauffe,
  type AutreLocalNonChauffe,
  type EspaceTamponSolarise,
  type Paroi,
  type Baie,
} from '../../src/enveloppe/local-non-chauffe.js'
import { UUID, UUID2, p } from '../helpers.js'

const PAROI_LNC: Paroi = {
  id: UUID2,
  description: 'Paroi extérieure',
  isolation: null,
  position: { mitoyennete: 'exterieur', surface: 10 },
}

const BAIE_LNC: Baie = {
  id: UUID2,
  description: 'Fenêtre LNC',
  type_vitrage: 'double_vitrage',
  materiau_menuiserie: 'pvc',
  presence_rupteur_pont_thermique: null,
  position: {
    mitoyennete: 'exterieur',
    surface: 2,
    orientation: 'sud',
    inclinaison: 90,
  },
}

describe('isLocalNonChauffe — guard', () => {
  it('accepte un garage (autre local non chauffé)', () => {
    const lnc: AutreLocalNonChauffe = {
      id: UUID,
      description: 'Garage attenant',
      type: 'garage',
      parois: [PAROI_LNC],
      baies: [],
    }
    expect(isLocalNonChauffe(lnc)).toBe(true)
  })

  it('accepte un espace tampon solarisé', () => {
    const lnc: EspaceTamponSolarise = {
      id: UUID,
      description: 'Véranda',
      type: 'espace_tampon_solarise',
      parois: [],
      baies: [BAIE_LNC],
    }
    expect(isLocalNonChauffe(lnc)).toBe(true)
  })
})
