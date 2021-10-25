import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from '@configs/Configuration';
import { IMailService } from '@gateways/services/IMailService';
import i18n from '@shared/localization';
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

    async sendUserActivation(name: string, email: string, activeKey: string, locale?: string): Promise<void> {
        const template = UserActivationTemplate.getTemplate(name, email, activeKey, locale);
        const content = this._generator.generateHtmlContent(template);
        const subject = i18n.__({ phrase: 'mail.account_activation.subject', locale });
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, subject, content);
    }

    async resendUserActivation(name: string, email: string, activeKey: string, locale?: string): Promise<void> {
        const template = UserActivationTemplate.getTemplate(name, email, activeKey, locale);
        const content = this._generator.generateHtmlContent(template);
        const subject = i18n.__({ phrase: 'mail.resend_account_activation.subject', locale });
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, subject, content);
    }

    async sendForgotPassword(name: string, email: string, forgotKey: string, locale?: string): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(name, email, forgotKey, locale);
        const content = this._generator.generateHtmlContent(template);
        const subject = i18n.__({ phrase: 'mail.reset_password.subject', locale });
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, email, subject, content);
    }
}
