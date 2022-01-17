export interface INotificationProvider {
  send(deviceTokens: string[], title: string, content: string): Promise<any>;
}
