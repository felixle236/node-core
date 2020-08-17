import { Role } from '../entities/Role';

export class UserAuthenticated {
    userId: string;
    role: RoleAuthenticated;

    constructor(userId: string, role: Role) {
        this.userId = userId;
        this.role = new RoleAuthenticated(role);
    }
}

class RoleAuthenticated {
    id: string;
    name: string;
    level: number;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
        this.level = data.level;
    }
}
