export interface IMailProvider {
    send(senderName: string, senderEmail: string, emails: string | string[], subject: string, content: string): Promise<any>;

    sendHtml(senderName: string, senderEmail: string, emails: string | string[], subject: string, htmlContent: string): Promise<any>;
}
