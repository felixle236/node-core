import { FindRoleCommonFilter } from '../../interactors/role/find-role-common/Filter';
import { IRead } from '../../domain/common/persistence/IRead';
import { IWrite } from '../../domain/common/persistence/IWrite';
import { Role } from '../../domain/entities/Role';

export interface IRoleRepository extends IRead<Role, string>, IWrite<Role, string> {
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
