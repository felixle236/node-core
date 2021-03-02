import { Manager } from '../../../../domain/entities/manager/Manager';
import { Role } from '../../../../domain/entities/role/Role';

class RoleResult {
    id: string;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}

export class GetManagerByIdQueryResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    roleId: string;
    firstName: string;
    lastName: string | null;
    email: string;
    avatar: string | null;
    archivedAt: Date | null;

    role: RoleResult | null;

    constructor(data: Manager) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.roleId = data.roleId;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.avatar = data.avatar;
        this.archivedAt = data.archivedAt;

        this.role = data.role && new RoleResult(data.role);
    }
}
