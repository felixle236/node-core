import { Service } from 'typedi';
import { Brackets, QueryRunner } from 'typeorm';
import { IDbQueryRunner } from '../../../../../web.core/domain/common/database/interfaces/IDbQueryRunner';
import { User } from '../../../../../web.core/domain/entities/user/User';
import { UserStatus } from '../../../../../web.core/domain/enums/user/UserStatus';
import { IUserRepository } from '../../../../../web.core/gateways/repositories/user/IUserRepository';
import { FindUserQuery } from '../../../../../web.core/usecases/user/queries/find-user/FindUserQuery';
import { UserDb } from '../../entities/user/UserDb';
import { ROLE_SCHEMA } from '../../schemas/role/RoleSchema';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('user.repository')
export class UserRepository extends BaseRepository<User, UserDb, string> implements IUserRepository {
    constructor() {
        super(UserDb, USER_SCHEMA);
    }

    async findAndCount(param: FindUserQuery): Promise<[User[], number]> {
        let query = this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME);

        query = query.where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.STATUS} = :status`, { status: param.status || UserStatus.ACTIVED });

        if (param.roleIds)
            query = query.andWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ROLE_ID} = ANY(:roleIds)`, { roleIds: param.roleIds });

        if (param.keyword) {
            const keyword = `%${param.keyword}%`;
            query = query.andWhere(new Brackets(qb => {
                qb.where(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.FIRST_NAME} || ' ' || ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.LAST_NAME} ILIKE :keyword`, { keyword })
                    .orWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL} ILIKE :keyword`, { keyword });
            }));
        }

        if (param.isBirthdayNearly)
            query = query.where(`date(date_part('year', current_date) || '-' || date_part('month', ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.BIRTHDAY}) || '-' || date_part('day', ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.BIRTHDAY})) between current_date and current_date + interval '30 days'`);

        query = query
            .skip(param.skip)
            .take(param.limit);

        const [list, count] = await query.getManyAndCount();
        return [list.map(item => item.toEntity()), count];
    }

    async getById(id: string, queryRunner?: IDbQueryRunner): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME)
            .whereInIds(id)
            .getOne();
        return result?.toEntity();
    }

    async getByEmail(email: string): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return result?.toEntity();
    }

    async checkEmailExist(email: string, queryRunner?: IDbQueryRunner): Promise<boolean> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME, queryRunner as QueryRunner)
            .select(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .getOne();
        return !!result;
    }

    async getByEmailPassword(email: string, password: string): Promise<User | undefined> {
        const result = await this.repository.createQueryBuilder(USER_SCHEMA.TABLE_NAME)
            .innerJoinAndSelect(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.RELATED_ONE.ROLE}`, ROLE_SCHEMA.TABLE_NAME)
            .where(`LOWER(${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.EMAIL}) = LOWER(:email)`, { email })
            .andWhere(`${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.PASSWORD} = :password`, { password })
            .getOne();
        return result?.toEntity();
    }
}
