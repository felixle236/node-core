import { ISmsSender } from '../interfaces/ISmsSender';

export class LoggingFactory implements ISmsSender {
    constructor(private dataLogging: boolean) { }

    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any> {
        const data = {
            senderName,
            phoneNumber,
            content
        };
        if (this.dataLogging) console.log('SmsSender.sendSMS', senderName, phoneNumber, content);
        return Promise.resolve(data);
    }
}
