import { DOMAIN, PROTOTYPE } from 'config/Configuration';
import Mailgen from 'mailgen';
import { i18n } from 'shared/localization/Localization';

export class ForgotPasswordTemplate {
    static getTemplate(name: string, email: string, forgotKey: string, locale?: string): Mailgen.Content {
        return {
            body: {
                greeting: i18n.__({ phrase: 'mail.reset_password.greeting', locale }),
                name,
                intro: i18n.__({ phrase: 'mail.reset_password.intro', locale }),
                action: {
                    instructions: i18n.__({ phrase: 'mail.reset_password.instructions', locale }),
                    button: {
                        color: '#DC4D2F',
                        text: i18n.__({ phrase: 'mail.reset_password.button', locale }),
                        link: `${PROTOTYPE}://${DOMAIN}/reset-password?email=${email}&key=${forgotKey}`
                    }
                },
                outro: i18n.__({ phrase: 'mail.reset_password.outro', locale }),
                signature: i18n.__({ phrase: 'mail.reset_password.signature', locale })
            }
        };
    }
}
