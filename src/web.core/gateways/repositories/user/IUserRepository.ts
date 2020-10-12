import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '../../../domain/common/database/interfaces/IDbQueryRunner';
import { User } from '../../../domain/entities/user/User';

export interface IUserRepository extends IBaseRepository<User, string> {
    getByEmail(email: string): Promise<User | undefined>;

    getByEmailPassword(email: string, password: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
    checkEmailExist(email: string, queryRunner: IDbQueryRunner): Promise<boolean>;
}
