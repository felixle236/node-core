import * as PushNotification from 'node-pushnotifications';
import { ANDROID_KEY, DEVELOPMENT_MODE, IOS_KEY, PROJECT_NAME } from '../../../constants/Environments';
import { INotificationService } from '../../../web.core/interfaces/gateways/messages/INotificationService';
import { Service } from 'typedi';

@Service('notification.service')
export class NotificationService implements INotificationService {
    private sender: PushNotification;

    constructor() {
        this.sender = new PushNotification({
            gcm: {
                id: ANDROID_KEY
            },
            apn: {
                token: {
                    key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
                    keyId: IOS_KEY,
                    teamId: 'EFGH'
                },
                production: !DEVELOPMENT_MODE // true for APN production environment, false for APN sandbox environment,
            }
        });
    }

    private send(deviceIds: string[], title: string, body: string): Promise<any> {
        return this.sender.send(deviceIds, {
            title, // REQUIRED for Android
            topic: title, // REQUIRED for iOS (apn and gcm)
            body: body,
            custom: {
                sender: PROJECT_NAME
            },
            sound: 'ping.aiff'
        });
    }

    async sendNewUserRegistration(deviceIds: string[]): Promise<void> {
        await this.send(deviceIds, 'User Registration', 'New user registration on your site');
    }
}
