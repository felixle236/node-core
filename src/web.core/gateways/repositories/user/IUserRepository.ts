import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { User } from '../../../domain/entities/user/User';

export interface IUserRepository extends IBaseRepository<User, string> {

}
