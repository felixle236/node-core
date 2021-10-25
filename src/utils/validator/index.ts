import { isArray, isDate } from 'class-validator';

/**
 * Check whether the value is a literal object or not
 */
export function isLiteralObject(val: object): boolean {
    return !!val && typeof val === 'object' && !isArray(val) && !isDate(val);
}
