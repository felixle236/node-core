import { ResultListResponse } from '../../dtos/common/ResultListResponse';
import { RoleCommonFilterRequest } from '../../dtos/role/requests/RoleCommonFilterRequest';
import { RoleCommonResponse } from '../../dtos/role/responses/RoleCommonResponse';
import { RoleCreateRequest } from '../../dtos/role/requests/RoleCreateRequest';
import { RoleFilterRequest } from '../../dtos/role/requests/RoleFilterRequest';
import { RoleResponse } from '../../dtos/role/responses/RoleResponse';
import { RoleUpdateRequest } from '../../dtos/role/requests/RoleUpdateRequest';
import { UserAuthenticated } from '../../dtos/common/UserAuthenticated';

export interface IRoleBusiness {
    find(filter: RoleFilterRequest, userAuth: UserAuthenticated): Promise<ResultListResponse<RoleResponse>>;

    findCommon(filter: RoleCommonFilterRequest, userAuth: UserAuthenticated): Promise<ResultListResponse<RoleCommonResponse>>;

    getById(id: number, userAuth: UserAuthenticated): Promise<RoleResponse | undefined>;

    create(data: RoleCreateRequest, userAuth: UserAuthenticated): Promise<RoleResponse | undefined>;

    update(id: number, data: RoleUpdateRequest, userAuth: UserAuthenticated): Promise<RoleResponse | undefined>;

    delete(id: number, userAuth: UserAuthenticated): Promise<boolean>;
}
