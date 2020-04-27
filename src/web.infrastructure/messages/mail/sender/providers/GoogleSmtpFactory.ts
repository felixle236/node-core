import * as nodeMailer from 'nodemailer';
import { IMailSender } from '../interfaces/IMailSender';

/**
 * Need config Google account before use Google SMTP.
 * https://myaccount.google.com/u/2/lesssecureapps?pli=1&pageId=none
 * https://accounts.google.com/b/0/DisplayUnlockCaptcha
 */

export class GoogleSmtpFactory implements IMailSender {
    private transporter: nodeMailer.Transporter;

    constructor(userName: string, password: string) {
        this.transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: userName,
                pass: password
            }
        });
    }

    send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any> {
        return this.transporter.sendMail({
            from: `${senderName} <${senderEmail}>`,
            to: Array.isArray(emails) ? (emails.length > 0 ? emails.join(', ') : emails[0]) : emails,
            subject: subject,
            text: content
        });
    }

    sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any> {
        return this.transporter.sendMail({
            from: `${senderName} <${senderEmail}>`,
            to: Array.isArray(emails) ? (emails.length > 0 ? emails.join(', ') : emails[0]) : emails,
            subject: subject,
            html: htmlContent
        });
    }
}
