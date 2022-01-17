import { User } from 'domain/entities/user/User';
import { IUserRepository } from 'application/interfaces/repositories/user/IUserRepository';
import { InjectRepository } from 'shared/types/Injection';
import { Service } from 'typedi';
import { Repository } from '../../common/Repository';
import { UserDb } from '../../entities/user/UserDb';
import { USER_SCHEMA } from '../../schemas/user/UserSchema';

@Service(InjectRepository.User)
export class UserRepository extends Repository<User, UserDb> implements IUserRepository {
  constructor() {
    super(UserDb, USER_SCHEMA);
  }
}
