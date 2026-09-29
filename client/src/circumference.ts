const SUN_RADIUS_KM = 695700n;

export function sunCircumferenceKm(pi: string): string {
  const [whole, fraction = ''] = pi.split('.');
  const digits = (2n * SUN_RADIUS_KM * BigInt(whole + fraction)).toString();

  const intPart = fraction ? digits.slice(0, -fraction.length) : digits;
  const decimalPart = fraction ? digits.slice(-fraction.length) : '';
  const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return decimalPart ? `${withCommas}.${decimalPart}` : withCommas;
}
