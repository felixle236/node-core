import { DbPagination } from '../../../domain/common/database/DbPagination';
import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { IDbQueryRunner } from '../../../domain/common/database/interfaces/IDbQueryRunner';
import { Manager } from '../../../domain/entities/manager/Manager';
import { ManagerStatus } from '../../../domain/enums/manager/ManagerStatus';

export class FindManagerFilter extends DbPagination {
    keyword: string | null;
    status: ManagerStatus | null;
}

export interface IManagerRepository extends IBaseRepository<Manager, string> {
    findAndCount(param: FindManagerFilter): Promise<[Manager[], number]>;

    getByEmail(email: string): Promise<Manager | undefined>;
    getByEmail(email: string, queryRunner: IDbQueryRunner): Promise<Manager | undefined>;

    checkEmailExist(email: string): Promise<boolean>;
    checkEmailExist(email: string, queryRunner: IDbQueryRunner): Promise<boolean>;
}
