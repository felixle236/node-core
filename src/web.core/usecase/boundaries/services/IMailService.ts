import { User } from '../../../domain/entities/User';

export interface IMailService {
    sendUserActivation(user: User): Promise<void>;

    resendUserActivation(user: User): Promise<void>;

    sendForgotPassword(user: User): Promise<void>;
}
