import { IMailProvider } from './interfaces/IMailProvider';
import { GoogleSmtpFactory } from './providers/GoogleSmtpFactory';
import { MailConsoleFactory } from './providers/MailConsoleFactory';
import { MailGunFactory } from './providers/MailGunFactory';
import { SendInBlueFactory } from './providers/SendInBlueFactory';
import { GOOGLE_SMTP_PASSWORD, GOOGLE_SMTP_USERNAME, MAIL_PROVIDER, SENDINBLUE_API_KEY } from '../../../../configs/Configuration';
import { MailProvider } from '../../../../configs/ServiceProvider';

export class MailSender implements IMailProvider {
    private readonly _provider: IMailProvider;

    constructor() {
        switch (MAIL_PROVIDER) {
        case MailProvider.GOOGLE_SMTP:
            this._provider = new GoogleSmtpFactory(GOOGLE_SMTP_USERNAME, GOOGLE_SMTP_PASSWORD);
            break;

        case MailProvider.MAIL_GUN:
            this._provider = new MailGunFactory();
            break;

        case MailProvider.SEND_IN_BLUE:
            this._provider = new SendInBlueFactory(SENDINBLUE_API_KEY);
            break;

        case MailProvider.CONSOLE:
        default:
            this._provider = new MailConsoleFactory();
            break;
        }
    }

    send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return this._provider.send(senderName, senderEmail, emails, subject, content);
    }

    sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return this._provider.sendHtml(senderName, senderEmail, emails, subject, htmlContent);
    }
}
