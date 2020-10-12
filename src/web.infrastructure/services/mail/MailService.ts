import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from '../../../configs/Configuration';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { IMailService } from '../../../web.core/gateways/services/IMailService';
import { IUser } from '../../../web.core/domain/types/user/IUser';
import { MailGenerator } from './MailGenerator';
import { MailSender } from './sender/MailSender';
import { Service } from 'typedi';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

@Service('mail.service')
export class MailService implements IMailService {
    private readonly _sender: MailSender;
    private readonly _generator: MailGenerator;

    constructor() {
        this._sender = new MailSender();
        this._generator = new MailGenerator();
    }

    async sendUserActivation(user: IUser): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, user.email, 'Account Activation', content);
    }

    async resendUserActivation(user: IUser): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, user.email, 'Re-Sending Account Activation', content);
    }

    async sendForgotPassword(user: IUser): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, user.email, 'Forgot Your Password', content);
    }
}
