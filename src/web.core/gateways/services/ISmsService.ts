export interface ISmsService {
    sendVerificationCode(phone: string): Promise<void>;
}
