import { Role } from '../entities/Role';

export class UserAuthenticated {
    userId: number;
    role: RoleAuthenticated;

    constructor(userId: number, role: Role) {
        this.userId = userId;
        this.role = new RoleAuthenticated(role);
    }
}

class RoleAuthenticated {
    id: number;
    name: string;
    level: number;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
        this.level = data.level;
    }
}
