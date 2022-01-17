import { Auth } from 'domain/entities/auth/Auth';
import { DbQuerySession } from 'shared/database/DbTypes';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IAuthRepository extends IRepository<Auth> {
  getAllByUser(userId: string): Promise<Auth[]>;
  getAllByUser(userId: string, querySession: DbQuerySession): Promise<Auth[]>;

  getByUsername(username: string): Promise<Auth | undefined>;
}
