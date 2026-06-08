import type { UUID as UUIDType, PositiveNumber, Adresse } from '../src/common/common.js'
import type { Isolation } from '../src/enveloppe/common.js'

/** UUID de test n°1 */
export const UUID = '550e8400-e29b-41d4-a716-446655440000' as unknown as UUIDType
/** UUID de test n°2 */
export const UUID2 = '550e8400-e29b-41d4-a716-446655440001' as unknown as UUIDType

/** Convertit un nombre en PositiveNumber pour les fixtures de test */
export const p = (n: number): PositiveNumber => n as unknown as PositiveNumber

export const ADRESSE: Adresse = {
  ban_id: null,
  nom: '1 rue de la Paix',
  code_postal: '75001',
  code_insee: '75056',
  commune: 'Paris',
}

export const ISOLATION_SANS: Isolation = {
  etat: false,
  type: null,
  annee_installation: null,
  epaisseur: null,
  resistance_thermique: null,
}
