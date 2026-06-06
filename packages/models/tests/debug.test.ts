import { describe, it } from 'vitest'
import { validate, SCHEMA_KEYS } from '@open-dpe-logement/schemas'

describe('debug validation', () => {
  it('batiment maison', () => {
    const obj = {
      rnb_id: null,
      type: 'maison',
      annee_construction: 1990,
      annee_renovation: null,
      altitude: 100,
      logements: 1,
      surface_habitable: 80,
      hauteur_sous_plafond: 2.5,
      materiaux_anciens: false,
      adresse: { ban_id: null, nom: '1 rue', code_postal: '75001', code_insee: '75056', commune: 'Paris' },
      appartements_visites: [],
      logement: null,
    }
    const result = validate(SCHEMA_KEYS['batiment'], obj)
    console.log('batiment result:', JSON.stringify(result, null, 2))
  })

  it('emetteur', () => {
    const obj = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      description: 'Radiateur bitube',
      type: 'radiateur_bitube',
      temperature_distribution: null,
      presence_robinet_thermostatique: true,
      annee_installation: null,
    }
    const result = validate(SCHEMA_KEYS['chauffage/emetteur'], obj)
    console.log('emetteur result:', JSON.stringify(result, null, 2))
  })
})
