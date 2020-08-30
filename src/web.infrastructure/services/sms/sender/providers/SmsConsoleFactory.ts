import { ISmsProvider } from '../interfaces/ISmsProvider';

export class SmsConsoleFactory implements ISmsProvider {
    async send(senderOrPhone: string, phoneNumber: string, content: string): Promise<any> {
        const data = {
            senderOrPhone,
            phoneNumber,
            content
        };
        console.log('SmsService.send', data);
        return data;
    }
}
