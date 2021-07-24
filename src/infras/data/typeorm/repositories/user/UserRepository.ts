import { UserDb } from '@data/typeorm/entities/user/UserDb';
import { USER_SCHEMA } from '@data/typeorm/schemas/user/UserSchema';
import { User } from '@domain/entities/user/User';
import { IUserRepository } from '@gateways/repositories/user/IUserRepository';
import { Service } from 'typedi';
import { BaseRepository } from '../base/BaseRepository';

@Service('user.repository')
export class UserRepository extends BaseRepository<string, User, UserDb> implements IUserRepository {
    constructor() {
        super(UserDb, USER_SCHEMA);
    }
}
