import { ENABLE_DATA_LOGGING } from '../../../../../../constants/Environments';
import { ISmsSender } from '../interfaces/ISmsSender';

export class LoggingFactory implements ISmsSender {
    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any> {
        const data = {
            senderName,
            phoneNumber,
            content
        };
        if (ENABLE_DATA_LOGGING) console.log('SmsSender.sendSMS', senderName, phoneNumber, content);
        return Promise.resolve(data);
    }
}
