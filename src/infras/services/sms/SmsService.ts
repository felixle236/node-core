import { ISmsService } from 'application/interfaces/services/ISmsService';
import { PROJECT_NAME } from 'config/Configuration';
import { i18n } from 'shared/localization/Localization';
import { InjectService } from 'shared/types/Injection';
import { Service } from 'typedi';
import { SmsSender } from './sender/SmsSender';

@Service(InjectService.SMS)
export class SmsService implements ISmsService {
  private readonly _sender: SmsSender;

  constructor() {
    this._sender = new SmsSender();
  }

  async sendVerificationCode(phone: string, param: { code: string; locale?: string }): Promise<void> {
    const content = i18n.__(
      { phrase: 'sms.your_verification_code_from_{{projectName}}_is_{{code}}', locale: param.locale },
      { projectName: PROJECT_NAME, code: param.code },
    );
    await this._sender.send(phone, content);
  }
}
