export interface IMailSender {
    send(senderEmail: string, senderName: string, emails: string | string[], subject: string, content: string): Promise<any>;

    sendHtml(senderEmail: string, senderName: string, emails: string | string[], subject: string, htmlContent: string): Promise<any>;
}
