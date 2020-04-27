export interface ISmsSender {
    sendSMS(senderName: string, phoneNumber: string, content: string): Promise<any>;
}
