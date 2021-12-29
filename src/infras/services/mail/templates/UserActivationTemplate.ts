import { PROJECT_DOMAIN, PROJECT_NAME, PROJECT_PROTOTYPE } from 'config/Configuration';
import Mailgen from 'mailgen';
import { i18n } from 'shared/localization/Localization';

export class UserActivationTemplate {
    static getTemplate(param: { name: string, email: string, activeKey: string, locale?: string }): Mailgen.Content {
        return {
            body: {
                greeting: i18n.__({ phrase: 'mail.account_activation.greeting', locale: param.locale }),
                name: param.name,
                intro: i18n.__({ phrase: 'mail.account_activation.intro', locale: param.locale }, { projectName: PROJECT_NAME }),
                action: {
                    instructions: i18n.__({ phrase: 'mail.account_activation.instructions', locale: param.locale }, { projectName: PROJECT_NAME }),
                    button: {
                        color: '#22BC66',
                        text: i18n.__({ phrase: 'mail.account_activation.button', locale: param.locale }),
                        link: `${PROJECT_PROTOTYPE}://${PROJECT_DOMAIN}/confirm-account?email=${param.email}&key=${param.activeKey}`
                    }
                },
                outro: i18n.__({ phrase: 'mail.account_activation.outro', locale: param.locale }),
                signature: i18n.__({ phrase: 'mail.account_activation.signature', locale: param.locale })
            }
        };
    }
}
