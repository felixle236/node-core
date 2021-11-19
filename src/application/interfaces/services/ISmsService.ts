export interface ISmsService {
    sendVerificationCode(phone: string, code: string): Promise<void>;
    sendVerificationCode(phone: string, code: string, locale: string): Promise<void>;
}
