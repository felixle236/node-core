import { FindContactFilter } from '../../interactors/contact/find-contact/Filter';
import { IDbQueryRunner } from '../../domain/common/persistence/IDbQueryRunner';
import { IRead } from '../../domain/common/persistence/IRead';
import { IWrite } from '../../domain/common/persistence/IWrite';
import { User } from '../../domain/entities/User';

export interface IUserRepository extends IRead<User, number>, IWrite<User, number> {
    findContactAndCount(filter: FindContactFilter): Promise<[User[], number]>;

    getByEmail(email: string): Promise<User | undefined>;
    getByEmail(email: string, queryRunner: IDbQueryRunner): Promise<User | undefined>;

    getByUserPassword(email: string, password: string): Promise<User | undefined>;

    getByActiveKey(activeKey: string): Promise<User | undefined>;

    getByForgotKey(forgotKey: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
