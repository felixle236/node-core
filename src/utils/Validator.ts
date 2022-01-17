import { isArray, isDate, validateSync } from 'class-validator';
import { InputValidationError } from 'shared/exceptions/InputValidationError';

/**
 * Check whether the value is a literal object or not
 */
export function isLiteralObject(val: object): boolean {
  return !!val && typeof val === 'object' && !isArray(val) && !isDate(val);
}

/**
 * Validate data input
 */
export function validateDataInput(data: object): boolean {
  const errors = validateSync(data, { whitelist: true, validationError: { target: false, value: false } });
  if (errors && errors.length) {
    throw new InputValidationError(errors);
  }
  return true;
}
