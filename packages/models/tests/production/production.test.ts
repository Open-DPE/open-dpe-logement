import { describe, expect, it } from 'vitest'
import { isProduction, type Production } from '../../src/production/production.js'

describe('isProduction — guard', () => {
  it('accepte une production sans panneaux', () => {
    const production: Production = {
      panneaux_photovoltaiques: [],
    }
    expect(isProduction(production)).toBe(true)
  })
})
