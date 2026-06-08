import { describe, expect, it } from 'vitest'
import {
  isGenerateur,
  type PAC,
  type ReseauChaleur,
  type PoeleBouilleur,
} from '../../src/chauffage/generateur.js'
import { UUID, p } from '../helpers.js'

const BASE_SIGNALETIQUE = {
  pn: null,
  label: null,
  scop: null,
  mode_combustion: null,
  presence_ventouse: null,
  presence_regulation: null,
  pveilleuse: null,
  qp0: null,
  rpn: null,
  rpint: null,
  tfonc30: null,
  tfonc100: null,
}

const BASE_POSITION = {
  cascade: null,
  position_chaudiere: null,
  generateur_collectif: false,
  generateur_multi_batiment: false,
  position_volume_chauffe: false,
  generateur_mixte_id: null,
  reseau_chaleur_id: null,
}

describe('isGenerateur chauffage — guard', () => {
  it('accepte une PAC air/eau', () => {
    const pac: PAC = {
      id: UUID,
      description: 'PAC air/eau',
      type: 'pac_air_eau',
      energie: 'electricite',
      bienergie: null,
      annee_installation: 2015,
      position: { ...BASE_POSITION },
      signaletique: { ...BASE_SIGNALETIQUE, pn: p(8), scop: p(3.5) },
    }
    expect(isGenerateur(pac)).toBe(true)
  })

  it('accepte un réseau de chaleur', () => {
    const reseau: ReseauChaleur = {
      id: UUID,
      description: 'Réseau de chaleur urbain',
      type: 'reseau_chaleur',
      energie: 'reseau_chaleur',
      bienergie: null,
      annee_installation: null,
      position: {
        cascade: null,
        position_chaudiere: null,
        generateur_collectif: true,
        generateur_multi_batiment: true,
        position_volume_chauffe: false,
        generateur_mixte_id: null,
        reseau_chaleur_id: null,
      },
      signaletique: {
        pn: null, label: null, scop: null, mode_combustion: null,
        presence_ventouse: null, presence_regulation: null,
        pveilleuse: null, qp0: null, rpn: null, rpint: null,
        tfonc30: null, tfonc100: null,
      },
    }
    expect(isGenerateur(reseau)).toBe(true)
  })

  it('accepte un poêle bouilleur bois granulé', () => {
    const poele: PoeleBouilleur = {
      id: UUID,
      description: 'Poêle bouilleur bois granulé',
      type: 'poele_bouilleur',
      energie: 'bois_granule',
      bienergie: null,
      annee_installation: 2018,
      position: {
        cascade: null,
        position_chaudiere: null,
        generateur_collectif: false,
        generateur_multi_batiment: false,
        position_volume_chauffe: true,
        generateur_mixte_id: null,
        reseau_chaleur_id: null,
      },
      signaletique: { ...BASE_SIGNALETIQUE, pn: p(15) },
    }
    expect(isGenerateur(poele)).toBe(true)
  })
})
