export function sum_to_n_a(n: number): number {
  const step = n < 0 ? -1 : 1;
  let sum = 0;
  for (let i = step; i * step <= n * step; i += step) {
    sum += i;
  }
  return sum;
}

export function sum_to_n_b(n: number): number {
  const sign = n < 0 ? -1 : 1;
  const abs = Math.abs(n);
  return sign * ((abs * (abs + 1)) / 2);
}

export function sum_to_n_c(n: number): number {
  if (n === 0) return 0;
  const step = n < 0 ? -1 : 1;
  return n + sum_to_n_c(n - step);
}

if (require.main === module) {
  console.log(sum_to_n_a(5));
  console.log(sum_to_n_b(5));
  console.log(sum_to_n_c(5));
}
