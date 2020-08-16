export interface ISmsProvider {
    send(senderOrPhone: string, phoneNumber: string, content: string): Promise<any>;
}
