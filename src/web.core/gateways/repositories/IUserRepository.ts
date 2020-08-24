import { IBaseRepository } from '../../domain/common/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '../../domain/common/database/interfaces/IDbQueryRunner';
import { User } from '../../domain/entities/User';

export interface IUserRepository extends IBaseRepository<User, string> {
    getByEmail(email: string): Promise<User | undefined>;
    getByEmail(email: string, queryRunner: IDbQueryRunner): Promise<User | undefined>;

    getByUserPassword(email: string, password: string): Promise<User | undefined>;

    getByActiveKey(activeKey: string): Promise<User | undefined>;

    getByForgotKey(forgotKey: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
