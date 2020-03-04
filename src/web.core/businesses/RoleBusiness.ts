import { Inject, Service } from 'typedi';
import { mapModel, mapModels } from '../../libs/common';
import { IRoleBusiness } from '../interfaces/businesses/IRoleBusiness';
import { IRoleRepository } from '../interfaces/gateways/data/IRoleRepository';
import { ResultListResponse } from '../dtos/common/ResultListResponse';
import { Role } from '../models/Role';
import { RoleCreateRequest } from '../dtos/role/requests/RoleCreateRequest';
import { RoleFilterRequest } from '../dtos/role/requests/RoleFilterRequest';
import { RoleLookupFilterRequest } from '../dtos/role/requests/RoleLookupFilterRequest';
import { RoleLookupResponse } from '../dtos/role/responses/RoleLookupResponse';
import { RoleResponse } from '../dtos/role/responses/RoleResponse';
import { RoleUpdateRequest } from '../dtos/role/requests/RoleUpdateRequest';
import { SystemError } from '../dtos/common/Exception';
import { UserAuthenticated } from '../dtos/user/UserAuthenticated';

@Service('role.business')
export class RoleBusiness implements IRoleBusiness {
    @Inject('role.repository')
    private readonly roleRepository: IRoleRepository;

    async find(filter: RoleFilterRequest, userAuth?: UserAuthenticated): Promise<ResultListResponse<RoleResponse>> {
        filter.level = userAuth && userAuth.role.level;
        const [list, count] = await this.roleRepository.find(filter);
        return filter.toResultList(mapModels(RoleResponse, list), count);
    }

    async lookup(filter: RoleLookupFilterRequest, userAuth?: UserAuthenticated): Promise<ResultListResponse<RoleLookupResponse>> {
        filter.level = userAuth && userAuth.role.level;
        const [list, count] = await this.roleRepository.lookup(filter);
        return filter.toResultList(mapModels(RoleLookupResponse, list), count);
    }

    async getById(id: number, userAuth?: UserAuthenticated): Promise<RoleResponse | undefined> {
        const role = await this.roleRepository.getById(id);
        if (role && userAuth && role.level <= userAuth.role.level)
            return;
        return mapModel(RoleResponse, role);
    }

    async create(data: RoleCreateRequest, userAuth?: UserAuthenticated): Promise<RoleResponse | undefined> {
        const role = new Role();
        role.name = data.name;
        role.level = data.level;

        if (userAuth && role.level <= userAuth.role.level)
            throw new SystemError(3);

        if (await this.roleRepository.checkNameExist(role.name))
            throw new SystemError(1005, 'name');

        const id = await this.roleRepository.create(role);
        if (!id)
            throw new SystemError(5);

        await this.roleRepository.clearCaching();
        const newData = await this.roleRepository.getById(id);
        return mapModel(RoleResponse, newData);
    }

    async update(id: number, data: RoleUpdateRequest, userAuth?: UserAuthenticated): Promise<RoleResponse | undefined > {
        const role = await this.roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (userAuth && (role.level <= userAuth.role.level || data.level <= userAuth.role.level))
            throw new SystemError(3);

        role.name = data.name;
        role.level = data.level;

        if (await this.roleRepository.checkNameExist(role.name, id))
            throw new SystemError(1005, 'name');

        const result = await this.roleRepository.update(id, role);
        if (!result)
            throw new SystemError(5);

        await this.roleRepository.clearCaching();
        const newData = await this.roleRepository.getById(id);
        return mapModel(RoleResponse, newData);
    }

    async delete(id: number, userAuth?: UserAuthenticated): Promise<boolean> {
        const role = await this.roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (userAuth && role.level <= userAuth.role.level)
            throw new SystemError(3);

        const result = await this.roleRepository.delete(id);
        if (!result)
            throw new SystemError(5);

        await this.roleRepository.clearCaching();
        return result;
    }
}
