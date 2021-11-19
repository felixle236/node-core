import path from 'path';
import { I18n } from 'i18n';

const i18n = new I18n();
i18n.configure({
    locales: ['en', 'vi'],
    defaultLocale: 'en',
    queryParameter: 'lang',
    objectNotation: true,
    retryInDefaultLocale: true,
    directory: path.join(__dirname, 'locales')
});

export default i18n;
