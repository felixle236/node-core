import * as nodeMailer from 'nodemailer';
import { IMailProvider } from '../interfaces/IMailProvider';

/**
 * Need config Google account before use Google SMTP.
 * https://myaccount.google.com/u/2/lesssecureapps?pli=1&pageId=none
 * https://accounts.google.com/b/0/DisplayUnlockCaptcha
 */

export class GoogleSmtpFactory implements IMailProvider {
    private readonly _transporter: nodeMailer.Transporter;

    constructor(userName: string, password: string) {
        this._transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: userName,
                pass: password
            }
        });
    }

    async send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return await this._transporter.sendMail({
            from: `${senderName} <${senderEmail}>`,
            to: Array.isArray(emails) ? (emails.length > 0 ? emails.join(', ') : emails[0]) : emails,
            subject: subject,
            text: content
        });
    }

    async sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return await this._transporter.sendMail({
            from: `${senderName} <${senderEmail}>`,
            to: Array.isArray(emails) ? (emails.length > 0 ? emails.join(', ') : emails[0]) : emails,
            subject: subject,
            html: htmlContent
        });
    }
}
