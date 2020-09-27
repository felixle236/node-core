import { RoleId } from '../enums/RoleId';

export class UserAuthenticated {
    userId: string;
    roleId: RoleId;

    constructor(userId: string, roleId: RoleId) {
        this.userId = userId;
        this.roleId = roleId;
    }
}
