import { Brackets, QueryRunner, getRepository } from 'typeorm';
import { IMemberFilter } from '../../../../web.core/interfaces/filters/member/IMemberFilter';
import { IUserCommonFilter } from '../../../../web.core/interfaces/filters/user/IUserCommonFilter';
import { IUserFilter } from '../../../../web.core/interfaces/filters/user/IUserFilter';
import { IUserRepository } from '../../../../web.core/interfaces/data/IUserRepository';
import { RoleSchema } from '../schemas/RoleSchema';
import { Service } from 'typedi';
import { User } from '../../../../web.core/domain/entities/User';
import { UserActiveData } from '../../../../web.core/dtos/user/data/UserActiveData';
import { UserArchiveData } from '../../../../web.core/dtos/user/data/UserArchiveData';
import { UserCreateData } from '../../../../web.core/dtos/user/data/UserCreateData';
import { UserDbEntity } from '../entities/UserDbEntity';
import { UserForgotData } from '../../../../web.core/dtos/user/data/UserForgotData';
import { UserResetPasswordData } from '../../../../web.core/dtos/user/data/UserResetPasswordData';
import { UserSchema } from '../schemas/UserSchema';
import { UserStatus } from '../../../../web.core/domain/enums/UserStatus';
import { UserUpdateData } from '../../../../web.core/dtos/user/data/UserUpdateData';
import { UserUpdatePasswordData } from '../../../../web.core/dtos/user/data/UserUpdatePasswordData';

@Service('user.repository')
export class UserRepository implements IUserRepository {
    private readonly _repository = getRepository(UserDbEntity);

    async find(filter: IUserFilter): Promise<[User[], number]> {
        let query = this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME);
        query = query.andWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.STATUS} = '${filter.status || UserStatus.ACTIVED}'`);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.userAuth.role.level}`);

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FIRST_NAME} || ' ' || ${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        if (filter.roleId)
            query = query.andWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ROLE_ID} = :roleId`, { roleId: filter.roleId });

        query = query
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findMembers(filter: IMemberFilter): Promise<[User[], number]> {
        let query = this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ACTIVED_AT} IS NOT NULL`);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} >= ${filter.userAuth.role.level}`);

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FIRST_NAME} || ' ' || ${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        query = query
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async findCommon(filter: IUserCommonFilter): Promise<[User[], number]> {
        let query = this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .select([
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ID}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FIRST_NAME}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.LAST_NAME}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.AVATAR}`
            ])
            .innerJoin(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.STATUS} = '${UserStatus.ACTIVED}'`);

        if (filter.userAuth && filter.userAuth.role && filter.userAuth.role.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.userAuth.role.level}`);

        if (filter.keyword) {
            const keyword = `%${filter.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FIRST_NAME} || ' ' || ${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        if (filter.roleId)
            query = query.andWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ROLE_ID} = :roleId`, { roleId: filter.roleId });

        query = query
            .skip(filter.skip)
            .take(filter.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getById(id: number, queryRunner?: QueryRunner): Promise<User | undefined> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return result?.toEntity();
    }

    async getByEmail(email: string, queryRunner?: QueryRunner): Promise<User | undefined> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .where(`LOWER(${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result?.toEntity();
    }

    async getByUserPassword(email: string, password: string): Promise<User | undefined> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .where(`LOWER(${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .andWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.PASSWORD} = :password`, { password })
            .getOne();
        return result?.toEntity();
    }

    async getByActiveKey(activeKey: string): Promise<User | undefined> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ACTIVE_KEY} = :activeKey`, { activeKey })
            .getOne();
        return result?.toEntity();
    }

    async getByForgotKey(forgotKey: string): Promise<User | undefined> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FORGOT_KEY} = :forgotKey`, { forgotKey })
            .getOne();
        return result?.toEntity();
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .where(`LOWER(${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }

    async create(data: UserCreateData, queryRunner?: QueryRunner): Promise<number | undefined> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .insert()
            .values(data)
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async update(id: number,
        data: UserUpdateData |
            UserActiveData |
            UserForgotData |
            UserUpdatePasswordData |
            UserResetPasswordData |
            UserArchiveData,
        queryRunner?: QueryRunner): Promise<boolean> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .update(data)
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this._repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }
}
