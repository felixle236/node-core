import { IInputModel } from '../../../../web.core/domain/common/inputs/IInputModel';
import { Role } from '../../../../web.core/domain/entities/Role';

export class RoleCreate implements IInputModel<Role> {
    name: string;
    level: number;

    toEntity(): Role {
        const entity = new Role();
        entity.name = this.name;
        entity.level = this.level;
        return entity;
    }
}
