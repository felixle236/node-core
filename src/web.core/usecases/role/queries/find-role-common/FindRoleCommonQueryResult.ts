import { Role } from '../../../../domain/entities/role/Role';

export class FindRoleCommonQueryResult {
    id: string;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}
