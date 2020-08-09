import { Inject, Service } from 'typedi';
import { IRoleInteractor } from '../boundaries/interactors/IRoleInteractor';
import { ResultList } from '../../domain/common/output/ResultList';
import { Role } from '../../domain/entities/Role';
import { SystemError } from '../../dtos/common/Exception';
import { UserAuthenticated } from '../../dtos/common/UserAuthenticated';

@Service('role.interactor')
export class RoleInteractor implements IRoleInteractor {
    @Inject('role.repository')
    private readonly _roleRepository: IRoleRepository;

    async find(filter: RoleFilterRequest, userAuth: UserAuthenticated): Promise<ResultList<RoleResponse>> {
        filter.userAuth = userAuth;
        const [list, count] = await this._roleRepository.find(filter);
        return filter.toResultList(mapModels(RoleResponse, list), count);
    }

    async findCommon(filter: RoleCommonFilterRequest, userAuth: UserAuthenticated): Promise<ResultList<RoleCommonResponse>> {
        filter.userAuth = userAuth;
        const [list, count] = await this._roleRepository.findCommon(filter);
        return filter.toResultList(mapModels(RoleCommonResponse, list), count);
    }

    async getById(id: number, userAuth: UserAuthenticated): Promise<RoleResponse | undefined> {
        const role = await this._roleRepository.getById(id);
        if (!role || role.level <= userAuth.role.level)
            return;
        return mapModel(RoleResponse, role);
    }

    async create(data: RoleCreateRequest, userAuth: UserAuthenticated): Promise<RoleResponse | undefined> {
        const role = new Role();
        role.name = data.name;
        role.level = data.level;

        if (role.level <= userAuth.role.level)
            throw new SystemError(3);

        if (await this._roleRepository.checkNameExist(role.name))
            throw new SystemError(1005, 'name');

        const createData = role.toCreateData();
        const id = await this._roleRepository.create(createData);
        if (!id)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        const newData = await this._roleRepository.getById(id);
        return mapModel(RoleResponse, newData);
    }

    async update(id: number, data: RoleUpdateRequest, userAuth: UserAuthenticated): Promise<RoleResponse | undefined > {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (role.level <= userAuth.role.level || data.level <= userAuth.role.level)
            throw new SystemError(3);

        role.name = data.name;
        role.level = data.level;

        if (await this._roleRepository.checkNameExist(role.name, id))
            throw new SystemError(1005, 'name');

        const updateData = role.toUpdateData();
        const hasSucceed = await this._roleRepository.update(id, updateData);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        const newData = await this._roleRepository.getById(id);
        return mapModel(RoleResponse, newData);
    }

    async delete(id: number, userAuth: UserAuthenticated): Promise<boolean> {
        const role = await this._roleRepository.getById(id);
        if (!role)
            throw new SystemError(1004, 'role');

        if (role.level <= userAuth.role.level)
            throw new SystemError(3);

        const hasSucceed = await this._roleRepository.delete(id);
        if (!hasSucceed)
            throw new SystemError(5);

        await this._roleRepository.clearCaching();
        return hasSucceed;
    }
}
