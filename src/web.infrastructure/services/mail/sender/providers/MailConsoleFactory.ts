import { IMailProvider } from '../interfaces/IMailProvider';

export class MailConsoleFactory implements IMailProvider {
    async send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        const data = {
            senderName,
            senderEmail,
            emails,
            subject,
            content
        };
        console.log('MailService.send', data);
        return data;
    }

    async sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        const data = {
            senderName,
            senderEmail,
            emails,
            subject,
            htmlContent
        };
        console.log('MailService.sendHtml', data);
        return data;
    }
}
