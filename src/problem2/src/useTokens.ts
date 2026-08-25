import { useMemo } from 'react'
import prices from './data/prices.json'
import type { Token } from './types'

export function useTokens(): Token[] {
  return useMemo(
    () =>
      prices
        .map((p) => ({
          symbol: p.currency,
          price: p.price,
          icon: `/tokens/${p.currency}.svg`,
        }))
        .sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [],
  )
}
