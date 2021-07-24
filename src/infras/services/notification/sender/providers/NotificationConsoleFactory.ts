import { ILogService } from '@gateways/services/ILogService';
import Container from 'typedi';
import { INotificationProvider } from '../interfaces/INotificationProvider';

export class NotificationConsoleFactory implements INotificationProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    async send(deviceIds: string[], title: string, content: string): Promise<any> {
        const data = {
            deviceIds,
            title,
            content
        };
        this._logService.info('NotificationService.send', data);
        return data;
    }
}
