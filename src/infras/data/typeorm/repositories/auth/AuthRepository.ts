import { Auth } from 'domain/entities/auth/Auth';
import { IAuthRepository } from 'application/interfaces/repositories/auth/IAuthRepository';
import { DbQuerySession } from 'shared/database/DbTypes';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Repository } from '../../common/Repository';
import { AuthDb } from '../../entities/auth/AuthDb';
import { UserDb } from '../../entities/user/UserDb';
import { AUTH_SCHEMA } from '../../schemas/auth/AuthSchema';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';

@Service(InjectRepository.Auth)
export class AuthRepository extends Repository<Auth, AuthDb> implements IAuthRepository {
    constructor() {
        super(AuthDb, AUTH_SCHEMA);
    }

    async getAllByUser(userId: string, querySession?: DbQuerySession): Promise<Auth[]> {
        const results = await this.repository.createQueryBuilder(AUTH_SCHEMA.TABLE_NAME, querySession)
            .where(`${AUTH_SCHEMA.TABLE_NAME}.${AUTH_SCHEMA.COLUMNS.USER_ID} = :userId`, { userId })
            .getMany();
        return results.map(result => result.toEntity());
    }

    async getByUsername(username: string): Promise<Auth | undefined> {
        const query = this.repository.createQueryBuilder(AUTH_SCHEMA.TABLE_NAME)
            .innerJoinAndMapOne(`${AUTH_SCHEMA.TABLE_NAME}.${AUTH_SCHEMA.RELATED_ONE.USER}`, UserDb, USER_SCHEMA.TABLE_NAME, `${AUTH_SCHEMA.TABLE_NAME}.${AUTH_SCHEMA.COLUMNS.USER_ID} = ${USER_SCHEMA.TABLE_NAME}.${USER_SCHEMA.COLUMNS.ID}`)
            .where(`LOWER(${AUTH_SCHEMA.TABLE_NAME}.${AUTH_SCHEMA.COLUMNS.USERNAME}) = LOWER(:username)`, { username });

        const result = await query.getOne();
        return result && result.toEntity();
    }
}
