import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from 'config/Configuration';
import mailgun from 'mailgun-js';
import { IMailProvider } from '../interfaces/IMailProvider';

export class MailGunFactory implements IMailProvider {
  private readonly _sender: mailgun.Mailgun;

  constructor() {
    this._sender = mailgun({
      apiKey: MAILGUN_API_KEY,
      domain: MAILGUN_DOMAIN,
    });
  }

  async send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
    return await this._sender.messages().send({
      from: `${senderName} <${senderEmail}>`,
      to: Array.isArray(emails) ? (emails.length > 0 ? emails.join(', ') : emails[0]) : emails,
      subject: subject,
      text: content,
    });
  }

  async sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
    return await this._sender.messages().send({
      from: `${senderName} <${senderEmail}>`,
      to: Array.isArray(emails) ? (emails.length > 1 ? emails.join(', ') : emails[0]) : emails,
      subject: subject,
      html: htmlContent,
    });
  }
}
