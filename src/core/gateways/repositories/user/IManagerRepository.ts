import { Manager } from '@domain/entities/user/Manager';
import { ManagerStatus } from '@domain/enums/user/ManagerStatus';
import { DbPaginationFilter } from '@shared/database/DbPaginationFilter';
import { IBaseRepository } from '@shared/database/interfaces/IBaseRepository';

export class FindManagerFilter extends DbPaginationFilter {
    roleIds: string[] | null;
    keyword: string | null;
    status: ManagerStatus | null;
}

export interface IManagerRepository extends IBaseRepository<string, Manager> {
    findAndCount(param: FindManagerFilter): Promise<[Manager[], number]>;

    getByEmail(email: string): Promise<Manager | null>;

    checkEmailExist(email: string): Promise<boolean>;
}
