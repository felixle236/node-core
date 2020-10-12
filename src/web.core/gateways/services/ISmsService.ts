import { IUser } from '../../domain/types/user/IUser';

export interface ISmsService {
    sendVerificationCode(user: IUser): Promise<void>;
}
