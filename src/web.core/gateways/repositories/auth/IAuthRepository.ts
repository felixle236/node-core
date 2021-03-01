import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { Auth } from '../../../domain/entities/auth/Auth';

export interface IAuthRepository extends IBaseRepository<Auth, string> {
    getAllByUser(userId: string): Promise<Auth[]>;

    getByUsername(username: string): Promise<Auth | null>;

    getByUsernamePassword(username: string, password: string): Promise<Auth | null>;
}
