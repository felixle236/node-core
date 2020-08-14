import { User } from '../../domain/entities/User';

export interface IMailService {
    sendUserActivation(user: IUser): Promise<void>;

    resendUserActivation(user: IUser): Promise<void>;

    sendForgotPassword(user: IUser): Promise<void>;
}
