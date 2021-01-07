import { INotificationProvider } from './interfaces/INotificationProvider';
import { NodePushNotificationFactory } from './providers/NodePushNotificationFactory';
import { NotificationConsoleFactory } from './providers/NotificationConsoleFactory';
import { NOTIFICATION_PROVIDER } from '../../../../configs/Configuration';
import { NotificationProvider } from '../../../../configs/ServiceProvider';

export class NotificationSender implements INotificationProvider {
    private readonly _provider: INotificationProvider;

    constructor() {
        switch (NOTIFICATION_PROVIDER) {
        case NotificationProvider.NODE_PUSH_NOTIFICATION:
            this._provider = new NodePushNotificationFactory();
            break;

        case NotificationProvider.CONSOLE:
        default:
            this._provider = new NotificationConsoleFactory();
            break;
        }
    }

    async send(deviceIds: string[], title: string, content: string): Promise<any> {
        return await this._provider.send(deviceIds, title, content);
    }
}
