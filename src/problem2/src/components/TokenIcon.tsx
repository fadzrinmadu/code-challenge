import { useState } from 'react'

interface TokenIconProps {
  symbol: string
  icon: string
  size?: number
}

export function TokenIcon({ symbol, icon, size = 28 }: TokenIconProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-linear-to-br from-violet-400 to-fuchsia-500 font-semibold text-white shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.38 }}
      >
        {symbol.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={icon}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full shrink-0 bg-white"
      onError={() => setFailed(true)}
    />
  )
}
