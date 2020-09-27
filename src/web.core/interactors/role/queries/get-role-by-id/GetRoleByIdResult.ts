import { Role } from '../../../../domain/entities/Role';

export class GetRoleByIdResult {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
        this.deletedAt = data.deletedAt;
        this.name = data.name;
    }
}
