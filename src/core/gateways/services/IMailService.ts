export interface IMailService {
    sendUserActivation(name: string, email: string, activeKey: string, locale?: string): Promise<void>;

    resendUserActivation(name: string, email: string, activeKey: string, locale?: string): Promise<void>;

    sendForgotPassword(name: string, email: string, forgotKey: string, locale?: string): Promise<void>;
}
