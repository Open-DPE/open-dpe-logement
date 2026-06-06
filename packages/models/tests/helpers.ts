// Fixtures réutilisables pour les tests de guards

export const UUID = '550e8400-e29b-41d4-a716-446655440000'
export const UUID2 = '550e8400-e29b-41d4-a716-446655440001'

export const ADRESSE = {
  ban_id: null,
  nom: '1 rue de la Paix',
  code_postal: '75001',
  code_insee: '75056',
  commune: 'Paris',
}

export const ISOLATION_SANS = {
  etat: false,
  type: null,
  annee_installation: null,
  epaisseur: null,
  resistance_thermique: null,
}

export const POSITION_EXTERIEUR = {
  surface: 20,
  mitoyennete: 'exterieur',
  local_non_chauffe_id: null,
}
