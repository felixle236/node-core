import * as Mailgen from 'mailgen';
import { DOMAIN, PROJECT_NAME, PROTOTYPE } from '../../../../constants/Environments';
import { User } from '../../../../web.core/models/User';

export class UserActivationTemplate {
    static getTemplate(user: User): Mailgen.Content {
        return {
            body: {
                name: user.fullName,
                intro: `Welcome to ${PROJECT_NAME}! We're very excited to have you on board.`,
                action: {
                    instructions: `To get started with ${PROJECT_NAME}, please click here:`,
                    button: {
                        color: '#22BC66',
                        text: 'Confirm your account',
                        link: `${PROTOTYPE}://${DOMAIN}/confirm-account?key=${user.activeKey}`
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
            }
        };
    }
}
