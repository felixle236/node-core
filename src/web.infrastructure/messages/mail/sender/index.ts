import * as Mailgen from 'mailgen';
import { DOMAIN, ENABLE_DATA_LOGGING, GOOGLE_SMTP_PASSWORD, GOOGLE_SMTP_USERNAME, MAIL_TYPE, PROJECT_NAME, PROTOTYPE, SENDINBLUE_API_KEY } from '../../../../constants/Environments';
import { GoogleSmtpFactory } from './providers/GoogleSmtpFactory';
import { IMailSender } from './interfaces/IMailSender';
import { LoggingFactory } from './providers/LoggingFactory';
import { MailType } from '../../../../constants/Enums';
import { SendInBlueFactory } from './providers/SendInBlueFactory';

export class MailSender {
    private mail: IMailSender;
    mailGenerator: Mailgen;

    constructor() {
        this.mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: PROJECT_NAME,
                link: `${PROTOTYPE}://${DOMAIN}`
                // Optional product logo
                // logo: 'https://mailgen.js/img/logo.png'
            }
        });

        switch (MAIL_TYPE) {
        case MailType.GOOGLE_SMTP:
            this.mail = new GoogleSmtpFactory(GOOGLE_SMTP_USERNAME, GOOGLE_SMTP_PASSWORD);
            break;

        case MailType.SEND_IN_BLUE:
            this.mail = new SendInBlueFactory(SENDINBLUE_API_KEY);
            break;

        case MailType.LOGGING:
        default:
            this.mail = new LoggingFactory(ENABLE_DATA_LOGGING);
            break;
        }
    }

    send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return this.mail.send(senderName, senderEmail, emails, subject, content);
    }

    sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return this.mail.sendHtml(senderName, senderEmail, emails, subject, htmlContent);
    }
}
