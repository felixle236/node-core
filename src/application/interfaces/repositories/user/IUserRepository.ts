import { User } from 'domain/entities/user/User';
import { IRepository } from 'shared/database/interfaces/IRepository';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUserRepository extends IRepository<User> {}
