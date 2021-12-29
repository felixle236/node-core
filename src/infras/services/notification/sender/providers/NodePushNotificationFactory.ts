import { APN_KEY, ENVIRONMENT, FCM_KEY, PROJECT_NAME } from 'config/Configuration';
import NodePushNotification from 'node-pushnotifications';
import { Environment } from 'shared/types/Environment';
import { INotificationProvider } from '../interfaces/INotificationProvider';

export class NodePushNotificationFactory implements INotificationProvider {
    private readonly _sender: NodePushNotification;

    constructor() {
        this._sender = new NodePushNotification({
            gcm: {
                id: FCM_KEY
            },
            apn: {
                token: {
                    key: './certs/key.p8', // optionally: fs.readFileSync('./certs/key.p8')
                    keyId: APN_KEY,
                    teamId: 'EFGH'
                },
                production: ENVIRONMENT !== Environment.Local // true for APN production environment, false for APN sandbox environment,
            }
        });
    }

    async send(deviceTokens: string[], title: string, content: string): Promise<any> {
        return await this._sender.send(deviceTokens, {
            title, // REQUIRED for Android
            topic: title, // REQUIRED for iOS (apn and gcm)
            body: content,
            custom: {
                sender: PROJECT_NAME
            },
            sound: 'ping.aiff'
        });
    }
}
