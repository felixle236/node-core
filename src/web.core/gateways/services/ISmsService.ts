import { User } from '../../domain/entities/User';

export interface ISmsService {
    sendVerificationCode(user: IUser): Promise<void>;
}
