import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from '@configs/Configuration';
import { IMailService } from '@gateways/services/IMailService';
import { Service } from 'typedi';
import { MailGenerator } from './MailGenerator';
import { MailSender } from './sender/MailSender';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

@Service('mail.service')
export class MailService implements IMailService {
    private readonly _sender: MailSender;
    private readonly _generator: MailGenerator;

    constructor() {
        this._sender = new MailSender();
        this._generator = new MailGenerator();
    }

    async sendUserActivation(name: string, email: string, activeKey: string): Promise<void> {
        const template = UserActivationTemplate.getTemplate(name, email, activeKey);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Account Activation', content);
    }

    async resendUserActivation(name: string, email: string, activeKey: string): Promise<void> {
        const template = UserActivationTemplate.getTemplate(name, email, activeKey);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Re-Sending Account Activation', content);
    }

    async sendForgotPassword(name: string, email: string, forgotKey: string): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(name, email, forgotKey);
        const content = this._generator.generateHtmlContent(template);
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, 'Forgot Your Password', content);
    }
}
