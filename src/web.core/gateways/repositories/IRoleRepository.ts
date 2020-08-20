import { FindRoleCommonFilter } from '../../interactors/role/find-role-common/Filter';
import { IBaseRepository } from '../../domain/common/persistence/IBaseRepository';
import { Role } from '../../domain/entities/Role';

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

    findCommonAndCount(filter: FindRoleCommonFilter): Promise<[Role[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: string): Promise<boolean>;

    clearCaching(): Promise<void>;
}
