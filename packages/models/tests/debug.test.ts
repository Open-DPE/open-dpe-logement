import { describe, it } from 'vitest'
import { validate, SCHEMA_KEYS } from '@open-dpe-logement/schemas'

const UUID = '550e8400-e29b-41d4-a716-446655440000'
const UUID2 = '550e8400-e29b-41d4-a716-446655440001'
const ISOLATION_SANS = { etat: false, type: null, annee_installation: null, epaisseur: null, resistance_thermique: null }
const POSITION_EXT = { surface: 20, mitoyennete: 'exterieur', local_non_chauffe_id: null }

function dbg(key: keyof typeof SCHEMA_KEYS, obj: unknown) {
  const result = validate(SCHEMA_KEYS[key], obj)
  if (result !== true) console.log(key, 'ERRORS:', JSON.stringify(result, null, 2))
  else console.log(key, '=> true')
}

describe('debug validation', () => {
  it('mur', () => {
    dbg('enveloppe/mur', {
      id: UUID, description: 'Mur nord', structures: [], type_doublage: null,
      presence_enduit_isolant: null, inertie: null, annee_construction: null,
      annee_renovation: null, u0: null, u: null,
      position: { ...POSITION_EXT, orientation: 'nord' },
      isolation: ISOLATION_SANS,
    })
  })

  it('plancher-bas', () => {
    dbg('enveloppe/plancher-bas', {
      id: UUID, description: 'Plancher', type: null, inertie: null,
      annee_construction: null, annee_renovation: null, u0: null, u: null,
      position: { ...POSITION_EXT, surface_ue: null, perimetre_ue: null },
      isolation: ISOLATION_SANS,
    })
  })

  it('plancher-haut', () => {
    dbg('enveloppe/plancher-haut', {
      id: UUID, description: 'Toiture', configuration: 'terrasse', type: null,
      inertie: null, annee_construction: null, annee_renovation: null, u0: null, u: null,
      position: { ...POSITION_EXT, orientation: 'horizontale' },
      isolation: ISOLATION_SANS,
    })
  })

  it('porte', () => {
    dbg('enveloppe/porte', {
      id: UUID, description: 'Porte', isolation: null, materiau: null,
      annee_installation: null, u: null,
      position: { ...POSITION_EXT, paroi_id: null, orientation: 'nord', type_pose: 'nu_interieur', presence_sas: false },
      menuiserie: { largeur_dormant: null, presence_joint: null, presence_retour_isolation: null },
      vitrage: null,
    })
  })

  it('baie brique verre', () => {
    dbg('enveloppe/baie', {
      id: UUID, description: 'Brique de verre', type: 'brique_verre_pleine',
      presence_protection_solaire: false, type_fermeture: 'sans_fermeture',
      annee_installation: null, ug: null, uw: null, ujn: null, sw: null,
      position: { ...POSITION_EXT, paroi_id: null, baie_id: null, type_pose: 'nu_interieur', inclinaison: 90, orientation: 'nord', masques: [] },
      menuiserie: null,
      vitrage: { type: 'brique_verre', nature_lame: null, epaisseur_lame: null },
      survitrage: null,
    })
  })

  it('chauffage/systeme divise', () => {
    dbg('chauffage/systeme', {
      id: UUID, description: 'Système divise', type: 'divise', generateur_id: UUID2, reseau: null,
    })
  })

  it('chauffage/installation', () => {
    const systeme = { id: UUID2, description: 'Système', type: 'divise', generateur_id: UUID2, reseau: null }
    dbg('chauffage/installation', {
      id: UUID, description: 'Installation', surface: 80, type: 'divise',
      installation_collective: false, comptage_individuel: null, regulation_terminale: null,
      programmation: 'absent', solaire_thermique: null, systemes: [systeme],
    })
  })
})
