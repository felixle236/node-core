import { Role } from '../../../../domain/entities/role/Role';

export class FindRoleQueryResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.name = data.name;
    }
}
