import { SMS_SENDER_OR_PHONE } from '@configs/Configuration';
import { ISmsService } from '@gateways/services/ISmsService';
import { Service } from 'typedi';
import { SmsSender } from './sender/SmsSender';
import { UserActivationCodeTemplate } from './templates/UserActivationCodeTemplate';

@Service('sms.service')
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
