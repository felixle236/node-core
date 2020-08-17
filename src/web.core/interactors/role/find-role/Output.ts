import { Role } from '../../../domain/entities/Role';

export class FindRoleOutput {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;
    level: number;

    constructor(data: Role) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.name = data.name;
        this.level = data.level;
    }
}
