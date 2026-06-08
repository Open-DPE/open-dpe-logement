import { describe, expect, it } from 'vitest'
import { isInstallation, type Installation } from '../../src/refroidissement/installation.js'
import { UUID, UUID2 } from '../helpers.js'

describe('isInstallation refroidissement — guard', () => {
  it('accepte une installation de refroidissement valide', () => {
    const installation: Installation = {
      id: UUID,
      description: 'Installation refroidissement réversible',
      surface: 80,
      generateurs: [UUID2],
    }
    expect(isInstallation(installation)).toBe(true)
  })
})
