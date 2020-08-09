import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from '../../../../constants/Environments';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { IMailGenerator } from './sender/interfaces/IMailGenerator';
import { IMailSender } from './sender/interfaces/IMailSender';
import { IMailService } from '../../../../web.core/usecase/boundaries/services/IMailService';
import { MailGenerator } from './MailGenerator';
import { MailSender } from './sender';
import { Service } from 'typedi';
import { User } from '../../../../web.core/domain/entities/User';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

@Service('mail.service')
export class MailService implements IMailService {
    private readonly _sender: IMailSender;
    private readonly _generator: IMailGenerator;

    constructor() {
        this._sender = new MailSender();
        this._generator = new MailGenerator();
    }

    async sendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_EMAIL, MAIL_SENDER_NAME, user.email, 'Account Activation', content);
    }

    async resendUserActivation(user: User): Promise<void> {
        const template = UserActivationTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_EMAIL, MAIL_SENDER_NAME, user.email, 'Re-Sending Account Activation', content);
    }

    async sendForgotPassword(user: User): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(user);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_EMAIL, MAIL_SENDER_NAME, user.email, 'Forgot Your Password', content);
    }
}
