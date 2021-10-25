import { PROJECT_NAME } from '@configs/Configuration';
import i18n from '@shared/localization';

export class UserActivationCodeTemplate {
    static getTemplate(code: string, locale?: string): string {
        return i18n.__({ phrase: 'sms.your_verification_code_from_{{projectName}}_is_{{code}}', locale }, { projectName: PROJECT_NAME, code });
    }
}
