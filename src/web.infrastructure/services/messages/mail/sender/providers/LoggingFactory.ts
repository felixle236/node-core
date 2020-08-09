import { ENABLE_DATA_LOGGING } from '../../../../../../constants/Environments';
import { IMailSender } from '../interfaces/IMailSender';

export class LoggingFactory implements IMailSender {
    send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        const data = {
            senderEmail,
            senderName,
            emails,
            subject,
            content
        };
        if (ENABLE_DATA_LOGGING) console.log('MailSender.send', senderEmail, senderName, emails, subject);
        return Promise.resolve(data);
    }

    sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        const data = {
            senderEmail,
            senderName,
            emails,
            subject,
            htmlContent
        };
        if (ENABLE_DATA_LOGGING) console.log('MailSender.sendHtml', senderEmail, senderName, emails, subject);
        return Promise.resolve(data);
    }
}
