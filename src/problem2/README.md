# Problem 2: Currency Swap Form

A swap form built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- Token list and prices sourced from `https://interview.switcheo.com/prices.json` (snapshotted at `src/data/prices.json`, deduped to the latest price per currency). Tokens without a price are omitted.
- Token icons pulled from the [Switcheo/token-icons](https://github.com/Switcheo/token-icons) repository, stored locally under `public/tokens`, with an initials-avatar fallback if an icon fails to load.
- Live conversion: typing an amount on either side recalculates the other using the live exchange rate (`price(from) / price(to)`).
- A searchable token-select modal for both the "send" and "receive" sides.
- A flip button to instantly swap the two sides.
- Input validation: invalid/non-numeric amounts, insufficient (mocked) balance, and picking the same token on both sides are all caught with inline error messages, and the submit button is disabled until the form is valid.
- A "Balance" pill that also acts as a "max amount" shortcut.
- Simulated submission: the confirm button shows a loading spinner for ~1.5s before reporting success, mimicking a backend swap call.
- Responsive layout with light/dark theme support.

## Getting started

```bash
npm install
npm run dev
```

```bash
npm run build   # type-check + production build
npm run lint     # oxlint
```

## Structure

```
src/
  components/
    AmountPanel.tsx        input + token button for one side of the swap
    SwapForm.tsx            form state, validation, and submit flow
    TokenIcon.tsx            token image with fallback avatar
    TokenSelectModal.tsx    searchable token picker
  data/prices.json          snapshotted token prices
  format.ts                  number/currency formatting helpers
  useBalances.ts             deterministic mock wallet balances
  useTokens.ts                merges prices with local icon paths
public/tokens/*.svg          token icons
```
