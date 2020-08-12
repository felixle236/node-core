import { Brackets, QueryRunner } from 'typeorm';
import { BaseRepository } from './base/BaseRepository';
import { FindMemberFilter } from '../../../../web.core/interactors/member/find-member/Filter';
import { FindUserFilter } from '../../../../web.core/interactors/user/find-user/Filter';
import { IUserRepository } from '../../../../web.core/interfaces/repositories/IUserRepository';
import { ROLE_SCHEMA } from '../schemas/RoleSchema';
import { Service } from 'typedi';
import { USER_SCHEMA } from '../schemas/UserSchema';
import { User } from '../../../../web.core/domain/entities/User';
import { UserDbEntity } from '../entities/UserDbEntity';
import { UserStatus } from '../../../../web.core/domain/enums/UserStatus';

@Service('user.repository')
export class UserRepository extends BaseRepository<User, UserDbEntity, number> implements IUserRepository {
    constructor() {
        super(UserDbEntity, USER_SCHEMA);
    }

    async findAndCount(filter: FindUserFilter): Promise<[User[], number]> {
        let query = this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME);
        query = query.andWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.STATUS} = :status`, { status: filter.status || UserStatus.ACTIVED });

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL} > :level`, { level: filter.userAuth.role.level });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        if (filter.roleId)
            query = query.andWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ROLE_ID} = :roleId`, { roleId: filter.roleId });

        query = query
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findMemberAndCount(filter: FindMemberFilter): Promise<[User[], number]> {
        let query = this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME)
            .where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.STATUS} = :status`, { status: UserStatus.ACTIVED });

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${ROLE_SCHEMA.TABLE_NAME}.${ROLE_SCHEMA.COLUMNS.LEVEL} >= :level`, { level: filter.userAuth.role.level });

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query = query
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getById(id: number, queryRunner?: QueryRunner): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME, queryRunner)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return result?.toEntity();
    }

    async getByEmail(email: string, queryRunner?: QueryRunner): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME, queryRunner)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result?.toEntity();
    }

    async getByUserPassword(email: string, password: string): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .andWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.PASSWORD} = :password`, { password })
            .getOne();
        return result?.toEntity();
    }

    async getByActiveKey(activeKey: string): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ACTIVE_KEY} = :activeKey`, { activeKey })
            .getOne();
        return result?.toEntity();
    }

    async getByForgotKey(forgotKey: string): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.FORGOT_KEY} = :forgotKey`, { forgotKey })
            .getOne();
        return result?.toEntity();
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }
}
