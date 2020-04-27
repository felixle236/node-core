import { Inject, Service } from 'typedi';
import { mapModel, mapModels } from '../../libs/common';
import { ClaimResponse } from '../dtos/permission/responses/ClaimResponse';
import { IPermissionBusiness } from '../interfaces/businesses/IPermissionBusiness';
import { IPermissionRepository } from '../interfaces/gateways/data/IPermissionRepository';
import { IRoleRepository } from '../interfaces/gateways/data/IRoleRepository';
import { Permission } from '../models/Permission';
import { PermissionCreateRequest } from '../dtos/permission/requests/PermissionCreateRequest';
import { PermissionResponse } from '../dtos/permission/responses/PermissionResponse';
import { SystemError } from '../dtos/common/Exception';
import { UserAuthenticated } from '../dtos/user/UserAuthenticated';

@Service('permission.business')
export class PermissionBusiness implements IPermissionBusiness {
    @Inject('role.repository')
    private readonly roleRepository: IRoleRepository;

    @Inject('permission.repository')
    private readonly permissionRepository: IPermissionRepository;

    async getClaims(): Promise<ClaimResponse[]> {
        return await this.permissionRepository.getClaims();
    }

    async getAllByRole(roleId: number, userAuth?: UserAuthenticated): Promise<PermissionResponse[]> {
        let permissions: Permission[];
        if (!userAuth)
            permissions = await this.permissionRepository.getAllByRole(roleId); // Get permissions from cache
        else {
            const roles = await this.roleRepository.getAll(); // Get permissions from cache
            const role = roles.find(role => role.id === roleId);
            if (!role)
                throw new SystemError(1004, 'role');

            if (userAuth.role.level >= role.level)
                throw new SystemError(3);

            permissions = await this.permissionRepository.getAllByRole(roleId); // Get permissions from cache
        }
        return mapModels(PermissionResponse, permissions);
    }

    async getById(id: number, userAuth?: UserAuthenticated): Promise<PermissionResponse | undefined> {
        const permission = await this.permissionRepository.getById(id);
        if (permission && userAuth && permission.role && permission.role.level <= userAuth.role.level)
            return;
        return mapModel(PermissionResponse, permission);
    }

    async create(data: PermissionCreateRequest, userAuth?: UserAuthenticated): Promise<PermissionResponse | undefined> {
        const permission = new Permission();
        permission.roleId = data.roleId;
        permission.claim = data.claim;

        const role = await this.roleRepository.getById(permission.roleId);
        if (!role)
            throw new SystemError(1004, 'role');

        if (userAuth && userAuth.role.level >= role.level)
            throw new SystemError(3);

        const permissions = await this.permissionRepository.getAllByRole(permission.roleId);
        if (permissions.find(p => p.claim === permission.claim))
            throw new SystemError(1005, 'permission');

        const id = await this.permissionRepository.create(permission);
        if (!id)
            throw new SystemError(5);

        await this.permissionRepository.clearCaching();
        const result = await this.permissionRepository.getById(id);
        return mapModel(PermissionResponse, result);
    }

    async delete(id: number, userAuth?: UserAuthenticated): Promise<boolean> {
        const permission = await this.permissionRepository.getById(id);
        if (!permission)
            throw new SystemError(1004, 'permission');

        if (userAuth && permission.role && userAuth.role.level >= permission.role.level)
            throw new SystemError(3);

        const result = await this.permissionRepository.delete(id);
        if (result) await this.permissionRepository.clearCaching();
        return result;
    }
}
