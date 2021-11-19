import { DOMAIN, PROJECT_NAME, PROTOTYPE } from 'config/Configuration';
import Mailgen from 'mailgen';
import i18n from 'shared/localization';

export class UserActivationTemplate {
    static getTemplate(name: string, email: string, activeKey: string, locale?: string): Mailgen.Content {
        return {
            body: {
                greeting: i18n.__({ phrase: 'mail.account_activation.greeting', locale }),
                name,
                intro: i18n.__({ phrase: 'mail.account_activation.intro', locale }, { projectName: PROJECT_NAME }),
                action: {
                    instructions: i18n.__({ phrase: 'mail.account_activation.instructions', locale }, { projectName: PROJECT_NAME }),
                    button: {
                        color: '#22BC66',
                        text: i18n.__({ phrase: 'mail.account_activation.button', locale }),
                        link: `${PROTOTYPE}://${DOMAIN}/confirm-account?email=${email}&key=${activeKey}`
                    }
                },
                outro: i18n.__({ phrase: 'mail.account_activation.outro', locale }),
                signature: i18n.__({ phrase: 'mail.account_activation.signature', locale })
            }
        };
    }
}
