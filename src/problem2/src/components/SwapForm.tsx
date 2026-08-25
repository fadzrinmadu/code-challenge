import { useMemo, useState, type FormEvent } from 'react'
import { useTokens } from '../useTokens'
import { useBalances } from '../useBalances'
import type { Token } from '../types'
import { AmountPanel } from './AmountPanel'
import { TokenSelectModal } from './TokenSelectModal'
import { formatAmount } from '../format'

type SelectorTarget = 'from' | 'to' | null
type ActiveSide = 'from' | 'to'

const AMOUNT_PATTERN = /^\d*\.?\d*$/

export function SwapForm() {
  const tokens = useTokens()
  const balances = useBalances(tokens)

  const defaultFrom = tokens.find((t) => t.symbol === 'ETH') ?? tokens[0]
  const defaultTo = tokens.find((t) => t.symbol === 'USDC') ?? tokens[1]

  const [fromToken, setFromToken] = useState<Token | null>(defaultFrom)
  const [toToken, setToToken] = useState<Token | null>(defaultTo)
  const [activeSide, setActiveSide] = useState<ActiveSide>('from')
  const [rawAmount, setRawAmount] = useState('')
  const [selector, setSelector] = useState<SelectorTarget>(null)
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle',
  )

  const rate = useMemo(() => {
    if (!fromToken || !toToken || toToken.price === 0) return 0
    return fromToken.price / toToken.price
  }, [fromToken, toToken])

  const { fromAmount, toAmount } = useMemo(() => {
    const numeric = Number(rawAmount)
    const valid = rawAmount !== '' && Number.isFinite(numeric)

    if (activeSide === 'from') {
      const derived = valid && rate > 0 ? formatAmount(numeric * rate) : ''
      return { fromAmount: rawAmount, toAmount: derived }
    }
    const derived = valid && rate > 0 ? formatAmount(numeric / rate) : ''
    return { fromAmount: derived, toAmount: rawAmount }
  }, [rawAmount, activeSide, rate])

  function handleAmountChange(field: ActiveSide) {
    return (value: string) => {
      if (!AMOUNT_PATTERN.test(value)) return
      if (status === 'success') setStatus('idle')
      setActiveSide(field)
      setRawAmount(value)
    }
  }

  function handleSelectToken(token: Token) {
    if (selector === 'from') {
      if (token.symbol === toToken?.symbol) {
        setToToken(fromToken)
      }
      setFromToken(token)
    } else if (selector === 'to') {
      if (token.symbol === fromToken?.symbol) {
        setFromToken(toToken)
      }
      setToToken(token)
    }
    setSelector(null)
    if (status === 'success') setStatus('idle')
  }

  function handleFlip() {
    setFromToken(toToken)
    setToToken(fromToken)
    setActiveSide(activeSide === 'from' ? 'to' : 'from')
    if (status === 'success') setStatus('idle')
  }

  function handleMax() {
    if (!fromToken) return
    const balance = balances[fromToken.symbol] ?? 0
    setActiveSide('from')
    setRawAmount(formatAmount(balance))
  }

  const fromBalance = fromToken ? balances[fromToken.symbol] ?? 0 : 0
  const fromNumeric = Number(fromAmount)

  const sameTokenError =
    fromToken && toToken && fromToken.symbol === toToken.symbol
      ? 'Choose two different tokens'
      : undefined

  const amountError =
    fromAmount && (!Number.isFinite(fromNumeric) || fromNumeric <= 0)
      ? 'Enter a valid amount'
      : fromAmount && fromNumeric > fromBalance
        ? 'Insufficient balance'
        : undefined

  const canSubmit =
    !!fromToken &&
    !!toToken &&
    !sameTokenError &&
    !amountError &&
    fromAmount !== '' &&
    fromNumeric > 0 &&
    status !== 'submitting'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('submitting')
    setTimeout(() => {
      setStatus('success')
    }, 1500)
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 space-y-1"
      >
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Swap
          </h1>
          {rate > 0 && fromToken && toToken && (
            <p className="text-xs text-slate-400">
              1 {fromToken.symbol} ≈ {formatAmount(rate)} {toToken.symbol}
            </p>
          )}
        </div>

        <AmountPanel
          label="You send"
          token={fromToken}
          amount={fromAmount}
          onAmountChange={handleAmountChange('from')}
          balance={fromBalance}
          onMax={handleMax}
          onSelectToken={() => setSelector('from')}
          error={amountError}
        />

        <div className="relative h-0 flex justify-center z-10">
          <button
            type="button"
            onClick={handleFlip}
            aria-label="Swap token direction"
            className="absolute -top-3 -bottom-3 flex items-center justify-center w-9 h-9 rounded-full bg-violet-500 text-white shadow-md hover:bg-violet-600 hover:rotate-180 transition-all duration-300 cursor-pointer"
          >
            ↓
          </button>
        </div>

        <div className="pt-2">
          <AmountPanel
            label="You receive"
            token={toToken}
            amount={toAmount}
            onAmountChange={handleAmountChange('to')}
            onSelectToken={() => setSelector('to')}
            balance={toToken ? balances[toToken.symbol] ?? 0 : undefined}
            error={sameTokenError}
          />
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-4 w-full rounded-2xl bg-violet-500 py-3.5 font-semibold text-white shadow-md transition-colors hover:bg-violet-600 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed dark:disabled:bg-slate-800 dark:disabled:text-slate-600 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'submitting' && (
            <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          )}
          {status === 'submitting'
            ? 'Swapping…'
            : status === 'success'
              ? 'Swapped ✓'
              : 'CONFIRM SWAP'}
        </button>

        {status === 'success' && fromToken && toToken && (
          <p className="text-center text-sm text-emerald-500 pt-2">
            Swapped {fromAmount} {fromToken.symbol} for {toAmount}{' '}
            {toToken.symbol}
          </p>
        )}
      </form>

      {selector && (
        <TokenSelectModal
          tokens={tokens}
          balances={balances}
          excludeSymbol={
            selector === 'from' ? toToken?.symbol : fromToken?.symbol
          }
          onSelect={handleSelectToken}
          onClose={() => setSelector(null)}
        />
      )}
    </>
  )
}
