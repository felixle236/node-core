import { ClaimResponse } from '../../../dtos/permission/responses/ClaimResponse';
import { Permission } from '../../../models/Permission';
import { QueryRunner } from 'typeorm';

export interface IPermissionRepository {
    getClaims(): Promise<ClaimResponse[]>;

    getAllByRole(roleId: number): Promise<Permission[]>;
    getAllByRole(roleId: number, expireTimeCaching: number): Promise<Permission[]>;

    getById(id: number): Promise<Permission | undefined>;

    create(permission: Permission): Promise<number | undefined>;
    create(permission: Permission, queryRunner: QueryRunner): Promise<number | undefined>;

    delete(id: number): Promise<boolean>;

    clearCaching(): Promise<void>;
}
