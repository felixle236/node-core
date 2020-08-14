import { ISmsSender } from './sender/gateways/ISmsSender';
import { ISmsService } from '../../../../web.core/gateways/services/ISmsService';
import { IUser } from '../../../web.core/domain/types/IUser';
import { SMS_SENDER_NAME } from '../../../../constants/Environments';
import { Service } from 'typedi';
import { SmsSender } from './sender';
import { UserActivationCodeTemplate } from './templates/UserActivationCodeTemplate';

@Service('sms.service')
export class SmsService implements ISmsService {
    private readonly _sender: ISmsSender;

    constructor() {
        this._sender = new SmsSender();
    }

    async sendVerificationCode(user: IUser): Promise<void> {
        const content = UserActivationCodeTemplate.getTemplate(Date.now().toString());
        await this._sender.sendSMS(SMS_SENDER_NAME, user.phone!, content);
    }
}
