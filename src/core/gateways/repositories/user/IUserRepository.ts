import { User } from '@domain/entities/user/User';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export interface IUserRepository extends IBaseRepository<string, User> {

}
