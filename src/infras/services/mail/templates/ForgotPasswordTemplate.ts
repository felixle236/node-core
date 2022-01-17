import { PROJECT_DOMAIN, PROJECT_PROTOTYPE } from 'config/Configuration';
import Mailgen from 'mailgen';
import { i18n } from 'shared/localization/Localization';

export class ForgotPasswordTemplate {
  static getTemplate(param: { name: string; email: string; forgotKey: string; locale?: string }): Mailgen.Content {
    return {
      body: {
        greeting: i18n.__({ phrase: 'mail.reset_password.greeting', locale: param.locale }),
        name: param.name,
        intro: i18n.__({ phrase: 'mail.reset_password.intro', locale: param.locale }),
        action: {
          instructions: i18n.__({ phrase: 'mail.reset_password.instructions', locale: param.locale }),
          button: {
            color: '#DC4D2F',
            text: i18n.__({ phrase: 'mail.reset_password.button', locale: param.locale }),
            link: `${PROJECT_PROTOTYPE}://${PROJECT_DOMAIN}/reset-password?email=${param.email}&key=${param.forgotKey}`,
          },
        },
        outro: i18n.__({ phrase: 'mail.reset_password.outro', locale: param.locale }),
        signature: i18n.__({ phrase: 'mail.reset_password.signature', locale: param.locale }),
      },
    };
  }
}
