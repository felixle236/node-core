import { User } from '../../domain/entities/User';

export interface ISmsService {
    sendVerificationCode(user: User): Promise<void>;
}
