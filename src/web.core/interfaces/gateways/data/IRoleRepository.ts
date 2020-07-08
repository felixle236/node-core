import { QueryRunner } from 'typeorm';
import { Role } from '../../../models/Role';
import { RoleCommonFilterRequest } from '../../../dtos/role/requests/RoleCommonFilterRequest';
import { RoleCreateData } from '../../../dtos/role/data/RoleCreateData';
import { RoleFilterRequest } from '../../../dtos/role/requests/RoleFilterRequest';
import { RoleUpdateData } from '../../../dtos/role/data/RoleUpdateData';

export interface IRoleRepository {
    /**
     * Get all roles with caching mode.
     */
    getAll(): Promise<Role[]>;

    /**
     * Get all roles with caching mode, we can set the time for caching expiration.
     * @param expireTimeCaching config expire time.
     */
    getAll(expireTimeCaching: number): Promise<Role[]>;

    find(filter: RoleFilterRequest): Promise<[Role[], number]>;

    findCommon(filter: RoleCommonFilterRequest): Promise<[Role[], number]>;

    getById(id: number): Promise<Role | undefined>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: number): Promise<boolean>;

    create(data: RoleCreateData): Promise<number | undefined>;
    create(data: RoleCreateData, queryRunner: QueryRunner): Promise<number | undefined>;

    update(id: number, data: RoleUpdateData): Promise<boolean>;

    delete(id: number): Promise<boolean>;

    clearCaching(): Promise<void>;
}
