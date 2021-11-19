import { ISmsService } from 'application/interfaces/services/ISmsService';
import { SMS_SENDER_OR_PHONE } from 'config/Configuration';
import { InjectService } from 'shared/types/Injection';
import { Service } from 'typedi';
import { SmsSender } from './sender/SmsSender';
import { UserActivationCodeTemplate } from './templates/UserActivationCodeTemplate';

@Service(InjectService.SMS)
export class SmsService implements ISmsService {
    private readonly _sender: SmsSender;

    constructor() {
        this._sender = new SmsSender();
    }

    async sendVerificationCode(phone: string, code: string, locale?: string): Promise<void> {
        const content = UserActivationCodeTemplate.getTemplate(code, locale);
        await this._sender.send(SMS_SENDER_OR_PHONE, phone, content);
    }
}
