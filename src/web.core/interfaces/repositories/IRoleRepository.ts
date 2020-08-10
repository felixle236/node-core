import { IRead } from '../../domain/common/persistence/IRead';
import { IWrite } from '../../domain/common/persistence/IWrite';
import { QueryRunner } from 'typeorm';
import { Role } from '../../domain/entities/Role';
import { RoleCommonFilter } from '../../interactors/role/FindRoleCommonInteractor';

export interface IRoleRepository extends IRead<Role, number>, IWrite<Role, number> {
    /**
     * Get all roles with caching mode.
     */
    getAll(): Promise<Role[]>;

    /**
     * Get all roles with caching mode, we can set the time for caching expiration.
     * @param expireTimeCaching config expire time.
     */
    getAll(expireTimeCaching: number): Promise<Role[]>;

    findCommon(filter: RoleCommonFilter): Promise<[Role[], number]>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: number): Promise<boolean>;

    create(data: Role): Promise<number | undefined>;
    create(data: Role, queryRunner: QueryRunner): Promise<number | undefined>;

    clearCaching(): Promise<void>;
}
