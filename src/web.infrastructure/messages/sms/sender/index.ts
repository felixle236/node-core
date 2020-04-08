import { ENABLE_DATA_LOGGING, MAIL_TYPE, SENDINBLUE_API_KEY } from '../../../../constants/Environments';
import { ISmsSender } from './interfaces/ISmsSender';
import { LoggingFactory } from './providers/LoggingFactory';
import { SendInBlueFactory } from './providers/SendInBlueFactory';
import { SmsType } from '../../../../constants/Enums';

export class SmsSender {
    private sms: ISmsSender;

    constructor() {
        switch (MAIL_TYPE) {
        case SmsType.SEND_IN_BLUE:
            this.sms = new SendInBlueFactory(SENDINBLUE_API_KEY);
            break;

        case SmsType.LOGGING:
        default:
            this.sms = new LoggingFactory(ENABLE_DATA_LOGGING);
            break;
        }
    }

    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any> {
        return this.sms.sendSMS(senderName, phoneNumber, content);
    }
}
