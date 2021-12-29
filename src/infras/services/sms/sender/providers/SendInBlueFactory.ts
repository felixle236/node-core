import { SMS_SENDER_OR_PHONE } from 'config/Configuration';
import sibApiV3Sdk from 'sib-api-v3-sdk';
import { ISmsProvider } from '../interfaces/ISmsProvider';

/**
 * Transactional SMS
 * Need config SendinBlue account before use SendinBlue APIs.
 * https://developers.sendinblue.com/docs
 */

export class SendInBlueFactory implements ISmsProvider {
    private readonly _provider;

    constructor(apiKey: string) {
        sibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;
        this._provider = new sibApiV3Sdk.TransactionalSMSApi();
    }

    async send(phoneNumber: string, content: string): Promise<any> {
        return await this._provider.sendTransacSms({
            sender: SMS_SENDER_OR_PHONE,
            recipient: phoneNumber,
            content
        });
    }
}
