import { RoleId } from '../enums/role/RoleId';

export class UserAuthenticated {
    userId: string;
    roleId: RoleId;

    constructor(userId: string, roleId: RoleId) {
        this.userId = userId;
        this.roleId = roleId;
    }
}
