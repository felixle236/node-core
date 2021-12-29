export interface ISmsProvider {
    send(phoneNumber: string, content: string): Promise<any>;
}
