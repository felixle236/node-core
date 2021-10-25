import { MAIL_PROVIDER } from '@configs/Configuration';
import { MailProvider } from '@configs/Enums';
import { IMailProvider } from './interfaces/IMailProvider';
import { GoogleSmtpFactory } from './providers/GoogleSmtpFactory';
import { MailConsoleFactory } from './providers/MailConsoleFactory';
import { MailGunFactory } from './providers/MailGunFactory';
import { SendInBlueFactory } from './providers/SendInBlueFactory';

export class MailSender implements IMailProvider {
    private readonly _provider: IMailProvider;

    constructor() {
        switch (MAIL_PROVIDER) {
            case MailProvider.GoogleSmtp:
                this._provider = new GoogleSmtpFactory();
                break;

            case MailProvider.MailGun:
                this._provider = new MailGunFactory();
                break;

            case MailProvider.SendInBlue:
                this._provider = new SendInBlueFactory();
                break;

            case MailProvider.Console:
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
