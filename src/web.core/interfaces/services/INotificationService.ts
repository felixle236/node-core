export interface INotificationService {
    sendNewUserRegistration(deviceIds: string[]): Promise<void>;
}
