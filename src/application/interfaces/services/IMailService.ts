export interface IMailService {
    sendUserActivation(param: { name: string, email: string, activeKey: string, locale?: string }): Promise<void>;

    resendUserActivation(param: { name: string, email: string, activeKey: string, locale?: string }): Promise<void>;

    sendForgotPassword(param: { name: string, email: string, forgotKey: string, locale?: string }): Promise<void>;
}
