import { MemberFilterRequest } from '../../../dtos/member/requests/MemberFilterRequest';
import { QueryRunner } from 'typeorm';
import { User } from '../../../models/User';
import { UserFilterRequest } from '../../../dtos/user/requests/UserFilterRequest';
import { UserLookupFilterRequest } from '../../../dtos/user/requests/UserLookupFilterRequest';

export interface IUserRepository {
    find(filter: UserFilterRequest): Promise<[User[], number]>;

    findMembers(filter: MemberFilterRequest): Promise<[User[], number]>;

    lookup(filter: UserLookupFilterRequest): Promise<[User[], number]>;

    getById(id: number): Promise<User | undefined>;
    getById(id: number, queryRunner: QueryRunner): Promise<User | undefined>;

    getByEmail(email: string): Promise<User | undefined>;
    getByEmail(email: string, queryRunner: QueryRunner): Promise<User | undefined>;

    getByUserPassword(email: string, password: string): Promise<User | undefined>;

    getByActiveKey(activeKey: string): Promise<User | undefined>;

    getByForgotKey(forgotKey: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;

    create(data: User): Promise<number | undefined>;
    create(data: User, queryRunner: QueryRunner): Promise<number | undefined>;

    update(id: number, data: User): Promise<boolean>;
    update(id: number, data: User, queryRunner: QueryRunner): Promise<boolean>;

    delete(id: number): Promise<boolean>;
}
