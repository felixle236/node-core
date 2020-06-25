import { GOOGLE_SMTP_PASSWORD, GOOGLE_SMTP_USERNAME, MAIL_TYPE, SENDINBLUE_API_KEY } from '../../../../constants/Environments';
import { GoogleSmtpFactory } from './providers/GoogleSmtpFactory';
import { IMailSender } from './interfaces/IMailSender';
import { LoggingFactory } from './providers/LoggingFactory';
import { MailType } from '../../../../constants/Enums';
import { SendInBlueFactory } from './providers/SendInBlueFactory';

export class MailSender implements IMailSender {
    private readonly _mail: IMailSender;

    constructor() {
        switch (MAIL_TYPE) {
        case MailType.GOOGLE_SMTP:
            this._mail = new GoogleSmtpFactory(GOOGLE_SMTP_USERNAME, GOOGLE_SMTP_PASSWORD);
            break;

        case MailType.SEND_IN_BLUE:
            this._mail = new SendInBlueFactory(SENDINBLUE_API_KEY);
            break;

        case MailType.LOGGING:
        default:
            this._mail = new LoggingFactory();
            break;
        }
    }

    send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return this._mail.send(senderName, senderEmail, emails, subject, content);
    }

    sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return this._mail.sendHtml(senderName, senderEmail, emails, subject, htmlContent);
    }
}
