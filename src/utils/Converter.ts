/**
 * Convert number to currency.
 */
export function convertToCurrency(value: number | undefined, option?: { format: string; currency: string }): string {
  if (!value) {
    value = 0;
  }

  if (!option) {
    option = { format: '', currency: '' };
  }
  if (!option.format) {
    option.format = 'en-US';
  }
  if (!option.currency) {
    option.currency = 'USD';
  }

  return value.toLocaleString(option.format, { style: 'currency', currency: option.currency });
}

/**
 * Convert string to boolean.
 */
export function convertStringToBoolean(val: string | undefined, defaultValue = false): boolean {
  if (!val) {
    return defaultValue;
  }

  switch (val.toLowerCase().trim()) {
    case 'true':
    case 'yes':
    case '1':
      return true;
    case 'false':
    case 'no':
    case '0':
      return false;
    default:
      return defaultValue;
  }
}

/**
 * Convert object to string.
 */
export function convertObjectToString(val: { [key: string]: any } | undefined, isPrettified = false): string {
  if (!val) {
    return '';
  }

  if (isPrettified) {
    return JSON.stringify(val, undefined, 2);
  }
  return JSON.stringify(val, undefined, '');
}
