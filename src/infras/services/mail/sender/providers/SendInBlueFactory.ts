import { SENDINBLUE_API_KEY } from 'config/Configuration';
import sibApiV3Sdk from 'sib-api-v3-sdk';
import { IMailProvider } from '../interfaces/IMailProvider';

/**
 * Transactional emails - SMTP
 * Need config SendinBlue account before use SendinBlue APIs.
 * https://developers.sendinblue.com/docs
 */

export class SendInBlueFactory implements IMailProvider {
  private readonly _smtpApi;

  constructor() {
    sibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = SENDINBLUE_API_KEY;
    this._smtpApi = new sibApiV3Sdk.TransactionalEmailsApi();
  }

  async send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
    return await this._smtpApi.sendTransacEmail({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: Array.isArray(emails) ? emails.map((e) => ({ email: e })) : [{ email: emails }],
      subject,
      textContent: content,
    });
  }

  async sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
    return await this._smtpApi.sendTransacEmail({
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: Array.isArray(emails) ? emails.map((e) => ({ email: e })) : [{ email: emails }],
      subject,
      htmlContent,
    });
  }
}
