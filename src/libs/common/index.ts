/**
 * Map model item for object.
 */
export function mapModel<T1, T2>(Type: { new(p: T1): T2 }, item?: T1): T2 | undefined {
    return item ? new Type(item) : undefined;
}

/**
 * Map model list for array object.
 */
export function mapModels<T1, T2>(Type: { new(p: T1): T2 }, list: T1[]): T2[] {
    return Array.isArray(list) ? list.map(item => new Type(item)) : [];
}

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
export function convertStringToBoolean(val: string): boolean {
    if (!val)
        return false;
    val = val.toString();

    switch (val.toLowerCase().trim()) {
    case 'true': case 'yes': case '1': return true;
    case 'false': case 'no': case '0': return false;
    default: return false;
    }
}
