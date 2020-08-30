import * as Mailgen from 'mailgen';
import { DOMAIN, PROTOTYPE } from '../../../../configs/Configuration';
import { IUser } from '../../../../web.core/domain/types/IUser';

export class ForgotPasswordTemplate {
    static getTemplate(user: IUser): Mailgen.Content {
        return {
            body: {
                name: `${user.firstName} ${user.lastName}`,
                intro: 'You have received this email because a password reset request for your account was received.',
                action: {
                    instructions: 'Click the button below to reset your password:',
                    button: {
                        color: '#DC4D2F',
                        text: 'Reset your password',
                        link: `${PROTOTYPE}://${DOMAIN}/reset-password?email=${user.email}&key=${user.forgotKey}`
                    }
                },
                outro: 'If you did not request a password reset, no further action is required on your part.'
            }
        };
    }
}
