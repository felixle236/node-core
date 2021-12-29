import { INotificationService } from 'application/interfaces/services/INotificationService';
import { InjectService } from 'shared/types/Injection';
import { Service } from 'typedi';
import { NotificationSender } from './sender/NotificationSender';

@Service(InjectService.Notification)
export class NotificationService implements INotificationService {
    private readonly _sender: NotificationSender;

    constructor() {
        this._sender = new NotificationSender();
    }

    async sendNewUserRegistration(deviceTokens: string[], param: { name: string }): Promise<void> {
        await this._sender.send(deviceTokens, 'User Registration', `New user registration: "${param.name}"`);
    }
}
