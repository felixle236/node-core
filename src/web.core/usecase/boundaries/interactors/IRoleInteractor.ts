import { IRoleCommonFilter } from '../filters/role/IRoleCommonFilter';
import { IRoleFilter } from '../filters/role/IRoleFilter';
import { ResultListResponse } from '../../../dtos/common/ResultListResponse';
import { RoleCommonResponse } from '../../../dtos/role/responses/RoleCommonResponse';
import { RoleCreateRequest } from '../../../dtos/role/requests/RoleCreateRequest';
import { RoleResponse } from '../../../dtos/role/responses/RoleResponse';
import { RoleUpdateRequest } from '../../../dtos/role/requests/RoleUpdateRequest';
import { UserAuthenticated } from '../../../dtos/common/UserAuthenticated';

export interface IRoleInteractor {
    find(filter: IRoleFilter, userAuth: UserAuthenticated): Promise<ResultListResponse<RoleResponse>>;

    findCommon(filter: IRoleCommonFilter, userAuth: UserAuthenticated): Promise<ResultListResponse<RoleCommonResponse>>;

    getById(id: number, userAuth: UserAuthenticated): Promise<RoleResponse | undefined>;

    create(data: RoleCreateRequest, userAuth: UserAuthenticated): Promise<RoleResponse | undefined>;

    update(id: number, data: RoleUpdateRequest, userAuth: UserAuthenticated): Promise<RoleResponse | undefined>;

    delete(id: number, userAuth: UserAuthenticated): Promise<boolean>;
}
