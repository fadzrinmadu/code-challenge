# Problem 3: Messy React

Original code: [original.tsx](original.tsx)
Refactored code: [refactored.tsx](refactored.tsx)

## Issues found

1. **Undefined variable `lhsPriority` (runtime bug).** Inside `filter`, the code computes `balancePriority` but then checks `lhsPriority`, which is never declared. This throws a `ReferenceError` at runtime (or only works because it accidentally reads a variable from an outer scope in a later version of the file).

2. **Inverted filter condition.** The filter keeps balances where `balance.amount <= 0`, i.e. it keeps zero/negative balances and drops positive ones. This is backwards from the evident intent (show wallets that actually have funds), so the UI ends up empty or showing dust/negative amounts.

3. **`getPriority` typed as `any` and redefined every render.** Typing the parameter `any` throws away TypeScript's safety, and defining the function inside the component body means a new function identity is created on every render, defeating memoization and adding needless work. It doesn't depend on props or state, so it can live outside the component (or in a constant lookup map) and be computed in O(1) instead of a switch/case chain.

4. **`getPriority` is called redundantly.** It's invoked once per element in `filter` and twice per comparison in `sort` (for `lhs` and `rhs`), recomputing the same value repeatedly for the same blockchain. With the priority in a lookup table this is a cheap object access, but it still shouldn't be called more than necessary per element.

5. **Non-exhaustive sort comparator.** The `sort` callback returns `-1` or `1` but has no `return` for the equal-priority case, implicitly returning `undefined`. Array.prototype.sort expects a number; `undefined` triggers a warning/unstable behavior in stricter environments (e.g. React Native/Hermes) or unpredictable ordering.

6. **`useMemo` depends on `prices` but never uses it.** `sortedBalances` only reads `balances`, so listing `prices` in the dependency array forces the filter+sort to rerun every time prices tick, even though the result wouldn't change. `prices` should be dropped from the dependency array.

7. **`formattedBalances` is computed but never used.** The component builds `formattedBalances` (adding `.formatted`) and then immediately maps over `sortedBalances` — the raw, un-formatted array — to build `rows`, calling `balance.formatted` on objects that don't have that property. This is dead code plus a type error (accessing `.formatted` on a `WalletBalance`, not a `FormattedWalletBalance`), and it duplicates the `.map()` traversal for no reason.

8. **Filter + sort + map run as three separate passes over the array.** Each is O(n) or O(n log n) individually, but they can be chained/combined into a single pipeline (`filter -> sort -> map`) run once, which is both clearer and avoids allocating an intermediate array that's thrown away (`formattedBalances`).

9. **`WalletBalance` is missing the `blockchain` field.** The interface only declares `currency` and `amount`, yet `balance.blockchain` is accessed throughout. TypeScript would only let this compile because `blockchain` fell through the `any` parameter of `getPriority`; the interface itself is incomplete and should declare `blockchain: Blockchain`.

10. **Using the array index as the React `key`.** `rows` uses `index` from `.map()` as the `key` prop instead of a stable identifier (e.g. `currency` or `blockchain-currency`). Since the list is filtered and sorted every render, index-based keys cause React to misattribute state/DOM nodes across re-renders instead of just reordering existing rows.

11. **Unused `children` destructured from props.** `children` is pulled out of `props` but never rendered, so any children passed to `WalletPage` are silently dropped — either it should be rendered, or it shouldn't be destructured out of `rest`.

## Refactor summary

The refactor in [refactored.tsx](refactored.tsx):

- Adds `blockchain: Blockchain` to `WalletBalance` and replaces `any` with a proper union type.
- Moves `getPriority` outside the component as a lookup-table read (O(1), no re-creation per render, no switch/case).
- Fixes the filter to keep positive-balance, known-priority wallets (`getPriority(...) > -99 && amount > 0`).
- Fixes the comparator to return a numeric delta (`rightPriority - leftPriority`) for every case, including ties.
- Merges filter/sort/`.formatted` mapping into a single `useMemo` pipeline (`formattedBalances`), dropping the unused, over-broad `prices` dependency and the redundant `sortedBalances` intermediate.
- Renders `rows` directly from `formattedBalances` and keys each `WalletRow` by a stable `blockchain-currency` string instead of the array index.
