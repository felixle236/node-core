import { Auth } from '@domain/entities/auth/Auth';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export interface IAuthRepository extends IBaseRepository<string, Auth> {
    getAllByUser(userId: string): Promise<Auth[]>;

    getByUsername(username: string): Promise<Auth | null>;

    getByUsernamePassword(username: string, password: string): Promise<Auth | null>;
}
