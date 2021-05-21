import Container from 'typedi';
import { ILogService } from '../../../../../web.core/gateways/services/ILogService';
import { INotificationProvider } from '../interfaces/INotificationProvider';

export class NotificationConsoleFactory implements INotificationProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    async send(deviceIds: string[], title: string, content: string): Promise<any> {
        const data = {
            deviceIds,
            title,
            content
        };
        this._logService.debug('NotificationService.send', data);
        return data;
    }
}
