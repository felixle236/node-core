import { IMailService } from 'application/interfaces/services/IMailService';
import { MAIL_SENDER_EMAIL, MAIL_SENDER_NAME } from 'config/Configuration';
import { i18n } from 'shared/localization/Localization';
import { InjectService } from 'shared/types/Injection';
import { Service } from 'typedi';
import { MailGenerator } from './MailGenerator';
import { MailSender } from './sender/MailSender';
import { ForgotPasswordTemplate } from './templates/ForgotPasswordTemplate';
import { UserActivationTemplate } from './templates/UserActivationTemplate';

@Service(InjectService.Mail)
export class MailService implements IMailService {
    private readonly _sender: MailSender;
    private readonly _generator: MailGenerator;

    constructor() {
        this._sender = new MailSender();
        this._generator = new MailGenerator();
    }

    async sendUserActivation(param: { name: string, email: string, activeKey: string, locale?: string }): Promise<void> {
        const template = UserActivationTemplate.getTemplate(param);
        const content = this._generator.generateHtmlContent(template);
        const subject = i18n.__({ phrase: 'mail.account_activation.subject', locale: param.locale });
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, param.email, subject, content);
    }

    async resendUserActivation(param: { name: string, email: string, activeKey: string, locale?: string }): Promise<void> {
        const template = UserActivationTemplate.getTemplate(param);
        const content = this._generator.generateHtmlContent(template);
        const subject = i18n.__({ phrase: 'mail.resend_account_activation.subject', locale: param.locale });
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, param.email, subject, content);
    }

    async sendForgotPassword(param: { name: string, email: string, forgotKey: string, locale?: string }): Promise<void> {
        const template = ForgotPasswordTemplate.getTemplate(param);
        const content = this._generator.generateHtmlContent(template);
        const subject = i18n.__({ phrase: 'mail.reset_password.subject', locale: param.locale });
        await this._sender.sendHtml(MAIL_SENDER_NAME, MAIL_SENDER_EMAIL, param.email, subject, content);
    }
}
