import { describe, expect, it } from 'vitest'
import { isRefroidissement, type Refroidissement } from '../../src/refroidissement/refroidissement.js'

describe('isRefroidissement — guard', () => {
  it('accepte un refroidissement sans équipement', () => {
    const refroidissement: Refroidissement = {
      generateurs: [],
      installations: [],
    }
    expect(isRefroidissement(refroidissement)).toBe(true)
  })
})
