import { Brackets, QueryRunner, getRepository } from 'typeorm';
import { mapModel, mapModels } from '../../../../libs/common';
import { IUser } from '../../../../web.core/interfaces/models/IUser';
import { IUserRepository } from '../../../../web.core/interfaces/gateways/data/IUserRepository';
import { MemberFilterRequest } from '../../../../web.core/dtos/member/requests/MemberFilterRequest';
import { PermissionSchema } from '../schemas/PermissionSchema';
import { RoleSchema } from '../schemas/RoleSchema';
import { Service } from 'typedi';
import { User } from '../../../../web.core/models/User';
import { UserEntity } from '../entities/UserEntity';
import { UserFilterRequest } from '../../../../web.core/dtos/user/requests/UserFilterRequest';
import { UserLookupFilterRequest } from '../../../../web.core/dtos/user/requests/UserLookupFilterRequest';
import { UserSchema } from '../schemas/UserSchema';

@Service('user.repository')
export class UserRepository implements IUserRepository {
    private readonly repository = getRepository<IUser>(UserEntity);

    async find(filter: UserFilterRequest): Promise<[User[], number]> {
        let query = this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME);

        if (filter.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.level}`);

        if (filter.isActived != null)
            query = query.andWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ACTIVED_AT} IS ${filter.isActived ? 'NOT' : ''} NULL`);

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

        const [users, count] = await query.getManyAndCount();
        return [mapModels(User, users), count];
    }

    async findMembers(filter: MemberFilterRequest): Promise<[User[], number]> {
        let query = this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ACTIVED_AT} IS NOT NULL`);

        if (filter.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} >= ${filter.level}`);

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

        const [users, count] = await query.getManyAndCount();
        return [mapModels(User, users), count];
    }

    async lookup(filter: UserLookupFilterRequest): Promise<[User[], number]> {
        let query = this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .select([
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ID}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FIRST_NAME}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.LAST_NAME}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}`,
                `${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.AVATAR}`
            ])
            .innerJoin(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ACTIVED_AT} IS NOT NULL`);

        if (filter.level)
            query = query.andWhere(`${RoleSchema.TABLE_NAME}.${RoleSchema.COLUMNS.LEVEL} > ${filter.level}`);

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

        const [users, count] = await query.getManyAndCount();
        return [mapModels(User, users), count];
    }

    async getById(id: number, queryRunner?: QueryRunner): Promise<User | undefined> {
        const user = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return mapModel(User, user);
    }

    async getByEmail(email: string, queryRunner?: QueryRunner): Promise<User | undefined> {
        const user = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .where(`LOWER(${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return mapModel(User, user);
    }

    async getByUserPassword(email: string, password: string): Promise<User | undefined> {
        const user = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .innerJoinAndSelect(`${UserSchema.TABLE_NAME}.${UserSchema.RELATED_ONE.ROLE}`, RoleSchema.TABLE_NAME)
            .leftJoinAndSelect(`${RoleSchema.TABLE_NAME}.${RoleSchema.RELATED_MANY.PERMISSIONS}`, PermissionSchema.TABLE_NAME)
            .where(`LOWER(${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .andWhere(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.PASSWORD} = :password`, { password })
            .getOne();
        return mapModel(User, user);
    }

    async getByActiveKey(activeKey: string): Promise<User | undefined> {
        const user = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.ACTIVE_KEY} = :activeKey`, { activeKey })
            .getOne();
        return mapModel(User, user);
    }

    async getByForgotKey(forgotKey: string): Promise<User | undefined> {
        const user = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .where(`${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.FORGOT_KEY} = :forgotKey`, { forgotKey })
            .getOne();
        return mapModel(User, user);
    }

    async checkEmailExist(email: string): Promise<boolean> {
        const user = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .where(`LOWER(${UserSchema.TABLE_NAME}.${UserSchema.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!user;
    }

    async create(user: User, queryRunner?: QueryRunner): Promise<number | undefined> {
        const result = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .insert()
            .values(user.toData())
            .execute();
        return result.identifiers && result.identifiers.length && result.identifiers[0].id;
    }

    async update(id: number, user: User, queryRunner?: QueryRunner): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME, queryRunner)
            .update(user.toData())
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(UserSchema.TABLE_NAME)
            .softDelete()
            .whereInIds(id)
            .execute();
        return !!result.affected;
    }
}
