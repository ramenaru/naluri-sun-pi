// machin formula: pi = 16 * arctan(1/5) - 4 * arctan(1/239)

function arctanInv(x: number, unity: bigint): bigint {
  const xBig = BigInt(x);
  const xSquared = xBig * xBig;
  let term = unity / xBig;
  let sum = term;
  let sign = -1n;

  for (let k = 3n; term !== 0n; k += 2n) {
    term /= xSquared;
    sum += (sign * term) / k;
    sign = -sign;
  }
  return sum;
}

export function piToDecimals(decimals: number): string {
  if (!Number.isInteger(decimals) || decimals < 0) {
    throw new RangeError(`decimals must be a whole number >= 0, got ${decimals}`);
  }

  const guard = 10n;
  const unity = 10n ** (BigInt(decimals) + guard);
  const pi = 4n * (4n * arctanInv(5, unity) - arctanInv(239, unity));
  const digits = (pi / 10n ** guard).toString();

  return decimals === 0 ? digits : `${digits[0]}.${digits.slice(1)}`;
}
