import { DbPagination } from '../../../domain/common/database/DbPagination';
import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '../../../domain/common/database/interfaces/IDbQueryRunner';
import { Client } from '../../../domain/entities/client/Client';
import { ClientStatus } from '../../../domain/enums/client/ClientStatus';

export class FindClientFilter extends DbPagination {
    keyword: string | null;
    status: ClientStatus | null;
}

export interface IClientRepository extends IBaseRepository<Client, string> {
    findAndCount(param: FindClientFilter): Promise<[Client[], number]>;

    getByEmail(email: string): Promise<Client | undefined>;
    getByEmail(email: string, queryRunner: IDbQueryRunner): Promise<Client | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
    checkEmailExist(email: string, queryRunner: IDbQueryRunner): Promise<boolean>;
}
