import { INotificationProvider } from './interfaces/INotificationProvider';

export class NotificationConsoleFactory implements INotificationProvider {
    async send(deviceIds: string[], title: string, content: string): Promise<any> {
        const data = {
            deviceIds,
            title,
            content
        };
        console.log('NotificationService.send', data);
        return data;
    }
}
