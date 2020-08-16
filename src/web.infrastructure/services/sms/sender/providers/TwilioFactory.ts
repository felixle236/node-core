import * as twilio from 'twilio';
import { ISmsProvider } from '../interfaces/ISmsProvider';

export class TwilioFactory implements ISmsProvider {
    private readonly _provider;

    constructor(accountSid: string, authToken: string) {
        this._provider = twilio(accountSid, authToken);
    }

    async send(senderOrPhone: string, phoneNumber: string, content: string): Promise<any> {
        return await this._provider.messages.create({
            from: senderOrPhone,
            to: phoneNumber,
            body: content
        });
    }
}
