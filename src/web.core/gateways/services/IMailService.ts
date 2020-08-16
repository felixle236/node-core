import { IUser } from '../../domain/types/IUser';

export interface IMailService {
    sendUserActivation(user: IUser): Promise<void>;

    resendUserActivation(user: IUser): Promise<void>;

    sendForgotPassword(user: IUser): Promise<void>;
}
