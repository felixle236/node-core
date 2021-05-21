import Container from 'typedi';
import { ILogService } from '../../../../../web.core/gateways/services/ILogService';
import { ISmsProvider } from '../interfaces/ISmsProvider';

export class SmsConsoleFactory implements ISmsProvider {
    private readonly _logService = Container.get<ILogService>('log.service');

    async send(senderOrPhone: string, phoneNumber: string, content: string): Promise<any> {
        const data = {
            senderOrPhone,
            phoneNumber,
            content
        };
        this._logService.debug('SmsService.send', data);
        return data;
    }
}
