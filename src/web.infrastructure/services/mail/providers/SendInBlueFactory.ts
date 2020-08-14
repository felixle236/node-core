import { IMailProvider } from './interfaces/IMailProvider';
const sibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Transactional emails - SMTP
 * Need config SendinBlue account before use SendinBlue APIs.
 * https://developers.sendinblue.com/docs
 */

export class SendInBlueFactory implements IMailProvider {
    private readonly _smtpApi;

    constructor(apiKey: string) {
        sibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = apiKey;
        this._smtpApi = new sibApiV3Sdk.SMTPApi();
    }

    async send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return await this._smtpApi.sendTransacEmail({
            sender: {
                name: senderName,
                email: senderEmail
            },
            to: Array.isArray(emails) ? emails.map(e => ({ email: e })) : [{ email: emails }],
            subject,
            textContent: content
        });
    }

    async sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return await this._smtpApi.sendTransacEmail({
            sender: {
                name: senderName,
                email: senderEmail
            },
            to: Array.isArray(emails) ? emails.map(e => ({ email: e })) : [{ email: emails }],
            subject,
            htmlContent
        });
    }
}
