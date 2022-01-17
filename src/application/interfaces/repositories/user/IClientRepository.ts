import { Client } from 'domain/entities/user/Client';
import { ClientStatus } from 'domain/enums/user/ClientStatus';
import { SelectFilterPaginationQuery } from 'shared/database/DbTypes';
import { IRepository } from 'shared/database/interfaces/IRepository';

export interface IClientRepository extends IRepository<Client> {
  findAndCount(filter: { keyword?: string; status?: ClientStatus } & SelectFilterPaginationQuery<Client>): Promise<[Client[], number]>;

  getByEmail(email: string): Promise<Client | undefined>;

  checkEmailExist(email: string): Promise<boolean>;
}
