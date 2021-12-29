export interface INotificationService {
    sendNewUserRegistration(deviceTokens: string[], param: { name: string }): Promise<void>;
}
