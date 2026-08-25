# 99Tech Code Challenge #1 #

Note that if you fork this repository, your responses may be publicly linked to this repo.  
Please submit your application along with the solutions attached or linked.   

It is important that you minimally attempt the problems, even if you do not arrive at a working solution.

## Submission ##
You can either provide a link to an online repository, attach the solution in your application, or whichever method you prefer.
We're cool as long as we can view your solution without any pain.

## Problem 1: Three ways to sum to n ##

Solution: [src/problem1/sum_to_n.js](src/problem1/sum_to_n.js)

Three unique implementations of `sum_to_n(n)`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`:

- `sum_to_n_a` — iterative `for` loop. O(n) time, O(1) space.
- `sum_to_n_b` — Gauss' formula `n * (n + 1) / 2`. O(1) time, O(1) space.
- `sum_to_n_c` — recursion. O(n) time, O(n) space (call stack).

Run it:

```bash
node src/problem1/sum_to_n.js
```

## Problem 2: Currency Swap Form ##

Solution: [src/problem2](src/problem2) — see its [README](src/problem2/README.md) for details.

A React + TypeScript + Vite + Tailwind CSS swap form with live token prices/icons, a searchable token picker, real-time conversion, input validation (invalid amount, insufficient balance, duplicate tokens), a flip button, and a simulated (loading → success) submit flow.

Run it:

```bash
cd src/problem2
npm install
npm run dev
```

## Problem 3: Messy React ##

Solution: [src/problem3](src/problem3) — see its [README](src/problem3/README.md) for details.

A code review of a messy `WalletPage` React + TypeScript component: 11 computational inefficiencies and anti-patterns identified (an undefined-variable bug, an inverted filter condition, a redefined-every-render `getPriority` typed as `any`, redundant priority lookups, a non-exhaustive sort comparator, an unnecessary `useMemo` dependency, dead code computed but never used, three separate array passes that should be one pipeline, a missing interface field, array-index React keys, and dropped `children`), each with an explanation, plus a [refactored version](src/problem3/refactored.tsx) that fixes them.

## Problem 4: Three ways to sum to n (TypeScript) ##

Solution: [src/problem4/sum_to_n.ts](src/problem4/sum_to_n.ts) — see its [README](src/problem4/README.md) for details.

Three unique TypeScript implementations of `sum_to_n(n)`, handling negative `n` as well (`sum_to_n(-5) === -15`):

- `sum_to_n_a` — iterative loop. O(n) time, O(1) space.
- `sum_to_n_b` — closed-form arithmetic series formula. O(1) time, O(1) space.
- `sum_to_n_c` — recursion. O(n) time, O(n) space (call stack).

Run it:

```bash
npx ts-node src/problem4/sum_to_n.ts
```
