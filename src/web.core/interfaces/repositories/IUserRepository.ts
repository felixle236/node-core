import { FindMemberFilter } from '../../interactors/member/find-member/Filter';
import { IRead } from '../../domain/common/persistence/IRead';
import { IWrite } from '../../domain/common/persistence/IWrite';
import { QueryRunner } from 'typeorm';
import { User } from '../../domain/entities/User';

export interface IUserRepository extends IRead<User, number>, IWrite<User, number> {
    findMemberAndCount(filter: FindMemberFilter): Promise<[User[], number]>;

    getByEmail(email: string): Promise<User | undefined>;
    getByEmail(email: string, queryRunner: QueryRunner): Promise<User | undefined>;

    getByUserPassword(email: string, password: string): Promise<User | undefined>;

    getByActiveKey(activeKey: string): Promise<User | undefined>;

    getByForgotKey(forgotKey: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
}
