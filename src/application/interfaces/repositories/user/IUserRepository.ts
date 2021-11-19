import { User } from 'domain/entities/user/User';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IUserRepository extends IRepository<User> {

}
