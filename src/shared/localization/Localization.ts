import path from 'path';
import { I18n } from 'i18n';

export const i18n = new I18n();

/**
 * Configure locales that we want to use for the project.
 * @param locales The list of locales.
 */
export function configureI18n(locales = ['en', 'vi'], defaultLocale = 'en', queryParameter = 'lang'): void {
  i18n.configure({
    locales,
    defaultLocale,
    queryParameter,
    objectNotation: true,
    retryInDefaultLocale: true,
    directory: path.join(__dirname, 'locales'),
  });
}

// Configure default
configureI18n();
