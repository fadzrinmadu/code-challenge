import { useEffect, useMemo, useRef, useState } from 'react'
import type { Token } from '../types'
import { TokenIcon } from './TokenIcon'
import { formatBalance, formatUsd } from '../format'

interface TokenSelectModalProps {
  tokens: Token[]
  balances: Record<string, number>
  excludeSymbol?: string
  onSelect: (token: Token) => void
  onClose: () => void
}

export function TokenSelectModal({
  tokens,
  balances,
  excludeSymbol,
  onSelect,
  onClose,
}: TokenSelectModalProps) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tokens.filter((t) => t.symbol.toLowerCase().includes(q))
  }, [tokens, query])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Select a token
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer text-xl leading-none px-1"
          >
            ✕
          </button>
        </div>
        <div className="px-5 pb-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search token symbol"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-violet-400"
          />
        </div>
        <div className="overflow-y-auto px-2 pb-3">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-slate-400 py-8">
              No tokens found
            </p>
          )}
          {filtered.map((token) => {
            const disabled = token.symbol === excludeSymbol
            return (
              <button
                type="button"
                key={token.symbol}
                disabled={disabled}
                onClick={() => onSelect(token)}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <TokenIcon symbol={token.symbol} icon={token.icon} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 dark:text-white truncate">
                    {token.symbol}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatUsd(token.price)}
                  </p>
                </div>
                <p className="text-sm text-slate-400 shrink-0">
                  {formatBalance(balances[token.symbol] ?? 0)}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
