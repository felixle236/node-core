import { NOTIFICATION_PROVIDER } from 'config/Configuration';
import { NotificationProvider } from 'shared/types/Environment';
import { INotificationProvider } from './interfaces/INotificationProvider';
import { NodePushNotificationFactory } from './providers/NodePushNotificationFactory';
import { NotificationConsoleFactory } from './providers/NotificationConsoleFactory';

export class NotificationSender implements INotificationProvider {
    private readonly _provider: INotificationProvider;

    constructor() {
        switch (NOTIFICATION_PROVIDER) {
            case NotificationProvider.NodePushNotification:
                this._provider = new NodePushNotificationFactory();
                break;

            case NotificationProvider.Console:
            default:
                this._provider = new NotificationConsoleFactory();
                break;
        }
    }

    async send(deviceTokens: string[], title: string, content: string): Promise<any> {
        return await this._provider.send(deviceTokens, title, content);
    }
}
