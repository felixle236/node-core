import { ILogService } from '@gateways/services/ILogService';
import Container from 'typedi';
import { ISmsProvider } from '../interfaces/ISmsProvider';

export class SmsConsoleFactory implements ISmsProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    async send(senderOrPhone: string, phoneNumber: string, content: string): Promise<any> {
        const data = {
            senderOrPhone,
            phoneNumber,
            content
        };
        this._logService.info('SmsService.send', data);
        return data;
    }
}
