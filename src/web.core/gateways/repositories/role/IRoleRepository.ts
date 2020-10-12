import { FindRoleCommonQuery } from '../../../interactors/role/queries/find-role-common/FindRoleCommonQuery';
import { IBaseRepository } from '../../../domain/common/database/interfaces/IBaseRepository';
import { Role } from '../../../domain/entities/role/Role';

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

    findCommonAndCount(filter: FindRoleCommonQuery): Promise<[Role[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;

    clearCaching(): Promise<void>;
}
