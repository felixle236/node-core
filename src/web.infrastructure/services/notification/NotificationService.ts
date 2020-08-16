import { INotificationService } from '../../../web.core/gateways/services/INotificationService';
import { NotificationSender } from './sender/NotificationSender';
import { Service } from 'typedi';

@Service('notification.service')
export class NotificationService implements INotificationService {
    private readonly _sender: NotificationSender;

    constructor() {
        this._sender = new NotificationSender();
    }

    async sendNewUserRegistration(deviceIds: string[]): Promise<void> {
        await this._sender.send(deviceIds, 'User Registration', 'New user registration on your site');
    }
}
