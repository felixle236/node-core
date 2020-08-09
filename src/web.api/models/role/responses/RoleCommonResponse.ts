import { Role } from '../../../models/Role';

export class RoleCommonResponse {
    id: number;
    name: string;
    level: number;

    constructor(model: Role) {
        this.id = model.id;
        this.name = model.name;
        this.level = model.level;
    }
}
