import { IUser } from '../../domain/types/IUser';

export interface ISmsService {
    sendVerificationCode(user: IUser): Promise<void>;
}
