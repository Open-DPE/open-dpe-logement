import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  isInstallation,
  type Installation,
  type InstallationNaturelle,
  type InstallationMecanique,
  type InstallationVMCDoubleFlux,
} from '../../src/ventilation/installation.js'
import type { UUID } from '../../src/common/common.js'
import { UUID as FIXTURE_UUID } from '../helpers.js'

// ─── Types ───────────────────────────────────────────────────────────────────

describe('Installation ventilation — types', () => {
  it('est une union des 4 variantes', () => {
    expectTypeOf<Installation>().toMatchTypeOf<
      InstallationNaturelle | InstallationMecanique | InstallationVMCDoubleFlux
    >()
  })

  it('id est un UUID requis', () => {
    expectTypeOf<Installation['id']>().toEqualTypeOf<UUID>()
  })

  it('InstallationNaturelle a annee_installation null', () => {
    expectTypeOf<InstallationNaturelle['annee_installation']>().toBeNull()
  })

  it('InstallationNaturelle a installation_collective null', () => {
    expectTypeOf<InstallationNaturelle['installation_collective']>().toBeNull()
  })

  it('InstallationMecanique a installation_collective obligatoire', () => {
    expectTypeOf<InstallationMecanique['installation_collective']>().toEqualTypeOf<boolean>()
  })
})

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_NATURELLE: unknown = {
  id: FIXTURE_UUID,
  description: 'Ventilation naturelle par conduit',
  surface: 80,
  type: 'ventilation_naturelle_conduit',
  annee_installation: null,
  installation_collective: null,
  presence_echangeur_thermique: null,
}

const VALID_VMC_SIMPLE: unknown = {
  id: FIXTURE_UUID,
  description: 'VMC simple flux autoréglable',
  surface: 80,
  type: 'vmc_simple_flux_autoreglable',
  annee_installation: 2010,
  installation_collective: false,
  presence_echangeur_thermique: null,
}

const VALID_VMC_DOUBLE_FLUX: unknown = {
  id: FIXTURE_UUID,
  description: 'VMC double flux',
  surface: 80,
  type: 'vmc_double_flux',
  annee_installation: 2015,
  installation_collective: false,
  presence_echangeur_thermique: true,
}

describe('isInstallation ventilation — guard', () => {
  it('accepte une installation naturelle valide', () => {
    expect(isInstallation(VALID_NATURELLE)).toBe(true)
  })

  it('accepte une VMC simple flux valide', () => {
    expect(isInstallation(VALID_VMC_SIMPLE)).toBe(true)
  })

  it('accepte une VMC double flux valide', () => {
    expect(isInstallation(VALID_VMC_DOUBLE_FLUX)).toBe(true)
  })

  it('rejette si type est invalide', () => {
    expect(isInstallation({ ...VALID_NATURELLE as object, type: 'vmc_inconnue' })).toBe(false)
  })

  it('rejette si id est absent', () => {
    const { id: _, ...rest } = VALID_NATURELLE as { id: unknown }
    expect(isInstallation(rest)).toBe(false)
  })

  it('rejette null', () => {
    expect(isInstallation(null)).toBe(false)
  })
})
