/* eslint-disable @typescript-eslint/ban-types */
import { InputValidationError } from '@shared/exceptions/InputValidationError';
import { validate } from 'class-validator';

/**
 * Validate data input
 */
export async function validateDataInput(data: object): Promise<void> {
    const errors = await validate(data, { whitelist: true, validationError: { target: false } });
    if (errors && errors.length)
        throw new InputValidationError(errors);
}

/**
 * Replace params into the template.
 */
export function mapTemplate(template: string, ...params: any[]): string {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return params[number] || match;
    });
}

/**
 * Replace data object into the template.
 */
export function mapTemplateWithDataObject(template: string, data: { [key: string]: any }): string {
    if (data) {
        Object.keys(data).forEach(key => {
            template = template.replace(new RegExp(`{{${key}}}`, 'g'), data[key]);
        });
    }
    return template;
}

/**
 * Convert number to currency.
 */
export function convertToCurrency(value: number, option: {format: string, currency: string}): string {
    if (typeof value !== 'number')
        return '';

    if (!option)
        option = { format: '', currency: '' };
    if (!option.format)
        option.format = 'en-US';
    if (!option.currency)
        option.currency = 'USD';

    return value.toLocaleString(option.format, { style: 'currency', currency: option.currency });
}

/**
 * Convert string to boolean.
 */
export function convertStringToBoolean(val: string | undefined | null, defaultValue = false): boolean {
    if (!val)
        return defaultValue;

    switch (val.toLowerCase().trim()) {
    case 'true': case 'yes': case '1': return true;
    case 'false': case 'no': case '0': return false;
    default: return defaultValue;
    }
}

/**
 * Convert object to string.
 */
export function convertObjectToString(val: {[key: string]: any}, isPrettified = false): string {
    if (val == null)
        return '';
    if (typeof val === 'string')
        return val;

    if (isPrettified)
        return JSON.stringify(val, undefined, 2);
    return JSON.stringify(val, undefined, '');
}
