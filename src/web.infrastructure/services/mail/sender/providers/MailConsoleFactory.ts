import Container from 'typedi';
import { ILogService } from '../../../../../web.core/gateways/services/ILogService';
import { IMailProvider } from '../interfaces/IMailProvider';

export class MailConsoleFactory implements IMailProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    async send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        const data = {
            senderName,
            senderEmail,
            emails,
            subject,
            content
        };
        this._logService.debug('MailService.send', data);
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
        this._logService.debug('MailService.sendHtml', data);
        return data;
    }
}
