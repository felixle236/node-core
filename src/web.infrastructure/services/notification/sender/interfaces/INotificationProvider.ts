export interface INotificationProvider {
    send(deviceIds: string[], title: string, content: string): Promise<any>;
}
