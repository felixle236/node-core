import { ISmsService } from '../../../web.core/gateways/services/ISmsService';
import { IUser } from '../../../web.core/domain/types/user/IUser';
import { SMS_SENDER_OR_PHONE } from '../../../configs/Configuration';
import { Service } from 'typedi';
import { SmsSender } from './sender/SmsSender';
import { UserActivationCodeTemplate } from './templates/UserActivationCodeTemplate';

@Service('sms.service')
export class SmsService implements ISmsService {
    private readonly _sender: SmsSender;

    constructor() {
        this._sender = new SmsSender();
    }

    async sendVerificationCode(user: IUser): Promise<void> {
        const content = UserActivationCodeTemplate.getTemplate(Date.now().toString());
        await this._sender.send(SMS_SENDER_OR_PHONE, user.phone!, content);
    }
}
