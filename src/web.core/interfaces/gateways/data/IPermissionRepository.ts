import { ClaimResponse } from '../../../dtos/permission/responses/ClaimResponse';
import { Permission } from '../../../models/Permission';
import { QueryRunner } from 'typeorm';

export interface IPermissionRepository {
    getClaims(): Promise<ClaimResponse[]>;

    /**
     * Get all permissions by role with caching mode.
     * @param roleId role id.
     */
    getAllByRole(roleId: number): Promise<Permission[]>;

    /**
     * Get all permission by role with caching mode, we can set the time for caching expiration.
     * @param roleId role id.
     * @param expireTimeCaching config expire time.
     */
    getAllByRole(roleId: number, expireTimeCaching: number): Promise<Permission[]>;

    getById(id: number): Promise<Permission | undefined>;

    create(permission: Permission): Promise<number | undefined>;
    create(permission: Permission, queryRunner: QueryRunner): Promise<number | undefined>;

    delete(id: number): Promise<boolean>;

    clearCaching(): Promise<void>;
}
