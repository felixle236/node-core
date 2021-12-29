import { SMS_SENDER_OR_PHONE } from 'config/Configuration';
import twilio from 'twilio';
import { ISmsProvider } from '../interfaces/ISmsProvider';

export class TwilioFactory implements ISmsProvider {
    private readonly _provider;

    constructor(accountSid: string, authToken: string) {
        this._provider = twilio(accountSid, authToken);
    }

    async send(phoneNumber: string, content: string): Promise<any> {
        return await this._provider.messages.create({
            from: SMS_SENDER_OR_PHONE,
            to: phoneNumber,
            body: content
        });
    }
}
