import { ILogService } from 'application/interfaces/services/ILogService';
import { InjectService } from 'shared/types/Injection';
import Container from 'typedi';
import { IMailProvider } from '../interfaces/IMailProvider';

export class MailConsoleFactory implements IMailProvider {
    private readonly _logService = Container.get<ILogService>(InjectService.Log);

    async send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        const data = {
            senderName,
            senderEmail,
            emails,
            subject,
            content
        };
        this._logService.info('MailService.send', data);
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
        this._logService.info('MailService.sendHtml', data);
        return data;
    }
}
