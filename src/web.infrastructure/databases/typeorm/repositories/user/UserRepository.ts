import { Service } from 'typedi';
import { User } from '../../../../../web.core/domain/entities/user/User';
import { IUserRepository } from '../../../../../web.core/gateways/repositories/user/IUserRepository';
import { UserDb } from '../../entities/user/UserDb';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';
import { BaseRepository } from '../base/BaseRepository';

@Service('user.repository')
export class UserRepository extends BaseRepository<User, UserDb, string> implements IUserRepository {
    constructor() {
        super(UserDb, USER_SCHEMA);
    }
}
