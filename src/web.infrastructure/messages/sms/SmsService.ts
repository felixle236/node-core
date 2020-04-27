import { PROJECT_NAME, SMS_SENDER_NAME } from '../../../constants/Environments';
import { ISmsService } from '../../../web.core/interfaces/gateways/messages/ISmsService';
import { Service } from 'typedi';
import { SmsSender } from './sender';
import { User } from '../../../web.core/models/User';

@Service('sms.service')
export class SmsService implements ISmsService {
    private sender: SmsSender;

    async sendVerificationCode(user: User): Promise<void> {
        const content = `Your personal verification code from ${PROJECT_NAME} is: TEST_${Date.now()}`;
        await this.sender.sendSMS(SMS_SENDER_NAME, user.phone!, content);
    }
}
