import { ISmsSender } from '../interfaces/ISmsSender';
const sibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Transactional SMS
 * Need config SendinBlue account before use SendinBlue APIs.
 * https://developers.sendinblue.com/docs
 */

export class SendInBlueFactory implements ISmsSender {
    private smsApi;

    constructor(apiKey: string) {
        sibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;
        this.smsApi = new sibApiV3Sdk.TransactionalSMSApi();
    }

    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any> {
        return this.smsApi.sendTransacSms({
            sender: senderName,
            recipient: phoneNumber,
            content
        });
    }
}
