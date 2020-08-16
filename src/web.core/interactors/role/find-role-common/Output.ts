import { Role } from '../../../domain/entities/Role';

export class FindRoleCommonOutput {
    id: number;
    name: string;

    constructor(data: Role) {
        this.id = data.id;
        this.name = data.name;
    }
}
