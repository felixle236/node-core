import * as Mailgen from 'mailgen';
import { DOMAIN, PROTOTYPE } from '../../../../constants/Environments';
import { User } from '../../../../web.core/models/User';

export class ForgotPasswordTemplate {
    static getTemplate(user: User): Mailgen.Content {
        return {
            body: {
                name: user.fullName,
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Reset your password',
                        link: `${PROTOTYPE}://${DOMAIN}/reset-password?email=${user.email}`
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };
    }
}
