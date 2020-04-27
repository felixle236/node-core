import { IMailSender } from '../interfaces/IMailSender';

export class LoggingFactory implements IMailSender {
    constructor(private dataLogging: boolean) { }

    send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        const data = {
            senderEmail,
            senderName,
            emails,
            subject,
            content
        };
        if (this.dataLogging) console.log('MailSender.send', senderEmail, senderName, emails, subject);
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
        if (this.dataLogging) console.log('MailSender.sendHtml', senderEmail, senderName, emails, subject);
        return Promise.resolve(data);
    }
}
