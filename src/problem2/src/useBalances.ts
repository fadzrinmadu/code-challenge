import { useMemo } from 'react'
import type { Token } from './types'

function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

export function useBalances(tokens: Token[]): Record<string, number> {
  return useMemo(() => {
    const balances: Record<string, number> = {}
    for (const token of tokens) {
      const magnitude = token.price > 100 ? 5 : token.price > 1 ? 50 : 2000
      balances[token.symbol] = Math.round(seededRandom(token.symbol) * magnitude * 100) / 100
    }
    return balances
  }, [tokens])
}
