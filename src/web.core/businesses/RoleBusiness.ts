import { Inject, Service } from 'typedi';
import { mapModel, mapModels } from '../../libs/common';
import { IRoleBusiness } from '../interfaces/businesses/IRoleBusiness';
import { IRoleRepository } from '../interfaces/gateways/data/IRoleRepository';
import { ResultListResponse } from '../dtos/common/ResultListResponse';
import { Role } from '../models/Role';
import { RoleCommonFilterRequest } from '../dtos/role/requests/RoleCommonFilterRequest';
import { RoleCommonResponse } from '../dtos/role/responses/RoleCommonResponse';
import { RoleCreateRequest } from '../dtos/role/requests/RoleCreateRequest';
import { RoleFilterRequest } from '../dtos/role/requests/RoleFilterRequest';
import { RoleResponse } from '../dtos/role/responses/RoleResponse';
import { RoleUpdateRequest } from '../dtos/role/requests/RoleUpdateRequest';
import { SystemError } from '../dtos/common/Exception';
import { UserAuthenticated } from '../dtos/user/UserAuthenticated';

@Service('role.business')
export class RoleBusiness implements IRoleBusiness {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async find(filter: RoleFilterRequest, userAuth?: UserAuthenticated): Promise<ResultListResponse<RoleResponse>> {
        filter.level = userAuth && userAuth.role.level;
        const [list, count] = await this._roleRepository.find(filter);
        return filter.toResultList(mapModels(RoleResponse, list), count);
    }

    async findCommon(filter: RoleCommonFilterRequest, userAuth?: UserAuthenticated): Promise<ResultListResponse<RoleCommonResponse>> {
        filter.level = userAuth && userAuth.role.level;
        const [list, count] = await this._roleRepository.findCommon(filter);
        return filter.toResultList(mapModels(RoleCommonResponse, list), count);
    }

    async getById(id: number, userAuth?: UserAuthenticated): Promise<RoleResponse | undefined> {
        const role = await this._roleRepository.getById(id);
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

        if (await this._roleRepository.checkNameExist(role.name))
            throw new SystemError(1005, 'name');

        const id = await this._roleRepository.create(role);
        if (!id)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        const newData = await this._roleRepository.getById(id);
        return mapModel(RoleResponse, newData);
    }

    async update(id: number, data: RoleUpdateRequest, userAuth?: UserAuthenticated): Promise<RoleResponse | undefined > {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (userAuth && (role.level <= userAuth.role.level || data.level <= userAuth.role.level))
            throw new SystemError(3);

        role.name = data.name;
        role.level = data.level;

        if (await this._roleRepository.checkNameExist(role.name, id))
            throw new SystemError(1005, 'name');

        const hasSucceed = await this._roleRepository.update(id, role);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        const newData = await this._roleRepository.getById(id);
        return mapModel(RoleResponse, newData);
    }

    async delete(id: number, userAuth?: UserAuthenticated): Promise<boolean> {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (userAuth && role.level <= userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._roleRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return hasSucceed;
    }
}
