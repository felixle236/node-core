import { IRoleCommonFilter } from '../models/role/IRoleCommonFilter';
import { IRoleFilter } from '../models/role/IRoleFilter';
import { QueryRunner } from 'typeorm';
import { Role } from '../../domain/entities/Role';

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

    find(filter: IRoleFilter): Promise<[Role[], number]>;

    findCommon(filter: IRoleCommonFilter): Promise<[Role[], number]>;

    getById(id: number): Promise<Role | undefined>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: number): Promise<boolean>;

    create(data: Role): Promise<number | undefined>;
    create(data: Role, queryRunner: QueryRunner): Promise<number | undefined>;

    update(id: number, data: Role): Promise<boolean>;

    delete(id: number): Promise<boolean>;

    clearCaching(): Promise<void>;
}
