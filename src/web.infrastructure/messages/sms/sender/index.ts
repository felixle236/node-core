import { MAIL_TYPE, SENDINBLUE_API_KEY } from '../../../../constants/Environments';
import { ISmsSender } from './interfaces/ISmsSender';
import { LoggingFactory } from './providers/LoggingFactory';
import { SendInBlueFactory } from './providers/SendInBlueFactory';
import { SmsType } from '../../../../constants/Enums';

export class SmsSender implements ISmsSender {
    private readonly _sms: ISmsSender;

    constructor() {
        switch (MAIL_TYPE) {
        case SmsType.SEND_IN_BLUE:
            this._sms = new SendInBlueFactory(SENDINBLUE_API_KEY);
            break;

        case SmsType.LOGGING:
        default:
            this._sms = new LoggingFactory();
            break;
        }
    }

    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any> {
        return this._sms.sendSMS(senderName, phoneNumber, content);
    }
}
