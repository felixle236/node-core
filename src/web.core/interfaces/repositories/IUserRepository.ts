import { IMemberFilter } from '../filters/member/IMemberFilter';
import { IUserCommonFilter } from '../filters/user/IUserCommonFilter';
import { IUserFilter } from '../filters/user/IUserFilter';
import { QueryRunner } from 'typeorm';
import { User } from '../../domain/entities/User';
import { UserActiveData } from '../../dtos/user/data/UserActiveData';
import { UserArchiveData } from '../../dtos/user/data/UserArchiveData';
import { UserCreateData } from '../../dtos/user/data/UserCreateData';
import { UserForgotData } from '../../dtos/user/data/UserForgotData';
import { UserResetPasswordData } from '../../dtos/user/data/UserResetPasswordData';
import { UserUpdateData } from '../../dtos/user/data/UserUpdateData';
import { UserUpdatePasswordData } from '../../dtos/user/data/UserUpdatePasswordData';

export interface IUserRepository {
    find(filter: IUserFilter): Promise<[User[], number]>;

    findMembers(filter: IMemberFilter): Promise<[User[], number]>;

    findCommon(filter: IUserCommonFilter): Promise<[User[], number]>;

    getById(id: number): Promise<User | undefined>;
    getById(id: number, queryRunner: QueryRunner): Promise<User | undefined>;

    getByEmail(email: string): Promise<User | undefined>;
    getByEmail(email: string, queryRunner: QueryRunner): Promise<User | undefined>;

    getByUserPassword(email: string, password: string): Promise<User | undefined>;

    getByActiveKey(activeKey: string): Promise<User | undefined>;

    getByForgotKey(forgotKey: string): Promise<User | undefined>;

    checkEmailExist(email: string): Promise<boolean>;

    create(data: UserCreateData): Promise<number | undefined>;
    create(data: UserCreateData, queryRunner: QueryRunner): Promise<number | undefined>;

    update(id: number, data: UserUpdateData): Promise<boolean>;
    update(id: number, data: UserActiveData): Promise<boolean>;
    update(id: number, data: UserForgotData): Promise<boolean>;
    update(id: number, data: UserUpdatePasswordData): Promise<boolean>;
    update(id: number, data: UserResetPasswordData): Promise<boolean>;
    update(id: number, data: UserArchiveData): Promise<boolean>;
    update(id: number, data: UserUpdateData | UserActiveData, queryRunner: QueryRunner): Promise<boolean>;

    delete(id: number): Promise<boolean>;
}
