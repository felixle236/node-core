import { SENDINBLUE_API_KEY, SMS_SENDER } from '../../../../../constants/Environments';
import { ISmsSender } from './gateways/ISmsSender';
import { LoggingFactory } from './providers/LoggingFactory';
import { SendInBlueFactory } from './providers/SendInBlueFactory';
import { SmsSenderType } from '../../../../../constants/Enums';

export class SmsSender implements ISmsSender {
    private readonly _sms: ISmsSender;

    constructor() {
        switch (SMS_SENDER) {
        case SmsSenderType.SEND_IN_BLUE:
            this._sms = new SendInBlueFactory(SENDINBLUE_API_KEY);
            break;

        case SmsSenderType.LOGGING:
        default:
            this._sms = new LoggingFactory();
            break;
        }
    }

    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any> {
        return this._sms.sendSMS(senderName, phoneNumber, content);
    }
}
