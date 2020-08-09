import { Role } from '../../../models/Role';

export class RoleResponse {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    level: number;

    constructor(model: Role) {
        this.id = model.id;
        this.createdAt = model.createdAt;
        this.updatedAt = model.updatedAt;
        this.name = model.name;
        this.level = model.level;
    }
}
