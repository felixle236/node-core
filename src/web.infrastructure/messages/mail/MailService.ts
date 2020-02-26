import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from '../../../constants/Environments';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { IMailService } from '../../../web.core/interfaces/gateways/messages/IMailService';
import { MailSender } from './sender';
import { Service } from 'typedi';
import { User } from '../../../web.core/models/User';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

@Service('mail.service')
export class MailService implements IMailService {
    private sender = new MailSender();

    async sendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this.sender.mailGenerator.generate(template);
        await this.sender.sendHtml(MAIL_SENDER_EMAIL, MAIL_SENDER_NAME, user.email, 'Account Activation', content);
    }

    async resendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this.sender.mailGenerator.generate(template);
        await this.sender.sendHtml(MAIL_SENDER_EMAIL, MAIL_SENDER_NAME, user.email, 'Re-Sending Account Activation', content);
    }

    async sendForgotPassword(user: User): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(user);
        const content = this.sender.mailGenerator.generate(template);
        await this.sender.sendHtml(MAIL_SENDER_EMAIL, MAIL_SENDER_NAME, user.email, 'Forgot Your Password', content);
    }
}
