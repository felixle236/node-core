import { SENDINBLUE_API_KEY, SMS_PROVIDER, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from 'config/Configuration';
import { SmsProvider } from 'shared/types/Environment';
import { ISmsProvider } from './interfaces/ISmsProvider';
import { SendInBlueFactory } from './providers/SendInBlueFactory';
import { SmsConsoleFactory } from './providers/SmsConsoleFactory';
import { TwilioFactory } from './providers/TwilioFactory';

export class SmsSender implements ISmsProvider {
    private readonly _provider: ISmsProvider;

    constructor() {
        switch (SMS_PROVIDER) {
            case SmsProvider.Twilio:
                this._provider = new TwilioFactory(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
                break;

            case SmsProvider.SendInBlue:
                this._provider = new SendInBlueFactory(SENDINBLUE_API_KEY);
                break;

            case SmsProvider.Console:
            default:
                this._provider = new SmsConsoleFactory();
                break;
        }
    }

    async send(phoneNumber: string, content: string): Promise<any> {
        return await this._provider.send(phoneNumber, content);
    }
}
