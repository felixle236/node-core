import { ClaimResponse } from '../../dtos/permission/responses/ClaimResponse';
import { PermissionCreateRequest } from '../../dtos/permission/requests/PermissionCreateRequest';
import { PermissionResponse } from '../../dtos/permission/responses/PermissionResponse';
import { UserAuthenticated } from '../../dtos/user/UserAuthenticated';

export interface IPermissionBusiness {
    /**
     * Get claims, can be used for frontend.
     */
    getClaims(): Promise<ClaimResponse[]>;

    getAllByRole(roleId: number): Promise<PermissionResponse[]>;
    getAllByRole(roleId: number, userAuth: UserAuthenticated): Promise<PermissionResponse[]>;

    getById(id: number): Promise<PermissionResponse | undefined>;
    getById(id: number, userAuth: UserAuthenticated): Promise<PermissionResponse | undefined>;

    create(data: PermissionCreateRequest): Promise<PermissionResponse | undefined>;
    create(data: PermissionCreateRequest, userAuth: UserAuthenticated): Promise<PermissionResponse | undefined>;

    delete(id: number): Promise<boolean>;
    delete(id: number, userAuth: UserAuthenticated): Promise<boolean>;
}
