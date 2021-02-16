import { DbPagination } from '../../../domain/common/database/DbPagination';
import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { Role } from '../../../domain/entities/role/Role';

export class FindRoleFilter extends DbPagination {
    keyword: string | null;
}

export class FindRoleCommonFilter extends DbPagination {
    keyword: string | null;
}

export interface IRoleRepository extends IBaseRepository<Role, string> {
    /**
     * Get all roles with caching mode.
     */
    getAll(): Promise<Role[]>;

    /**
     * Get all roles with caching mode, we can set the time for caching expiration.
     * @param expireTimeCaching config expire time.
     */
    getAll(expireTimeCaching: number): Promise<Role[]>;

    findAndCount(param: FindRoleFilter): Promise<[Role[], number]>;

    findCommonAndCount(filter: FindRoleCommonFilter): Promise<[Role[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;

    clearCaching(): Promise<void>;
}
