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
