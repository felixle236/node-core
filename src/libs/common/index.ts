/**
 * Replace params into the template.
 */
export function mapTemplate(template: string, ...params): string {
    return template.replace(/{(\d+)}/g, (match, number) => {
        return params[number] || match;
    });
}

/**
 * Replace data object into the template.
 */
export function mapTemplateWithDataObject(template: string, data: Object): string {
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
export function convertToCurrency(value: number, option): string {
    if (typeof value !== 'number')
        return '';

    if (!option)
        option = {};
    if (!option.format)
        option.format = 'en-US';
    if (!option.currency)
        option.currency = 'USD';

    return value.toLocaleString(option.format, { style: 'currency', currency: option.currency });
}

/**
 * Convert string to boolean.
 */
export function convertStringToBoolean(val: string | undefined | null, defaultValue: boolean = false): boolean {
    if (!val)
        return defaultValue;

    switch (val.toLowerCase().trim()) {
    case 'true': case 'yes': case '1': return true;
    case 'false': case 'no': case '0': return false;
    default: return defaultValue;
    }
}

/**
 * Convert json to string.
 */
export function convertJsonToString(val: object): string {
    if (!val)
        return '';
    if (typeof val === 'string')
        return val;
    if (typeof val !== 'object')
        return '';

    return JSON.stringify(val, undefined, 2).replace(/\n/g, '').replace(/\s\s+/g, ' ');
}
