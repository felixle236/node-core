import { IMailProvider } from '../interfaces/IMailProvider';

export class MailConsoleFactory implements IMailProvider {
    async send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        const data = {
            senderEmail,
            senderName,
            emails,
            subject,
            content
        };
        console.log('MailService.send', data);
        return data;
    }

    async sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        const data = {
            senderEmail,
            senderName,
            emails,
            subject,
            htmlContent
        };
        console.log('MailService.sendHtml', data);
        return data;
    }
}
