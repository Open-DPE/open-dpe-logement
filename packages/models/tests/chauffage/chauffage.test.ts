import { describe, expect, it } from 'vitest'
import { isChauffage, type Chauffage } from '../../src/chauffage/chauffage.js'
import { type PAC } from '../../src/chauffage/generateur.js'
import { type Emetteur } from '../../src/chauffage/emetteur.js'
import { type SystemeDivise } from '../../src/chauffage/systeme.js'
import { type Installation } from '../../src/chauffage/installation.js'
import { UUID, UUID2, p } from '../helpers.js'

const EMETTEUR: Emetteur = {
  id: UUID2,
  description: 'Radiateur',
  type: 'radiateur',
  temperature_distribution: null,
  presence_robinet_thermostatique: true,
  annee_installation: null,
}

const PAC_GEN: PAC = {
  id: UUID,
  description: 'PAC air/eau',
  type: 'pac_air_eau',
  energie: 'electricite',
  bienergie: null,
  annee_installation: 2015,
  position: {
    cascade: null, position_chaudiere: null,
    generateur_collectif: false, generateur_multi_batiment: false,
    position_volume_chauffe: false, generateur_mixte_id: null, reseau_chaleur_id: null,
  },
  signaletique: {
    pn: p(8), scop: p(3.5), label: null, mode_combustion: null,
    presence_ventouse: null, presence_regulation: null,
    pveilleuse: null, qp0: null, rpn: null, rpint: null, tfonc30: null, tfonc100: null,
  },
}

const SYSTEME: SystemeDivise = {
  id: UUID2,
  description: 'Système divise',
  type: 'divise',
  generateur_id: UUID,
  reseau: null,
}

const INSTALLATION: Installation = {
  id: UUID2,
  description: 'Installation principale',
  surface: p(80),
  type: 'divise',
  installation_collective: false,
  comptage_individuel: null,
  regulation_terminale: null,
  programmation: 'absent',
  solaire_thermique: null,
  systemes: [SYSTEME],
}

describe('isChauffage — guard', () => {
  it('accepte un chauffage valide', () => {
    const chauffage: Chauffage = {
      emetteurs: [EMETTEUR],
      generateurs: [PAC_GEN],
      installations: [INSTALLATION],
    }
    expect(isChauffage(chauffage)).toBe(true)
  })
})
