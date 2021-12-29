import { ILogService } from 'application/interfaces/services/ILogService';
import { InjectService } from 'shared/types/Injection';
import Container from 'typedi';
import { INotificationProvider } from '../interfaces/INotificationProvider';

export class NotificationConsoleFactory implements INotificationProvider {
    private readonly _logService = Container.get<ILogService>(InjectService.Log);

    async send(deviceTokens: string[], title: string, content: string): Promise<any> {
        const data = {
            deviceTokens,
            title,
            content
        };
        this._logService.info('NotificationService.send', data);
        return data;
    }
}
