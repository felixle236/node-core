import { Auth } from '@domain/entities/auth/Auth';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';

export interface IAuthRepository extends IBaseRepository<string, Auth> {
    getAllByUser(userId: string): Promise<Auth[]>;
    getAllByUser(userId: string, queryRunner?: IDbQueryRunner): Promise<Auth[]>;

    getByUsername(username: string): Promise<Auth | null>;
}
