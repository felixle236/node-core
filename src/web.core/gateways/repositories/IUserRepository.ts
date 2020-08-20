import { FindContactFilter } from '../../interactors/contact/find-contact/Filter';
import { IBaseRepository } from '../../domain/common/persistence/IBaseRepository';
import { IDbQueryRunner } from '../../domain/common/persistence/IDbQueryRunner';
import { User } from '../../domain/entities/User';

export interface IUserRepository extends IBaseRepository<User, string> {
    findContactAndCount(filter: FindContactFilter): Promise<[User[], number]>;

    getByEmail(email: string): Promise<User | undefined>;
    getByEmail(email: string, queryRunner: IDbQueryRunner): Promise<User | undefined>;

    getByUserPassword(email: string, password: string): Promise<User | undefined>;

    getByActiveKey(activeKey: string): Promise<User | undefined>;

    getByForgotKey(forgotKey: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
