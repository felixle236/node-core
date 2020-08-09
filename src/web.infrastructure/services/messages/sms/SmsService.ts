import { ISmsSender } from './sender/interfaces/ISmsSender';
import { ISmsService } from '../../../../web.core/interfaces/services/ISmsService';
import { SMS_SENDER_NAME } from '../../../../constants/Environments';
import { Service } from 'typedi';
import { SmsSender } from './sender';
import { User } from '../../../../web.core/domain/entities/User';
import { UserActivationCodeTemplate } from './templates/UserActivationCodeTemplate';

@Service('sms.service')
export class SmsService implements ISmsService {
    private readonly _sender: ISmsSender;

    constructor() {
        this._sender = new SmsSender();
    }

    async sendVerificationCode(user: User): Promise<void> {
        const content = UserActivationCodeTemplate.getTemplate(Date.now().toString());
        await this._sender.sendSMS(SMS_SENDER_NAME, user.phone!, content);
    }
}
