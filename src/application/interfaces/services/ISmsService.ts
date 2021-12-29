export interface ISmsService {
    sendVerificationCode(phone: string, param: { code: string, locale?: string }): Promise<void>;
}
