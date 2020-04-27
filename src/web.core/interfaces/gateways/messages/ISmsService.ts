import { User } from '../../../models/User';

export interface ISmsService {
    sendVerificationCode(user: User): Promise<void>;
}
