import { QueryRunner } from 'typeorm';
import { Role } from '../../../models/Role';
import { RoleFilterRequest } from '../../../dtos/role/requests/RoleFilterRequest';
import { RoleLookupFilterRequest } from '../../../dtos/role/requests/RoleLookupFilterRequest';

export interface IRoleRepository {
    getAll(): Promise<Role[]>;
    getAll(expireTimeCaching: number): Promise<Role[]>;

    find(filter: RoleFilterRequest): Promise<[Role[], number]>;

    lookup(filter: RoleLookupFilterRequest): Promise<[Role[], number]>;

    getById(id: number): Promise<Role | undefined>;

    checkNameExist(name: string): Promise<boolean>;
    checkNameExist(name: string, excludeId: number): Promise<boolean>;

    create(data: Role): Promise<number | undefined>;
    create(data: Role, queryRunner: QueryRunner): Promise<number | undefined>;

    update(id: number, data: Role): Promise<boolean>;

    delete(id: number): Promise<boolean>;

    clearCaching(): Promise<void>;
}
