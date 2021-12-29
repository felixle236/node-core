import { ILogService } from 'application/interfaces/services/ILogService';
import { SMS_SENDER_OR_PHONE } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import Container from 'typedi';
import { ISmsProvider } from '../interfaces/ISmsProvider';

export class SmsConsoleFactory implements ISmsProvider {
    private readonly _logService = Container.get<ILogService>(InjectService.Log);

    async send(phoneNumber: string, content: string): Promise<any> {
        const data = {
            senderOrPhone: SMS_SENDER_OR_PHONE,
            phoneNumber,
            content
        };
        this._logService.info('SmsService.send', data);
        return data;
    }
}
