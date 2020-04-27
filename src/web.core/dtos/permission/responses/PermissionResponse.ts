import { Permission } from '../../../models/Permission';
import { RoleResponse } from '../../role/responses/RoleResponse';
import { mapModel } from '../../../../libs/common';

export class PermissionResponse {
    id: number;
    roleId: number;
    claim: number;

    role?: RoleResponse;

    constructor(model: Permission) {
        this.id = model.id;
        this.roleId = model.roleId;
        this.claim = model.claim;

        this.role = mapModel(RoleResponse, model.role);
    }
}
