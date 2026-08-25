# Problem 4: Three ways to sum to n (TypeScript)

Solution: [sum_to_n.ts](sum_to_n.ts)

Three unique implementations of `sum_to_n(n)`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`. Since `n` may be any integer (including negative), each implementation mirrors the pattern for negative input: `sum_to_n(-5) === -1 - 2 - 3 - 4 - 5 === -15`.

- `sum_to_n_a` — iterative loop, stepping `+1` toward `n` when `n >= 0` and `-1` toward `n` when `n < 0`. **O(n) time, O(1) space.**
- `sum_to_n_b` — closed-form arithmetic series formula, `sign(n) * (|n| * (|n| + 1) / 2)`. **O(1) time, O(1) space.** The fastest and most scalable option since it does no iteration at all.
- `sum_to_n_c` — recursion, adding `n` to `sum_to_n_c(n - step)` until it hits `0`. **O(n) time, O(n) space** (call stack depth grows with `n`; for very large `|n|` this can blow the call stack, unlike `_a` or `_b`).

Run it:

```bash
npx ts-node src/problem4/sum_to_n.ts
```
