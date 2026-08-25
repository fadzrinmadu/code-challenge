import type { Token } from '../types'
import { TokenIcon } from './TokenIcon'
import { formatBalance, formatUsd } from '../format'

interface AmountPanelProps {
  label: string
  token: Token | null
  amount: string
  onAmountChange?: (value: string) => void
  readOnly?: boolean
  balance?: number
  onSelectToken: () => void
  onMax?: () => void
  error?: string
}

export function AmountPanel({
  label,
  token,
  amount,
  onAmountChange,
  readOnly = false,
  balance,
  onSelectToken,
  onMax,
  error,
}: AmountPanelProps) {
  const usdValue = token && amount ? Number(amount) * token.price : 0

  return (
    <div
      className={`rounded-2xl border bg-slate-50 dark:bg-slate-800/60 p-4 transition-colors ${
        error
          ? 'border-red-400 dark:border-red-500'
          : 'border-slate-200 dark:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {label}
        </span>
        {token && balance !== undefined && (
          <button
            type="button"
            onClick={onMax}
            disabled={!onMax}
            className="text-xs text-slate-400 hover:text-violet-500 disabled:hover:text-slate-400 transition-colors cursor-pointer disabled:cursor-default"
          >
            Balance: {formatBalance(balance)}
          </button>
        )}
      </div>
      <div className="flex items-center gap-3">
        <input
          type="text"
          inputMode="decimal"
          placeholder="0.0"
          value={amount}
          readOnly={readOnly}
          onChange={(e) => onAmountChange?.(e.target.value)}
          className="w-0 flex-1 bg-transparent text-2xl font-semibold text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 outline-none disabled:opacity-60"
        />
        <button
          type="button"
          onClick={onSelectToken}
          className="flex items-center gap-2 shrink-0 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 pl-2 pr-3 py-1.5 font-semibold text-slate-900 dark:text-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
        >
          {token ? (
            <>
              <TokenIcon symbol={token.symbol} icon={token.icon} size={24} />
              <span>{token.symbol}</span>
            </>
          ) : (
            <span className="text-slate-400 px-1">Select token</span>
          )}
          <span className="text-slate-400 text-xs">▾</span>
        </button>
      </div>
      <div className="mt-1 flex items-center justify-between h-4">
        <p className="text-xs text-slate-400">
          {token && amount ? formatUsd(usdValue) : ''}
        </p>
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>
    </div>
  )
}
