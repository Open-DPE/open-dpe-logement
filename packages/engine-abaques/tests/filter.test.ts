import { describe, expect, it } from 'vitest'
import { filter } from '../src/filter.js'

describe('filter — enum string (pipe-séparé)', () => {
  it('match exacte sur valeur unique', () => {
    const rows = [
      { zone_climatique: 'H1a', nhecl: 1500 },
      { zone_climatique: 'H1b', nhecl: 1445 },
    ]
    expect(filter({ zone_climatique: 'H1a' }, rows)).toEqual([
      { zone_climatique: 'H1a', nhecl: 1500 },
    ])
  })

  it('match sur valeur dans une chaîne pipe-séparée', () => {
    const rows = [{ zone_climatique: 'H1a|H1b|H1c', etiquette: 'A' }]
    expect(filter({ zone_climatique: 'H1b' }, rows)).toEqual([
      { zone_climatique: 'H1a|H1b|H1c', etiquette: 'A' },
    ])
  })

  it('pas de match si valeur absente de la chaîne', () => {
    const rows = [{ zone_climatique: 'H1a|H1b', etiquette: 'A' }]
    expect(filter({ zone_climatique: 'H3' }, rows)).toEqual([])
  })

  it('cellule null = wildcard', () => {
    const rows = [{ type_ventilation: null, qvarep_conv: 1.97 }]
    expect(filter({ type_ventilation: 'vmc_double_flux' }, rows)).toEqual([
      { type_ventilation: null, qvarep_conv: 1.97 },
    ])
  })
})

describe('filter — booléen', () => {
  it('match true', () => {
    const rows = [
      { effet_joule: true, u: 1.2 },
      { effet_joule: false, u: 0.8 },
    ]
    expect(filter({ effet_joule: true }, rows)).toEqual([{ effet_joule: true, u: 1.2 }])
  })

  it('match false', () => {
    const rows = [
      { effet_joule: true, u: 1.2 },
      { effet_joule: false, u: 0.8 },
    ]
    expect(filter({ effet_joule: false }, rows)).toEqual([{ effet_joule: false, u: 0.8 }])
  })

  it('cellule null = wildcard pour booléen', () => {
    const rows = [{ chauffage_central: null, i0: 0.91 }]
    expect(filter({ chauffage_central: true }, rows)).toEqual([{ chauffage_central: null, i0: 0.91 }])
  })
})

describe('filter — range (clés plates /gte /lte /gt /lt /eq)', () => {
  it('match dans un intervalle [gte, lte]', () => {
    const rows = [
      { 'annee/gte': 1982, 'annee/lte': 2000, qvarep_conv: 1.65 },
      { 'annee/gte': 2001, 'annee/lte': 2012, qvarep_conv: 1.5 },
    ]
    expect(filter({ annee: 1995 }, rows)).toEqual([
      { 'annee/gte': 1982, 'annee/lte': 2000, qvarep_conv: 1.65 },
    ])
  })

  it('pas de match hors intervalle', () => {
    const rows = [{ 'annee/gte': 1982, 'annee/lte': 2000, qvarep_conv: 1.65 }]
    expect(filter({ annee: 2015 }, rows)).toEqual([])
  })

  it('borne null = pas de restriction', () => {
    const rows = [{ 'annee/gte': null, 'annee/lte': 1981, qvarep_conv: 1.97 }]
    expect(filter({ annee: 1970 }, rows)).toEqual([
      { 'annee/gte': null, 'annee/lte': 1981, qvarep_conv: 1.97 },
    ])
  })

  it('applique gt (strictement supérieur)', () => {
    const rows = [
      { 'pdim/gt': 5, 'pdim/lte': 10, pn: 18 },
      { 'pdim/gt': null, 'pdim/lte': 5, pn: 12 },
    ]
    expect(filter({ pdim: 5 }, rows)).toEqual([{ 'pdim/gt': null, 'pdim/lte': 5, pn: 12 }])
    expect(filter({ pdim: 6 }, rows)).toEqual([{ 'pdim/gt': 5, 'pdim/lte': 10, pn: 18 }])
  })

  it('applique lt (strictement inférieur)', () => {
    const rows = [{ 'cep/lt': 70, etiquette: 'A' }]
    expect(filter({ cep: 69 }, rows)).toEqual([{ 'cep/lt': 70, etiquette: 'A' }])
    expect(filter({ cep: 70 }, rows)).toEqual([])
  })

  it('applique eq', () => {
    const rows = [
      { 'volume/eq': 100, cr: 0.75 },
      { 'volume/eq': 200, cr: 0.8 },
    ]
    expect(filter({ volume: 100 }, rows)).toEqual([{ 'volume/eq': 100, cr: 0.75 }])
  })

  it('rejette si queryValue non numérique pour range', () => {
    const rows = [{ 'annee/gte': 1982, 'annee/lte': 2000, qvarep_conv: 1.65 }]
    expect(filter({ annee: '1995abc' }, rows)).toEqual([])
  })
})

describe('filter — combiné', () => {
  it('match string pipe + range simultanément', () => {
    const rows = [
      { type_ventilation: 'vmc_double_flux', 'annee/gte': null, 'annee/lte': 2012, debit: 0.6 },
      { type_ventilation: 'vmc_double_flux', 'annee/gte': 2013, 'annee/lte': null, debit: 0.26 },
      { type_ventilation: 'vmc_simple_flux', 'annee/gte': null, 'annee/lte': 2012, debit: 1.97 },
    ]
    expect(filter({ type_ventilation: 'vmc_double_flux', annee: 2010 }, rows)).toEqual([
      { type_ventilation: 'vmc_double_flux', 'annee/gte': null, 'annee/lte': 2012, debit: 0.6 },
    ])
  })

  it('queryValue undefined = wildcard (critère ignoré)', () => {
    const rows = [
      { zone_climatique: 'H1a', u: 1.2 },
      { zone_climatique: 'H2b', u: 0.8 },
    ]
    expect(filter({ zone_climatique: undefined }, rows)).toEqual(rows)
  })
})
