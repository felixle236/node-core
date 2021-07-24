import { Client } from '@domain/entities/user/Client';
import { ClientStatus } from '@domain/enums/user/ClientStatus';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '@shared/database/interfaces/IDbQueryRunner';

export class FindClientFilter extends DbPaginationFilter {
    keyword: string | null;
    status: ClientStatus | null;
}

export interface IClientRepository extends IBaseRepository<string, Client> {
    findAndCount(param: FindClientFilter): Promise<[Client[], number]>;

    getByEmail(email: string): Promise<Client | null>;

    checkEmailExist(email: string): Promise<boolean>;
    checkEmailExist(email: string, queryRunner: IDbQueryRunner): Promise<boolean>;
}
